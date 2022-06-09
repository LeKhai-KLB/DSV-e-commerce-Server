'use strict';

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import redisClient from '../connections/redis'
// import nodemailer from 'nodemailer'

export interface IUserInfo {
    id: string,
    userName: string,
    isVerified: Boolean,
    isAdmin: boolean,
    email: string,
    avatar?: string,
}

export const generateJWT = (userInfo: IUserInfo) => {
    return jwt.sign({
        ...userInfo
    }, process.env.SECRET_KEY || '', { expiresIn: String(process.env.TOKEN_DAY_LIFE) + 'd'})
}

export const generateEmailJWT = (email: string) => {
    return jwt.sign({email: email}, process.env.SECRET_KEY || '', { expiresIn: '1d'})
}

export const authenToken = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization
    if(authorization){
        const token = authorization.split(' ')[1]
        jwt.verify(
            token, 
            process.env.SECRET_KEY as string,
            async (err: any, data: any) => {
                if(err){
                    res.json({status: 401, errorMessage: err.message})
                }
                else{
                    const storedToken = await redisClient.get(token)
                    if(storedToken){
                        req.body.user = data
                        next()
                    }
                    else{
                        res.json({status: 401, errorMessage: 'invalid token'})      
                    }
                }
            }
        )
    }
    else{
        res.json({status: 401, errorMessage: 'invalid token'})
    }
}  

export const authenEmailToken = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization
    if(authorization){
        const token = authorization.split(' ')[1]
        jwt.verify(
            token, 
            process.env.SECRET_KEY as string,
            async (err: any, data: any) => {
                if(err){
                    res.json({status: 401, errorMessage: err.message})
                }
                else{
                    req.body.email = data.email
                    next()
                }
            }
        )
    }
    else{
        res.json({status: 401, errorMessage: 'invalid token'})
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if(req.body?.user?.isAdmin){
        next()
    }
    else{
        res.json({status: 404, errorMessage: 'Invalid admin token'})
    }
}