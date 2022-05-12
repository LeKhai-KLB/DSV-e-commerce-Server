'use strict';

import mongoose, { SchemaOptions } from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: {type: String, trim: true, required: true, unique: true},
    description: {type: String},
    images: [
        {type: String}
    ],
    categories: [
        {type: mongoose.Schema.Types.ObjectId, required: true}
    ],
    brand: {type: String, default: 'no brand'},
    price: {type: Number, default: 0.00},
    colors: [
        {type: mongoose.Schema.Types.ObjectId, required: true}
    ],
    quantity: {
        s: {type: Number, default: 0},
        m: {type: Number, default: 0},
        l: {type: Number, default: 0},
    }
}, {timeStamp: true, collation: {locale: 'vi', strength: 2}} as SchemaOptions)

export default mongoose.model('Product', ProductSchema)

