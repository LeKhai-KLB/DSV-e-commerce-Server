'use strict';

import mongoose, { SchemaOptions } from 'mongoose';

const BrandSchema = new mongoose.Schema({
    brandName: {type: String, required: true, trim: true, unique: true}
}, {timeStamp: false, collation: {locale: 'vi', strength: 2}} as SchemaOptions )

export default mongoose.model('Brand', BrandSchema)