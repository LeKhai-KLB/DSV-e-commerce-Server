'use strict';

import Order from '../models/Order'
import Product from '../models/Product'
import Color from '../models/Color'
import mongoose from 'mongoose'
import { Request, Response } from 'express';

// ADD ORDER
export const addOrder = async (req: Request, res: Response) => {
    const cart = req.body.cart.map((r:any) => {
        return {
            ...r,
            product: new mongoose.Types.ObjectId(r.product),
            options: {
                ...r.options,
                color: new mongoose.Types.ObjectId(r.options.color)
            }
        }
    })
    try {
        await Promise.all(
            cart.map(async (c:any, index: number) => {
                const product = await Product.findOne({_id: c.product})
                const colorResult = await Color.findOne({_id: c.options.color}).select('title')
                if(product) {
                    if(product.inStock[c.options.size] < c.options.quantity)
                        throw new Error(`${product.name} with options: 
                            (size: ${c.options.size}, color: ${colorResult.title}, quantity: ${c.options.quantity}) is out of stock 
                            (${product.inStock[c.options.size]})
                        `)
                    else if(product.colors.findIndex((p:any) => p.toString() === colorResult._id.toString()) === -1) {
                        throw new Error(`${product.name} is not included this color ${colorResult.title}`)
                    }
                    else {
                        product.inStock[c.options.size] -= c.options.quantity
                        await product.save()
                    }
                }
                else {
                    throw new Error(`Can't find the product ${index} in your cart`)
                }
            })
        )
        await Order.create({cart: [...cart], custommer: new mongoose.Types.ObjectId(req.body.custommer)})
        return res.json({status: 200})
    }
    catch(err: any) {
        // console.log(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// GET ORDERS BY FILTER
export const getOrdersByFilter = async (req: Request, res: Response) => {
    try {
        const {dateRange, searchValue, page, limit} = req.query
        let passingObject:any
        if(dateRange) {
            const newDateRange:Array<string> = String(dateRange).split('-')
            passingObject = {
                createdAt: {
                    $gte: new Date(Number(newDateRange[0])),
                    $lte: new Date(Number(newDateRange[1]))
                }
            }
        }
        if(page && limit) {
            const first = Number(page) * Number(limit) - Number(limit)
            const last = first + Number(limit)
            const tempSlice = {'slice': {start: first, limit: last}}
            passingObject = {...passingObject, ...tempSlice}
        }

        const {slice, ...filterValues} = passingObject
        const orders = await Order.find(filterValues)
            .populate([{
                path: 'custommer',
                model: 'User',
                select: '_id, userName'
            },
            {
                path: 'cart.product',
                model: 'Product',
                select: '_id, name'
            },
            {
                path: 'cart.options.color',
                model: 'Color',
                select: 'title'
            }
            ])
            .sort({_id: -1})

        const newOrder = orders.filter(o => {
            if(searchValue) {
                if(searchValue !== '')
                    return o._id.toString().includes(String(searchValue)) 
                    || o.custommer.userName.toLowerCase().includes(String(searchValue).toLowerCase())
                    || o.custommer._id.toString().includes(String(searchValue))
            }
            return o
        })

        if(newOrder && newOrder.length !== 0) {
            return res.json({status: 200, resultData: {orders: newOrder.slice(slice.start, slice.limit), remainingLength: newOrder.length}})
        }
        else 
            throw new Error(`Can't find any order`)
    }   
    catch(err: any) {
        // console.error(err)
        return res.json({status: 404, errorMessage: err.message})
    }
}

// SET STATUS 
export const setStatus = async (req: Request, res: Response) => {
    try {
        const objId = new mongoose.Types.ObjectId(String(req.body.id))
        const result = await Order.findOneAndUpdate({_id: objId}, {
            'status.state': Number(req.body.state),
            'status.title': String(req.body.title)
        }, {new: true})
        return res.json({status: 200, resultData: {state: result.status.state, title: result.status.title}})
    }
    catch(err: any) {
        return res.json({status: 404, errorMessage: err.message})
    }
}