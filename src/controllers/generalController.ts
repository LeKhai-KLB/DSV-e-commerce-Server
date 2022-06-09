'use strict';

import Category from '../models/Category'
import Brand from '../models/Brand'
import Color from '../models/Color'
import Product from '../models/Product'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import redisClient from '../connections/redis'

// ADD CATEGORY
export const addCategory = async(req: Request, res: Response) => {
    try{
        const promise = new Promise (async(resolve, reject) => {
            const categoryList = req.body.list.split('_');
            const root = await Category.findOne({name: 'root'})
            const newCategoryList = [root._id]
            for await (const value of categoryList) {
                const index = categoryList.findIndex((c:any) => c === value)
                if (value.match(/^[0-9a-fA-F]{24}$/)) {
                    const category = await Category.findOne({id: value})
                    if(category) {
                        const objId = new mongoose.Types.ObjectId(value)
                        newCategoryList.push(objId)
                    }
                    else {
                        reject("can't find current category")
                    }
                }
                else {
                    const newCategory = await Category.create({
                        name: value,
                        tree: newCategoryList.slice(0, index + 1),
                        parent: newCategoryList[index]
                    })
                    newCategoryList.push(newCategory._id)
                    if(index === categoryList.length - 1) {
                        console.log(newCategory)
                        resolve({
                            _id: newCategory._id,
                            name: newCategory.name
                        })
                    }
                }
            }
        })

        promise.then(data => {
            return res.json({status: 200, resultData: data})
        })
        .catch((err: any) => {throw new Error(err)})
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
            const path = categories
                .sort((a, b) => {
                    return a.tree.length - b.tree.length
                })
                .map(c => c.name).join(' / ')
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

// CLEAR ALL KEY REDIS
export const clearRedis = async (req: Request, res: Response) => {
    try {
        const temp = await redisClient.keys('*')
        await redisClient.flushAll()
        return res.json({status: 200, resultData: temp})
    }
    catch(err: any) {
        console.log(err.message)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET ALL REDIS KEYS 
export const getAllRedisKeys = async (req: Request, res: Response) => {
    try {
        const temp = await redisClient.keys('*')
        return res.json({status: 200, resultData: temp})
    }
    catch(err: any) {
        console.log(err.message)
        return res.json({status: 404, errorMessage: err.message})
    }
}