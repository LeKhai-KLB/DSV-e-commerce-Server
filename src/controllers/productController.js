'use strict';

import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Color from '../models/Color.js'
import Brand from '../models/Brand.js'

// ADD PRODUCT
export const addProduct = async (req, res, next) => {
    try{
        const categories = req.body.categories
        const colors = req.body.colors
        let brand = 'no brand'
        
        // handle categories
        const categoryDocs = await Category.find().where('id').in(categories).select('id -_id')
            .collation({locale: 'vi', strength: 2})
        for(let i = 0; i < categories.length; i++) {
            const checkIndex = categoryDocs.findIndex(c => c.id.toLowerCase() === categories[i].toLowerCase());
            if(i < 2){
                if(checkIndex === -1)
                    return res.json({status: 404, errorMessage: "Can't find root categories"})
                else{
                    categories[i] = categoryDocs[checkIndex].id
                }
            }
            else{
                if(checkIndex === -1){
                    const tree = categories.slice(0,2)
                    tree.unshift('root')
                    await Category.create({
                        id: categories[i], 
                        tree: tree,
                        parent: categories[1]
                    })
                }
                else{
                    categories[i] = categoryDocs[checkIndex].id
                }
            }
        }

        // handle colors
        const colorsTitle = colors.map(c => c.title)
        const colorDocs = await Color.find().where('title').in(colorsTitle).select('title -_id')
        for(let i = 0; i < colors.length; i++){
            const checkIndex = colorDocs.findIndex(c => c.title === colors[i].title);
            if(checkIndex === -1){
                await Color.create({
                    title: colors[i].title,
                    value: colors[i].value
                })
            }
        }

        // handles brand
        if(req.body?.brand){
            brand = req.body.brand
        }
        const brandSearchResult = await Brand.findOne({brandName: brand}).collation({locale: 'vi', strength: 2})
        if(brandSearchResult === null){
            await Brand.create({
                brandName: brand
            })
        }
        else{
            brand = brandSearchResult.brandName
        }
        
        // add new product
        const product = await Product.findOne({productName: req.body.productName})
            .collation({locale: 'vi', strength: 2})
        if(product === null){
            const newProduct = await Product.create({
                ...req.body,
                categories: categories.slice(1),
                brand: brand
            })
            return res.json({status: 200, resultData: newProduct})
        }
        else{
            throw new Error('duplicate product name')
        }
    }
    catch(err){
        // console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}