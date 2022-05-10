'use strict';

import User from '../models/User'
import crypto from 'crypto'
import { generateJWT } from '../utils/authServices';
import bcrypt from 'bcrypt'
import { Response, Request } from 'express'
import { IUserInfo } from '../utils/authServices'

export const register = async (req: Request, res: Response) => {
    try{
        const newUser = await User.create({    
            ...req.body,
            hash_password: bcrypt.hashSync(req.body.password, 8),
            emailToken: crypto.randomBytes(64).toString('hex'),
        })
        const userInfo: IUserInfo = {
            id: newUser.id,
            userName: newUser.userName,
            isAdmin: newUser.isAdmin,
            email: newUser.email,
            avartar: newUser.avartar,
        }

        // await emailTransporter.sendMail(mailOptions(newUser.userName, newUser.email, newUser.emailToken))

        return res.json({status: 200, resultData: {...userInfo, jwt: generateJWT(userInfo)}})
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
                    email: user.email,
                    avartar: user.avartar,
                }
                return res.json({status: 200, resultData: {...userInfo, jwt: generateJWT(userInfo)}})
            }
        }
    }
    catch(err: any){
        // console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    try{
        const user = await User.findOne({emailToken: req.body.emailToken})
        if(user !== null) {
            user.isVerified = true
            user.emailToken = null
            await user.save()
            return res.json({status: 200})
        }
        return res.json({status: 404})
    }
    catch(err: any) {
        console.log(err)
    }
}