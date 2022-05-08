'use strict';

import mongoose from 'mongoose';

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
}, {timeStamp: true})

export default mongoose.model('Review', ReviewSchema)