'use strict';

import Brand from '../models/Brand'
import Review from '../models/Review'
import { Request, Response, NextFunction } from 'express'
import { deleteManyImages } from './firebaseServices';
import mongoose from 'mongoose';

// PASSING PRODUCT DATA
export const passingProductData = async (req: Request, res: Response,next: NextFunction) => {
    try{
        const {previousQuantity, previousImages, ...data} = req.body

        // handle update inStock
        if(previousQuantity) {
            for(const key in data.quantity) {
                if(data.quantity[key] > previousQuantity[key])
                    data.inStock[key] += (data.quantity[key] - previousQuantity[key])
                else {
                    data.inStock[key] = data.quantity[key]
                } 
            }
        }

        // handle images
        if(previousImages) {
            if(data.images.length !== 0) {
                const desertImages:Array<string> = []
                previousImages.forEach((img:any) => {
                    if(data.images.findIndex((d:any) => d === img) === -1) 
                        desertImages.push(String(img))
                }) 
                if(desertImages.length !== 0)
                    await deleteManyImages(desertImages)
            }
        }

        // handles brand
        let brandId:mongoose.Types.ObjectId
        if(data.brand) {
            if (!data.brand.match(/^[0-9a-fA-F]{24}$/)) {
                const name = data?.brand ? data.brand:'no brand'
                const newBrand = await Brand.create({
                    name: name[0].toUpperCase() + name.slice(1)
                })
                brandId = newBrand._id
            }
            else {
                brandId = new mongoose.Types.ObjectId(data.brand)
            }
        }
        else {
            const noBrand = await Brand.findOne({name: 'No brand'})
            brandId = noBrand._id
        }
        
        // add new product
        req.body = {
            ...data,
            brand: brandId,
        }
        next()
    }
    catch(err: any){
        //console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// PASSING PRODUCT FILTER DATA
export const passingProductFilterData = (req: Request, res: Response, next: NextFunction) => {
    const {searchValue, category, size, colors, brands, price, available, sortValue, slice, page, limit} = req.query
    let passingObject:any
    if(searchValue) {
        if(searchValue !== '') {
            const regex = new RegExp(`${searchValue}`, 'gi')
            passingObject = {'name': {$regex: regex}}
        }
    }
    else{
        if(category) {
            const categoryObjId = new mongoose.Types.ObjectId(String(category))
            passingObject = {$or: [
                {'categories': {$elemMatch: {'parent': categoryObjId}}}, 
                {'categories': {$elemMatch: {'_id': categoryObjId}}}
            ]}
        }
        if(size) {
            const tempKey:string = `inStock.${size}`
            let tempObj: {[k:string]: any} = {}
            tempObj[tempKey] = {'$gte': 1}
            passingObject = {...passingObject, ...tempObj}
        }
        if(colors) {
            const colordObjId:Array<any> = String(colors).split('-').map(c => {
                return new mongoose.Types.ObjectId(c)
            })
            const query = {'colors._id': {$in: colordObjId}}
            passingObject = {...passingObject, ...query}
        }
        if(brands) {
            const brandList:Array<any> = String(brands).split('-').map(b => {
                return new mongoose.Types.ObjectId(b)
            })
            const query = {'brand._id': {$in: brandList}}
            passingObject = {...passingObject, ...query}
        }
        if(price) {
            const priceRange:Array<string> = String(price).split('-')
            const tempPriceRange = {'price': {'$gte': Number(priceRange[0]), '$lte': Number(priceRange[1])}}
            passingObject = {...passingObject, ...tempPriceRange}
        }
        if(available){
            let val:object
            let query:any
            if(available === 'In store')
                query = {'totalInStock': {$gte: 1}}
            else 
                query = {'totalInStock': {$lte: 1}}
            passingObject = {...passingObject, ...query}
        }
    }
    if(sortValue) {
        const newSortValueObj:any = JSON.parse(String(sortValue)) 
        let obj:{[k:string]: number} = {}
        obj[newSortValueObj.key] = (String(newSortValueObj.option) === 'asc' ? 1:-1)
        passingObject = {...passingObject, sortValue: obj}
    }
    if(slice){
        const sliceRange:Array<string> = String(slice).split('-')
        const tempSlice = {'slice': {start: Number(sliceRange[0]), limit: Number(sliceRange[1])}}
        passingObject = {...passingObject, ...tempSlice}
    }
    if(page && limit) {
        const first = Number(page) * Number(limit) - Number(limit)
        const last = Number(limit)
        const tempSlice = {'slice': {start: first, limit: last}}
        passingObject = {...passingObject, ...tempSlice}
    }
    req.body = passingObject
    next()
}