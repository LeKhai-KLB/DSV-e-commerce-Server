'use strict';

import { 
passingProductData,
addProduct, 
updateProduct,
deleteProduct,
passingProductFilterData,
getProductsByFilterAndSortValue,
getProductById
} from "../controllers/productController";
import express from "express";

const productRouter = express.Router(); 

productRouter.post('/admin/add', passingProductData, addProduct);
productRouter.post('/admin/update', passingProductData, updateProduct);
productRouter.post('/getProductsByFilterAndSortValue', passingProductFilterData, getProductsByFilterAndSortValue);
productRouter.get('/getProductById', getProductById);
productRouter.post('/admin/delete', deleteProduct);

export default productRouter