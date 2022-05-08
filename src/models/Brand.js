'use strict';

import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
    brandName: {type: String, required: true, trim: true, unique: true}
}, {timeStamp: false, collation: {locale: 'vi', strength: 2}})

export default mongoose.model('Brand', BrandSchema)