'use strict';
import { authenToken, isAdmin } from '../utils/authServices'
import { 
    addProduct, 
    updateProduct,
    deleteProduct,
    getProductsByFilterAndSortValue,
    getProductsByBrandId,
    getProductsByNestedRootCategory,
    getProductById
} from "../controllers/productController";
import {
    passingProductData,
    passingProductFilterData,
} from '../utils/productServices'

import express from "express";

const productRouter = express.Router(); 

productRouter.post('/admin/add', authenToken, isAdmin, passingProductData, addProduct);
productRouter.post('/admin/update', authenToken, isAdmin, passingProductData, updateProduct);
productRouter.get('/getProductsByFilterAndSortValue', passingProductFilterData, getProductsByFilterAndSortValue);
productRouter.get('/getProductById', getProductById);
productRouter.get('/getProductsByBrandId', getProductsByBrandId);
productRouter.get('/getProductsByNestedRootCategory', getProductsByNestedRootCategory);
productRouter.post('/admin/delete',authenToken, isAdmin, deleteProduct);

export default productRouter