'use strict';

import mongoose, { SchemaOptions } from 'mongoose'

const ReviewSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, required: true},
    review: [
        {
            userId: {type: mongoose.Schema.Types.ObjectId, required: true},
            title: {type: String, default: ''},
            description: {type: String, default: ''},
            evaluate: {type: Number, default: 5}
        }
    ]
}, {timestamps: true} as SchemaOptions )

export default mongoose.model('Review', ReviewSchema)