'use strict';

import Category from '../models/Category.js'

// ADD CATEGORY
export const addCategory = async(req, res, next) => {
    try{
        const category = await Category.findOne({id: req.body.id})
            .collation({locale: 'vi', strength: 2})
        if(category === null){
            const newCategory = await Category.create({...req.body})
            return res.json({status: 200, resultData: newCategory})
        }
        else{
            throw new Error('dupplicate category id')
        }
    }
    catch(err){
        console.log(err.message)
        return res.json({status: 404, errorMessage: err.message})
    }
}