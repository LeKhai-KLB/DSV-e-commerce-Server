'use strict';

import Category from '../models/Category'
import Brand from '../models/Brand'
import Color from '../models/Color'
import { Request, Response } from 'express'

// ADD CATEGORY
export const addCategory = async(req: Request, res: Response) => {
    try{
        const category = await Category.findOne({name: req.body.name})
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



// GET CATEGORY WITH TREE LENGTH
export const getCategoriesByTreeLength = async (req: Request, res: Response) => {
    try{
        const length = req.query.length
        const categories = await Category.find({tree: {$size: Number(length)}})
        if(categories.length === 0){
            throw new Error("Can't fint any categories with this length")
        }
        else{
            const resultData:Array<any> = categories.map((c: any) => {
                return {
                    name: c.name,
                    tree: c.tree,
                    parent: c.parent
                }
            })
            return res.json({status:200, resultData: resultData})
        }
    }catch(err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const testAuthorizationToken_user = (req: Request, res: Response) => {
    return res.json({status: 200, resultData: req.body})
}

export const testAuthorizationToken_admin = (req: Request, res: Response) => {
    return res.json({status: 200, resultData: req.body})
}

export const getAllBrands = async (req: Request, res: Response) => {
    try{
        const brands = await Brand.find()
        return res.json({status: 200, resultData:brands})
    }
    catch (err: any) {
        return res.json({status: 404, errorMessage:err.message})
    }
}

export const getAllColors = async (req: Request, res: Response) => {
    try{
        const colors = await Color.find()
        return res.json({status: 200, resultData:colors})
    }
    catch(err: any) {
        return res.json({status: 404, errorMessage:err.message})
    }
}