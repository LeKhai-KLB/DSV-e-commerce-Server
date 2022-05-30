'use strict';

import Category from '../models/Category'
import Brand from '../models/Brand'
import Color from '../models/Color'
import Product from '../models/Product'
import mongoose from 'mongoose'
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
            return res.json({status:200, resultData: categories})
        }
    }catch(err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET CATEGORIES WITH PARENT
export const getCategoriesPassByParent = async (req: Request, res: Response) => {
    try{
        const parent = req.query.parent
        const categories = await Category.find({parent: parent})
        if(categories.length === 0){
            throw new Error("Can't fint any categories with this length")
        }
        else{
            return res.json({status:200, resultData: categories})
        }
    }catch(err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET CATEGORY WITH CATEGORY ID LIST
export const getCategoryPathByIdList = async (req: Request, res: Response) => {
    try {
        const queryString = String(req.query.list)
        const newObjIdList:any = queryString.split('-').map(q => new mongoose.Types.ObjectId(q))
        const categories = await Category.find({_id: {$in: [...newObjIdList]}})
        if(categories.length !== 0) {
            const path = categories.map(c => c.name).join(' / ')
            return res.json({status: 200, resultData: path})
        }
        else 
            throw new Error('Can not find any category')
    }
    catch(err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}

// TEST USER TOKEN
export const testAuthorizationToken_user = (req: Request, res: Response) => {
    return res.json({status: 200, resultData: req.body})
}

// TEST ADMIN TOKEN
export const testAuthorizationToken_admin = (req: Request, res: Response) => {
    return res.json({status: 200, resultData: req.body})
}

// GET BRAND LIST 
export const getAllBrands = async (req: Request, res: Response) => {
    try{
        const brands = await Brand.find().sort({'name': 1})
        return res.json({status: 200, resultData:brands})
    }
    catch (err: any) {
        return res.json({status: 404, errorMessage:err.message})
    }
}

// GET ALL COLORS
export const getAllColors = async (req: Request, res: Response) => {
    try{
        const colors = await Color.find()
        return res.json({status: 200, resultData:colors})
    }
    catch(err: any) {
        return res.json({status: 404, errorMessage:err.message})
    }
}


// GET ALL BRANDS BY CATEGORY
export const getAllBrandPassByCategory = async (req: Request, res: Response) => {
    try {
        let filter:object
        const categoryObjId = new mongoose.Types.ObjectId(String(req.query.category)) 
        filter = {$or: [
            {'categoryInfoList.parent': categoryObjId}, 
            {'categoryInfoList._id': categoryObjId}
        ]}
        const brands = await Product.aggregate()
            .lookup({
                from: 'categories',
                localField: 'categories',
                foreignField: '_id',
                as: 'categoryInfoList'
            })
            .lookup({
                from: 'brands',
                localField: 'brand',
                foreignField: '_id',
                as: 'brandInfo'
            })
            .unwind('categoryInfoList','brandInfo')
            .match(filter)
            .group({
                '_id': '$brandInfo._id',
                'data': {$addToSet: '$brandInfo'}
            })
            .unwind('data')
            .project({
                '_id': '$data._id',
                'name': '$data.name',
            })
            .sort({'name': 1})
        return res.json({status: 200, resultData: brands})
    }
    catch(err: any) {
        return res.json({status: 404, errorMessage:err.message})
    }
} 