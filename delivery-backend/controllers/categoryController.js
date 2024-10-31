import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import { isEmpty } from '../validations/isEmpty.js'
import { uploadToCloudinary } from "../services/cloudinaryService.js";

const getCategories = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find().sort({ name: 1 });

    if (!category) {
      res.status(404);
      throw new Error("Error fetching categories");
    }
    res.status(201).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(201).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const addCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    const iconFromReq = req.files.icon;
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists");
    }
    const categoryFields = {};
    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;
    categoryFields.hotelOwner = req.user._id;
    const icon = await uploadToCloudinary(iconFromReq);
    if (icon.length == 0) {
      res.status(400);
      throw new Error("Error uploading icon");
    }
    categoryFields.icon = icon.toString();
    const category = await Category.create(categoryFields);

    if (category) {
      res.status(201).json({
        _id: category._id,
        name: category.name,
        description: category.description,
        icon: category.icon,
      
        hotelOwner: category.hotelOwner,
      });
    } else {
      res.status(400);
      throw new Error("Invalid category data");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const geCategoryByName = asyncHandler(async (req, res) => {
  try {
    const name = req.query.name;

    if (isEmpty(name)) {
      res.status(404);
      throw new Error("Empty search key");
    }

    const category = await Category.find({
      name: { $regex: name, $options: "i" },
    });
    if (!category) {
      res.status(404);
      throw new Error("category not found");
    }
    res.status(201).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategoryById = asyncHandler(async (req, res) => {
  try {
    const categoryExist = await Category.findById(req.params.id);
    if (!categoryExist) {
      res.status(404);
      throw new Error("Category not found");
    }
    const { name, description } = req.body;
    const iconFromReq = req.files;
    const categoryFields = {};

    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;

    if (iconFromReq && Object.keys(iconFromReq).length !== 0) {
      const icon = await uploadToCloudinary(iconFromReq);

      if (icon.length == 0) {
        res.status(400);
        throw new Error("Error uploading icon");
      }

      categoryFields.icon = icon.toString();
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );
    res.status(200);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200);
    res.json({
      msg: "Category deleted successfully",
      
    });
  } catch (error) {
    throw new Error(error);
  }
});

export {
  getCategories,
  getCategoryById,
  geCategoryByName,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
};
