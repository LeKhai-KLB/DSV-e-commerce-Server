'use strict';

import mongoose, { SchemaOptions } from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: {type: String, trim: true, required: true, unique: true, indexes: true},
    description: {type: String},
    images: [
        {type: String}
    ],
    categories: [
        {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category'}
    ],
    brand: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Brand'},
    price: {type: Number, default: 0.00},
    colors: [
        {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Color'}
    ],
    quantity: {
        s: {type: Number, default: 0},
        m: {type: Number, default: 0},
        l: {type: Number, default: 0},
    },
    inStock: {
        s: {type: Number, default: 0},
        m: {type: Number, default: 0},
        l: {type: Number, default: 0},
    }
}, {timestamps: {createAt: true}, collation: {locale: 'vi', strength: 2}} as SchemaOptions)

export default mongoose.model('Product', ProductSchema)

