// Importing Libraries
import express, { NextFunction } from "express";

// Importing dependencies
import { postImageResize } from "./../../middlewares/uploads/photoUploads";
import {
  createPost,
  fetchAllPosts,
  fetchSinglePost,
} from "../../controllers/posts/post.controller";
import { authMiddleware } from "../../middlewares/auth/authMiddleware";
import { photoUploads } from "../../middlewares/uploads/photoUploads";
const postRoute = express.Router();

// ================================================================
// Create Post
// ================================================================

postRoute.post(
  "/create-post",
  authMiddleware,
  [
    photoUploads.single("image"),
    (req: any, res: any, next: NextFunction) => {
      console.log(req.file, req.body);
      next();
    },
  ],
  postImageResize,
  createPost
);

// ================================================================
// Fetch All Post
// ================================================================

postRoute.get("/", authMiddleware, fetchAllPosts);

// ================================================================
// Fetch Single Post
// ================================================================

postRoute.get("/:id", authMiddleware, fetchSinglePost);

export default postRoute;
