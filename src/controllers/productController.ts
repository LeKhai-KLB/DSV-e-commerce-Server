'use strict';

import Product from '../models/Product'
import Category from '../models/Category'
import Color from '../models/Color'
import Brand from '../models/Brand'
import Review from '../models/Review'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose';

// ADD PRODUCT
export const passingProductData = async (req: Request, res: Response,next: NextFunction) => {
    try{
        // handle categories
        const categories = req.body.categories
        const pasingCategories:Array<any> = []
        const categoryDocs = await Category.find().where('name').in(categories).select('name tree')
            .collation({locale: 'vi', strength: 2})
        for(let i = 0; i < categories.length; i++) {
            const checkIndex = categoryDocs.findIndex(c => c.name.toLowerCase() === categories[i].toLowerCase());
            if(checkIndex === -1){
                const tree = categories.slice(0, i <= 2 ? i:2)
                tree.unshift('Root')
                const name = categories[i]
                const newCategory = await Category.create({
                    name: name[0].toUpperCase() + name.slice(1), 
                    tree: tree.map((t:any) => t[0].toUpperCase() + t.slice(1)),
                    parent: tree[i <= 1 ? i:2]
                }, {new: true})
                pasingCategories.push(newCategory)
            }
            else{
                pasingCategories.push(categoryDocs[checkIndex])
            }
        }

        // handle colors
        const colors = req.body.colors
        const colorsId:Array<mongoose.Schema.Types.ObjectId> = []
        const colorsTitle = colors.map((c: any) => c.title)
        const colorDocs = await Color.find().where('title').in(colorsTitle).select('title')
        for(let i = 0; i < colors.length; i++){
            const checkIndex = colorDocs.findIndex(c => c.title === colors[i].title);
            if(checkIndex === -1){
                const newColor =  await Color.create({
                    title: colors[i].title,
                    value: colors[i].value
                })
                colorsId.push(newColor._id)
            }
            else{
                colorsId.push(colorDocs[checkIndex]._id)
            }
        }

        // handles brand
        let brandId:mongoose.Schema.Types.ObjectId

        const brandSearchResult = await Brand.findOne({name: req.body?.brand ? req.body.brand:'no brand'}).collation({locale: 'vi', strength: 2})
        if(brandSearchResult === null){
            const name = req.body?.brand ? req.body.brand:'no brand'
            const newBrand = await Brand.create({
                name: name[0].toUpperCase() + name.slice(1)
            })
            brandId = newBrand._id
        }
        else{
            brandId = brandSearchResult._id
        }

        
        const categoriesId = pasingCategories.filter(c => {
            if(c.tree.length === 3) return c._id
        })
        // add new product
        req.body = {
            ...req.body,
            categories: categoriesId,
            brand: brandId,
            colors: colorsId
        }
        next()
    }
    catch(err: any){
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const addProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({name: req.body.name})
                .collation({locale: 'vi', strength: 2})
        if(product === null){
            const newProduct = await Product.create(req.body)
            return res.json({status: 200, resultData: newProduct})
        }
        else{
            throw new Error('duplicate product name')
        }
    }
    catch(err: any) {
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const {_id, ...productData} = req.body
        const product = await Product.findOneAndUpdate({_id: req.body._id}, productData, {new: true})
        if(product === null) {
            throw new Error('Can not find current product')
        }
        else {
            return res.json({status: 200, resultData: product})
        }
    }
    catch(err: any) {
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET PRODUCTS AND SORT BY A-Z
export const getProducts_SortAtoZ = async (req: Request, res: Response) => {
    try {
        const { search, first, last } = req.query
        const products = await Product.find({name: {$regex: new RegExp(`${search}`, 'gi')}})
        .populate(['brand', 'colors', 'categories']).collation({locale: 'vi', caseLevel: true})
        if(products.length === 0) {
            return res.json({ status: 404, errorMessage: 'Can not find any products'})
        }
        else {
            const temp = products.map(m => m.name)
            return res.json({status: 200, resultData: {
                products: products.slice(Number(first), Number(last) > products.length ? products.length: Number(last)),
                remainingLength: products.length
            }})
        }
    }
    catch(err: any) {
        // console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET PRODUCTS AND SORT BY Z-A
export const getProducts_SortZtoA = async (req: Request, res: Response) => {
    try {
        const { search, first, last } = req.query
        const products = await Product.find({name: {$regex: new RegExp(`${search}`, 'gi')}})
        .populate(['brand', 'colors', 'categories']).collation({locale: 'vi', caseLevel: true})
        if(products.length === 0) {
            return res.json({ status: 404, errorMessage: 'Can not find any products'})
        }
        else {
            const newProducts = products.reverse().slice(Number(first), Number(last) > products.length ? products.length: Number(last))
            return res.json({status: 200, resultData: {
                products: newProducts,
                remainingLength: products.length
            }})
        }
    }
    catch(err: any) {
        // console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET ALL PRODUCTS AND SORT BY DATE ADDED
export const getProducts_SortByDateAdded = async (req: Request, res: Response) => {
    try {
        const { search, first, last } = req.query
        const products = await Product.find({name: {$regex: new RegExp(`${search}`, 'gi')}})
            .sort({_id: -1})
            .populate(['brand', 'colors', 'categories'])

        if(products.length === 0) {
            return res.json({ status: 404, errorMessage: 'Can not find any products'})
        }
        else {
            const temp = products.map(m => m.name)
            return res.json({status: 200, resultData: {
                products: products.slice(Number(first), Number(last) > products.length ? products.length: Number(last)),
                remainingLength: products.length
            }})
        }
    }
    catch(err: any) {
        // console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// DELETE PRODUCT 
export const deleteProduct = async (req: Request, res: Response) => {
    try{
        const {id} = req.body
        await Review.deleteOne({productId: id})
        await Product.deleteOne({_id: id})
        return res.json({status: 200})
    }
    catch (err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}