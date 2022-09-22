"use strict";

import Product from "../models/Product";
import Review from "../models/Review";
import { deleteImage } from "../utils/firebaseServices";
import { Request, Response } from "express";
import mongoose from "mongoose";

// ADD PRODUCT
export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ name: req.body.name }).collation({
      locale: "vi",
      strength: 2,
    });
    if (product === null) {
      const newProduct = await Product.create({ ...req.body });
      return res.json({ status: 200, resultData: newProduct });
    } else {
      throw new Error("duplicate product name");
    }
  } catch (err: any) {
    console.log(err);
    return res.json({ status: 404, errorMessage: err.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { _id, ...productData } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.body._id },
      productData,
      { new: true }
    );
    if (product === null) {
      throw new Error("Can not find current product");
    } else {
      return res.json({ status: 200, resultData: product });
    }
  } catch (err: any) {
    console.log(err);
    return res.json({ status: 404, errorMessage: err.message });
  }
};

// GET PRODUCTS BY FILTER AND SORT VALUE
export const getProductsByFilterAndSortValue = async (
  req: Request,
  res: Response
) => {
  try {
    const { sortValue, slice, newField, ...filterData } = req.body;
    const products = await Product.aggregate()
      .lookup({
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      })
      .lookup({
        from: "colors",
        localField: "colors",
        foreignField: "_id",
        as: "colors",
      })
      .lookup({
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      })
      .addFields({
        sold: {
          $subtract: [
            { $sum: ["$quantity.s", "$quantity.m", "$quantity.l"] },
            { $sum: ["$inStock.s", "$inStock.m", "$inStock.l"] },
          ],
        },
        totalInStock: { $sum: ["$inStock.s", "$inStock.m", "$inStock.l"] },
      })
      .match(filterData)
      .sort(sortValue)
      .group({
        _id: null,
        remainingLength: { $sum: 1 },
        rootProducts: { $push: "$$ROOT" },
      })
      .project({
        _id: 0,
        remainingLength: 1,
        products: { $slice: ["$rootProducts", slice.start, slice.limit] },
      });

    if (products.length > 0) {
      return res.json({ status: 200, resultData: products[0] });
    } else {
      throw new Error("Could not find any products");
    }
  } catch (err: any) {
    // console.error(err)
    return res.json({ status: 404, errorMessage: err.message });
  }
};

// GET PRODUCTS BY ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.query.id }).populate([
      "brand",
      "colors",
      "categories",
    ]);
    if (product) {
      return res.json({ status: 200, resultData: product });
    } else {
      throw new Error("Could not find product");
    }
  } catch (err: any) {
    // console.log(err)
    return res.json({ status: 404, errorMessage: err.message });
  }
};

// GET PRODUCT BY BRAND ID
export const getProductsByBrandId = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      brand: req.query.id,
      _id: { $ne: req.query.nId },
    })
      .slice("0", Number(req.query.limit))
      .select("name images");
    if (products) {
      return res.json({ status: 200, resultData: products });
    } else {
      throw new Error("Could not find product");
    }
  } catch (err: any) {
    // console.log(err)
    return res.json({ status: 404, errorMessage: err.message });
  }
};

// GET PRODUCT BY NESTED ROOT CATEGORY
export const getProductsByNestedRootCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const parentId = new mongoose.Types.ObjectId(String(req.query.parent));
    const objNId = new mongoose.Types.ObjectId(String(req.query.nId));
    const products = await Product.aggregate()
      .lookup({
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      })
      .match({
        categories: { $elemMatch: { parent: parentId } },
        _id: { $ne: objNId },
      })
      .project({
        _id: 1,
        name: 1,
        images: 1,
      })
      .limit(Number(req.query.limit));
    if (products) {
      return res.json({ status: 200, resultData: products });
    } else {
      throw new Error("Could not find product");
    }
  } catch (err: any) {
    // console.log(err)
    return res.json({ status: 404, errorMessage: err.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await Review.deleteOne({ productId: id });
    const product = await Product.findOneAndDelete({ _id: id });
    if (product.images.length !== 0) {
      await Promise.all(
        product.images.map((image) => deleteImage(String(image)))
      ).then(() => {
        console.log("oke");
      });
    }
    return res.json({ status: 200 });
  } catch (err: any) {
    return res.json({ status: 404, errorMessage: err.message });
  }
};
