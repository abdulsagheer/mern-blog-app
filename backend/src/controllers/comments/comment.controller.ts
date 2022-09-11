// Importing Libraries
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";

// Importing Dependencies
import Comment from "../../models/comment/Comment.model";
import { validateMongodbId } from "../../utils/validateMongodbID";

// ================================================================
// Create Comment
// ================================================================
export const createComment = expressAsyncHandler(
  async (req: any, res: Response) => {
    // 1. Get the user
    const user = req.user;
    // 2. get the post Id
    const { postId, description } = req.body;
    console.log(description);
    try {
      const comment = await Comment.create({
        post: postId,
        user: user,
        description,
      });
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch All Comment
// ================================================================

export const fetchAllComment = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      const comment = await Comment.find({}).sort("-created");
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch Single Comment Details
// ================================================================

export const fetchSingleComment = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const comment = await Comment.findById(id);
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Update Comment
// ================================================================

export const updateComment = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const comment = await Comment.findByIdAndUpdate(
        id,
        {
          post: req.body?.postId,
          description: req?.body?.description,
          user: req?.user,
        },
        { new: true, runValidators: true }
      );
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Delete Comment
// ================================================================

export const deleteComment = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const comment = await Comment.findByIdAndDelete(id);
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  }
);
