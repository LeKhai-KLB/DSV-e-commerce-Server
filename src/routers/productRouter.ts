'use strict';

import { 
passingProductData,
addProduct, 
updateProduct,
getProducts_SortAtoZ, 
getProducts_SortZtoA, 
getProducts_SortByDateAdded,
deleteProduct
} from "../controllers/productController";
import express from "express";

const productRouter = express.Router(); 

productRouter.post('/admin/add', passingProductData, addProduct);
productRouter.post('/admin/update', passingProductData, updateProduct);
productRouter.get('/admin/getProducts_SortAtoZ', getProducts_SortAtoZ);
productRouter.get('/admin/getProducts_SortZtoA', getProducts_SortZtoA);
productRouter.get('/admin/getProducts_SortByDateAdded', getProducts_SortByDateAdded);
productRouter.post('/admin/delete', deleteProduct);

export default productRouter