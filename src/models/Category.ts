'use strict';

import mongoose, { SchemaOptions } from 'mongoose';

const CategorySchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    tree: [
        {type: String}
    ],
    parent: {type: String, required: true, caseSensitive: false}
}, { timeStamp: false, collation: {locale: 'vi', strength: 2}} as SchemaOptions)

export default mongoose.model('Category', CategorySchema)