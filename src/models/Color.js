'use strict';

import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    value: {type: String, required: true, unique: true},
}, {timeStamp: false})

export default mongoose.model('Color', ColorSchema)