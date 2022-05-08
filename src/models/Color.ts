'use strict';

import mongoose, { SchemaOptions } from 'mongoose';

const ColorSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    value: {type: String, required: true, unique: true},
}, {timeStamp: false} as SchemaOptions )

export default mongoose.model('Color', ColorSchema)