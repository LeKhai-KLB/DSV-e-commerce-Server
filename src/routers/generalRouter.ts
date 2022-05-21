'use strict';

import { 
    addCategory, 
    testAuthorizationToken_user, 
    testAuthorizationToken_admin, 
    getCategoriesByTreeLength, 
    getCategoriesPassByParent,
    getAllBrands,
    getAllBrandPassByCategory,
    getAllColors
} from '../controllers/generalController'
import express from 'express'
import { authenToken, isAdmin } from '../utils/authServices';

const generalRouter = express.Router()

generalRouter.post('/addCategory', addCategory)
generalRouter.get('/testAuthorizationToken_user', authenToken, testAuthorizationToken_user)
generalRouter.get('/testAuthorizationToken_admin', authenToken, isAdmin, testAuthorizationToken_admin)
generalRouter.get('/getCategoriesByTreeLength', getCategoriesByTreeLength)
generalRouter.get('/getCategoriesPassByParent', getCategoriesPassByParent)
generalRouter.get('/getAllBrands', getAllBrands)
generalRouter.get('/getAllBrandPassByCategory', getAllBrandPassByCategory)
generalRouter.get('/getAllColors', getAllColors)

export default generalRouter