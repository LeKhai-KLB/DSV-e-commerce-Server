'use strict';

import mongoose, { SchemaOptions } from 'mongoose';

const BrandSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, unique: true}
}, {timestamps: false, collation: {locale: 'vi', strength: 2}} as SchemaOptions )

export default mongoose.model('Brand', BrandSchema)