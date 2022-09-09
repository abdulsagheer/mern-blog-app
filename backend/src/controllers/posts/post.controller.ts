// Importing Libraries
import { Request, Response } from "express";
import Filter from "bad-words";
import expressAsyncHandler from "express-async-handler";
import * as dotenv from "dotenv";
dotenv.config();

// Importing Dependencies
import Post from "../../models/post/Post.model";
import { validateMongodbId } from "../../utils/validateMongodbID";
import User from "../../models/user/User.model";

// ================================================================
// Create Post
// ================================================================

export const createPost = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { _id } = req.user;
    validateMongodbId(req.body.user);
    // Check for bad words
    const filter = new Filter();
    const isTitleProfane = filter.isProfane(req.body.title);
    const isDescriptionProfane = filter.isProfane(req.body.description);
    if (isTitleProfane || isDescriptionProfane) {
      const user = await User.findByIdAndUpdate(_id, {
        isBlocked: true,
      });
      throw new Error(
        "Creating Post failed due to profane words and unprofessional language, so hence you are blocked!!"
      );
    }
    try {
      const post = await Post.create(req.body);
      res.json(post);
    } catch (error) {
      res.json(error);
    }
  }
);
