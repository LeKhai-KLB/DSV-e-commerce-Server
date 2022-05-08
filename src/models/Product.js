'use strict';

import mongoose from 'mongoose'

const ProductColorSchema = new mongoose.Schema({
    title: {type: String, required: true},
    value: {type: String, required: true},
}, {timeStamp: false, _id: false})

const ProductSchema = new mongoose.Schema({
    productName: {type: String, trim: true, required: true, unique: true},
    description: {type: String},
    images: [
        {type: String}
    ],
    categories: [
        {type: String, required: true},
    ],
    brand: {type: String, default: 'no brand'},
    price: {type: Number, default: 0.00},
    colors: [
        ProductColorSchema
    ],
    quantity: {
        s: {type: Number, default: 0},
        m: {type: Number, default: 0},
        l: {type: Number, default: 0},
    }
}, {timeStamp: true, collation: {locale: 'vi', strength: 2}})

export default mongoose.model('Product', ProductSchema)

