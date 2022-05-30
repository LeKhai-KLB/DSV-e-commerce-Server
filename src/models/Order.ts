'use strict';

import mongoose, { Schema, SchemaOptions } from 'mongoose';

const OrderSchema = new mongoose.Schema({
    custommer: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    cart: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'},
            options: {
                color: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Color'},
                size: {type: String, enum: ['s', 'm', 'l']},
                quantity: {type: Number, required: true, default: 1},
            },
            amount: {type: Number, required: true}
        }
    ],
    status: {
        state: {type: Number, default: 1, required: true, enum: [1, 2, 3]},
        title: {type: String, required: true, default:'Pending', enum: ['Pending', 'Completed', 'Canceled']}
    }
}, {timestamps: true} as SchemaOptions )

export default mongoose.model('Order', OrderSchema)