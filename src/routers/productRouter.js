'use strict';

import { addProduct } from "../controllers/productController.js";
import express from "express";

const productRouter = express.Router(); 

productRouter.post('/add', addProduct);

export default productRouter