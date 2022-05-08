'use strict';

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    products: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, required: true},
            quantity: {
                s: {type: Number, required: true, default: 0},
                m: {type: Number, required: true, default: 0},
                l: {type: Number, required: true, default: 0},
            }
        }
    ],
    status: {type: String, default: 'pending'}
}, {timeStamp: true})

export default mongoose.model('Order', OrderSchema)