'use strict';

import mongoose, { SchemaOptions } from 'mongoose'

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    hash_password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false, required: true}, 
    isVerified: {type: Boolean, default: false, required: true},
    avatar: {type: String},
}, {timestamps: true} as SchemaOptions );

export default mongoose.model("User", UserSchema)