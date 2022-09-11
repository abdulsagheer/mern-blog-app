// Importing Libraries
import express, { NextFunction } from "express";

// Importing dependencies
import {
  createCategory,
  fetchAllCategories,
  fetchSingleCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/category/category.controller";
import { authMiddleware } from "../../middlewares/auth/authMiddleware";
const categoryRoute = express.Router();

// ================================================================
// Create Category
// ================================================================

categoryRoute.post("/", authMiddleware, createCategory);

// ================================================================
// Fetch All Categories
// ================================================================

categoryRoute.get("/", authMiddleware, fetchAllCategories);

// ================================================================
// Fetch Single Categories
// ================================================================

categoryRoute.get("/:id", authMiddleware, fetchSingleCategory);

// ================================================================
// Update Categories
// ================================================================

categoryRoute.put("/:id", authMiddleware, updateCategory);

// ================================================================
// Delete Categories
// ================================================================

categoryRoute.delete("/:id", authMiddleware, deleteCategory);

export default categoryRoute;
