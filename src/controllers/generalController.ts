'use strict';

import Category from '../models/Category'
import { Request, Response } from 'express'

// ADD CATEGORY
export const addCategory = async(req: Request, res: Response) => {
    try{
        const category = await Category.findOne({id: req.body.id})
            .collation({locale: 'vi', strength: 2})
        if(category === null){
            const newCategory = await Category.create({...req.body})
            return res.json({status: 200, resultData: newCategory})
        }
        else{
            throw new Error('dupplicate category id')
        }
    }
    catch(err: any){
        console.log(err.message)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const testAuthorizationToken_user = (req: Request, res: Response) => {
    return res.json({status: 200, resultData: {isAdmin: false}})
}

export const testAuthorizationToken_admin = (req: Request, res: Response) => {
    return res.json({status: 200, resultData: {isAdmin: true}})
}