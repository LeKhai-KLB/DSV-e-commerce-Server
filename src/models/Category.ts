'use strict';

import mongoose, { SchemaOptions } from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    tree: [
        {type: mongoose.Schema.Types.ObjectId, required: true}
    ],   
    parent:{type: mongoose.Schema.Types.ObjectId, required: true}
}, { timestamps: false, collation: {locale: 'vi', strength: 2}} as SchemaOptions)

export default mongoose.model('Category', CategorySchema)