'use strict';

import Category from '../models/Category'
import Brand from '../models/Brand'
import Color from '../models/Color'
import Product from '../models/Product'
import { Request, Response } from 'express'
import { FilterQuery } from 'mongoose'

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

// GET CATEGORIES WITH PARENT
export const getCategoriesPassByParent = async (req: Request, res: Response) => {
    try{
        const parent = req.query.parent
        const categories = await Category.find({parent: parent})
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
        const brands = await Brand.find().sort({'name': 1})
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

export const getAllBrandPassByCategory = async (req: Request, res: Response) => {
    try {
        let filter:object
        const categoryQuery:string = String(req.query.category)
        if(categoryQuery.includes('All')){
            filter = {'categoryInfoList.parent': {$regex: new RegExp(`${categoryQuery.split(' ')[1]}`, 'gi')}}
        }
        else{
            filter = {'categoryInfoList.name': {$regex: new RegExp(`${categoryQuery}`, 'gi')}}
        }
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