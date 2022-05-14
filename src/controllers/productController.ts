'use strict';

import Product from '../models/Product'
import Category from '../models/Category'
import Color from '../models/Color'
import Brand from '../models/Brand'
import { Request, Response } from 'express'
import mongoose from 'mongoose';

// ADD PRODUCT
export const addProduct = async (req: Request, res: Response) => {
    try{
        // handle categories
        const categories = req.body.categories
        const categoriesId:Array<mongoose.Schema.Types.ObjectId> = []
        const categoryDocs = await Category.find().where('name').in(categories).select('name')
            .collation({locale: 'vi', strength: 2})
        for(let i = 0; i < categories.length; i++) {
            const checkIndex = categoryDocs.findIndex(c => c.name.toLowerCase() === categories[i].toLowerCase());
            if(checkIndex === -1){
                const tree = categories.slice(0, i <= 2 ? i:2)
                tree.unshift('Root')
                const name = categories[i]
                const newCategory = await Category.create({
                    name: name.charAt(0).toUpperCase() + name.slice(1), 
                    tree: tree.map((t:any) => t.charAt(0).toUpperCase() + t.slice(1)),
                    parent: tree[i <= 1 ? i:2]
                })
                categoriesId.push(newCategory._id)
            }
            else{
                categoriesId.push(categoryDocs[checkIndex]._id)
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
                name: name.charAt(0).toUpperCase() + name.slice(1)
            })
            brandId = newBrand._id
        }
        else{
            brandId = brandSearchResult._id
        }
        
        // add new product
        const product = await Product.findOne({name: req.body.name})
            .collation({locale: 'vi', strength: 2})
        if(product === null){
            const newProduct = await Product.create({
                ...req.body,
                categories: categoriesId.slice(2),
                brand: brandId,
                colors: colorsId
            })
            return res.json({status: 200, resultData: newProduct})
        }
        else{
            throw new Error('duplicate product name')
        }
    }
    catch(err: any){
        console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}