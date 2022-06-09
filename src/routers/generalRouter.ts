'use strict';

import { 
    addCategory,  
    getCategoriesByTreeLength, 
    getCategoriesPassByParent,
    getCategoryPathByIdList,
    getAllBrands,
    getAllBrandPassByCategory,
    getAllColors,
    clearRedis,
    getAllRedisKeys
} from '../controllers/generalController'
import express from 'express'
import { authenToken, isAdmin } from '../utils/authServices';

const generalRouter = express.Router()

generalRouter.post('/addCategory',authenToken, isAdmin, addCategory)
generalRouter.get('/getCategoriesByTreeLength', getCategoriesByTreeLength)
generalRouter.get('/getCategoriesPassByParent', getCategoriesPassByParent)
generalRouter.get('/getCategoryPathByIdList', getCategoryPathByIdList)
generalRouter.get('/getAllBrands', getAllBrands)
generalRouter.get('/getAllBrandPassByCategory', getAllBrandPassByCategory)
generalRouter.get('/getAllColors', getAllColors)

generalRouter.get('/clearRedis', clearRedis)
generalRouter.get('/getAllRedisKeys', getAllRedisKeys)

export default generalRouter