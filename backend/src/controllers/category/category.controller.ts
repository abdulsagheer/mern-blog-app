// Importing Libraries
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";

// Importing Dependencies
import { validateMongodbID } from "../../utils/validateMongodbID";
import Category from "../../models/category/Category.model";

// ================================================================
// Create Category
// ================================================================
export const createCategory = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      const category = await Category.create({
        user: req.user._id,
        title: req.body.title,
      });
      res.json(category);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch All Categories
// ================================================================
export const fetchAllCategories = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      const categories = await Category.find({})
        .populate("user")
        .sort("-createdAt");
      res.json(categories);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch Single Categories
// ================================================================
export const fetchSingleCategory = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id)
        .populate("user")
        .sort("-createdAt");
      res.json(category);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Update Categories
// ================================================================
export const updateCategory = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        {
          title: req?.body?.title,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.json(category);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Delete Categories
// ================================================================
export const deleteCategory = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);

      res.json(category);
    } catch (error) {
      res.json(error);
    }
  }
);
