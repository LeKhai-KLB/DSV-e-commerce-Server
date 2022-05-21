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

// PASSING PRODUCT FILTER DATA
export const passingProductFilterData = (req: Request, res: Response, next: NextFunction) => {
    const {searchValue, category, size, color, brand, price, available, sortValue, slice} = req.body
    let passingObject:any
    if(searchValue) {
        if(searchValue !== '') {
            const regex = new RegExp(`${searchValue}`, 'gi')
            passingObject = {'name': {$regex: regex}}
        }
    }
    else{
        if(category) {
            if(String(category).includes('All')) {
                const splitCategory:Array<string> = String(category).split(' ')
                passingObject = {'categories.parent': splitCategory[1]}
            }
            else {
                passingObject = {'categories.name': category}
            }
        }
        if(size) {
            const tempKey:string = `inStock.${size}`
            let tempObj: {[k:string]: any} = {}
            tempObj[tempKey] = {'$gte': 1}
            passingObject = {...passingObject, ...tempObj}
        }
        if(color) {
            const colorTitle = {'colors.title': color} 
            passingObject = {...passingObject, ...colorTitle}
        }
        if(brand) {
            if(!String(brand).includes('All')) {
                const brandName = {'brand.name': brand}
                passingObject = {...passingObject, ...brandName}
            }
        }
        if(price) {
            const priceRange:Array<string> = String(price).split('-')
            const tempPriceRange = {'price': {'$gte': Number(priceRange[0]), '$lte': Number(priceRange[1])}}
            passingObject = {...passingObject, ...tempPriceRange}
        }
        if(available){
            if(String(available) !== 'All') {
                let val:object
                if(available === 'In-store')
                    val = {'$gte': 1}
                else
                    val = {'$lte': 0}
                const queryByQuantity:Array<object> = [
                    {
                        'inStock.s': val
                    },
                    {
                        'inStock.m': val
                    },
                    {
                        'inStock.m': val
                    },
                ]
                passingObject.$or = queryByQuantity
            }
        }
    }
    if(sortValue) {
        const sortValueAsString = String(sortValue)
        let newSortValue:any
        if(sortValueAsString === 'Date added') {
            newSortValue = {'_id': -1}
        }
        else if(sortValueAsString === 'A - Z') {
            newSortValue = {'name': 1}
        }
        else {
            newSortValue = {'name': -1}
        }
        passingObject = {...passingObject, sortValue: {...newSortValue}}
    }
    if(slice){
        const sliceRange:Array<string> = String(slice).split('-')
        const tempSlice = {'slice': {first: Number(sliceRange[0]), last: Number(sliceRange[1])}}
        passingObject = {...passingObject, ...tempSlice}
    }
    req.body = passingObject
    next()
}

// GET PRODUCTS BY FILTER AND SORT VALUE
export const getProductsByFilterAndSortValue = async (req: Request, res: Response) => {
    try {
        const { sortValue, slice, ...filterData } = req.body
        const products = await Product.aggregate()
            .lookup({
                from: 'categories',
                localField: 'categories',
                foreignField: '_id',
                as: 'categories'
            })
            .lookup({
                from: 'colors',
                localField: 'colors',
                foreignField: '_id',
                as: 'colors'
            })
            .lookup({
                from: 'brands',
                localField: 'brand',
                foreignField: '_id',
                as: 'brand'
            })
            .match(filterData)
            .sort(sortValue)
            .group({
                '_id': null,
                'remainingLength': {$sum: 1},
                'rootProducts': {'$push': '$$ROOT'}
            })
            .project({
                '_id': 0,
                'remainingLength': 1,
                'products': {'$slice': ['$rootProducts', slice.first, slice.last]}
            })

        if(products.length > 0){
            return res.json({status: 200, resultData: products[0]})
        }  
        else {
            throw new Error('Could not find any products')
        }
    }
    catch (err: any) {
        // console.error(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET PRODUCTS BY ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({_id: req.query.id}).populate(['brand', 'colors', 'categories'])
        if(product) {
            return res.json({status: 200, resultData: product})
        }
        else {
            throw new Error('Could not find product')
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