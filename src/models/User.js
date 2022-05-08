'use strict';

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}, 
    avartar: {type: String}
}, {timeStamp: true});

export default mongoose.model("User", UserSchema)