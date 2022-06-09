'use strict';

import User from '../models/User'
import { generateJWT, generateEmailJWT } from '../utils/authServices';
import bcrypt from 'bcrypt'
import { Response, Request } from 'express'
import { IUserInfo } from '../utils/authServices'
import redisClient from '../connections/redis';
import mailServices from '../utils/mailServices'
import otpGenerator from 'otp-generator'
import { deleteImage } from '../utils/firebaseServices'

export const register = async (req: Request, res: Response) => {
    try{
        const nameRegex = new RegExp('^[A-Za-z0-9 ]+$', 'g')
        const emailRegex = new RegExp('^(.+)@(.+)$')
        if(!nameRegex.test(req.body.name)) 
            throw new Error('invalid name')
        if(!emailRegex.test(req.body.email))
            throw new Error('invalid email')
        if(req.body.password.length < 7)
            throw new Error('password must be at least 7 characters')

        const newUser = await User.create({    
            ...req.body,
            hash_password: bcrypt.hashSync(req.body.password, 8),
        })

        const emailToken = generateEmailJWT(newUser.email)
        await mailServices.sendVerifyMail(newUser.userName, newUser.email, emailToken)

        return res.json({status: 200})
    }
    catch(err: any){
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const user = await User.findOne({email: req.body.email})
        if(user !== null) {
            if(bcrypt.compareSync(req.body.password, user.hash_password)){
                const userInfo: IUserInfo = {
                    id: user.id,
                    userName: user.userName,
                    isAdmin: user.isAdmin,
                    isVerified: user.isVerified,
                    email: user.email,
                    avatar: user.avatar,
                }
                const token = generateJWT(userInfo)
                await redisClient.setEx(token, Number(process.env.TOKEN_DAY_LIFE) * 86400, token)
                return res.json({status: 200, resultData: {...userInfo, jwt: token}})
            }
            else {
                return res.json({status: 404, errorMessage: 'not correct password'})
            }
        }
        return res.json({status:404, errorMessage:"Can't find user"})
    }
    catch(err: any){
        // console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const authorization = req.headers.authorization
        if(authorization){
            const token = authorization.split(' ')[1]
            await redisClient.del(token)
            return res.json({status: 200})
        }
        return res.json({status: 404, errorMessage: 'Unexpected error'})
    }
    catch(err: any){
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const setVerifiedEmail = async (req: Request, res: Response) => {
    try{
        const user = await User.findOne({email: req.body.email})
        if(user !== null) {
            if(!user.isVerified) {
                user.isVerified = true
                await user.save()
                return res.json({status: 200, resultData: req.body.email})
            }
            else {
                return res.json({status:401})
            }
        }
        return res.json({status: 404})
    }
    catch(err: any) {
        console.log(err)
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(user) {
            const newPassword = otpGenerator.generate(8)
            await mailServices.sendResetPasswordMail(req.body.email, newPassword)
            
            user.hash_password = bcrypt.hashSync(newPassword, 8)
            await user.save()

            return res.json({status: 200, resultData: req.body.email})
        }
        return res.json({status: 404, errorMessage: "can't find user of this email"})
    }
    catch(err: any) {
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const reSendVerifyEmail = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(user) {
            const emailToken = generateEmailJWT(user.email)
            await mailServices.sendVerifyMail(user.userName, user.email, emailToken)
            return res.json({status: 200})
        }
        return res.json({status: 404, errorMessage: "can't find user of this email"})
    }
    catch(err:any) {
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    } 
}

export const updateUserInfo = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({_id: req.body._id})
        if(user) {
            const nameRegex = new RegExp('^[A-Za-z0-9 ]+$', 'g')
            const emailRegex = new RegExp('^(.+)@(.+)$')
            if(!nameRegex.test(req.body.userName)) 
                throw new Error('invalid name')
            if(!emailRegex.test(req.body.email))
                throw new Error('invalid email')

            if(user?.avatar && req.body?.avatar) {
                if(user.avatar !== req.body.avatar){
                    await deleteImage(user.avatar)
                    user.avatar = req.body.avatar
                }
            }
            else 
                if(req.body?.avatar) 
                    user.avatar = req.body.avatar
            
            if(user.userName !== req.body.userName)
                user.userName = req.body.userName
            
            if(user.email !== req.body.email) {
                user.email = req.body.email
                user.isVerified = false
            }

            await user.save()
            const userInfo: IUserInfo = {
                id: user._id,
                userName: user.userName,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
                email: user.email,
                avatar: user.avatar,
            }
            return res.json({status: 200, resultData: userInfo})
        }
        return res.json({status: 404, errorMessage: "can't find user"})
    }
    catch(err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({_id: req.body._id})
        if(user) {
            if(!bcrypt.compareSync(req.body.password, user.hash_password)){
                throw new Error('Not correct password')
            }
            if(req.body.newPassword.length < 7) {
                throw new Error('Invalid new password')
            }

            user.hash_password = bcrypt.hashSync(req.body.newPassword, 8)
            await user.save()
            return res.json({status: 200})
        }
        return res.json({status: 404, errorMessage: "Can't find user"})
    }
    catch(err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}