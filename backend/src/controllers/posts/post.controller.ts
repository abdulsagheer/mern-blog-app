// Importing Libraries
import { Request, Response } from "express";
import fs from "fs";
import Filter from "bad-words";
import expressAsyncHandler from "express-async-handler";
import * as dotenv from "dotenv";
dotenv.config();

// Importing Dependencies
import Post from "../../models/post/Post.model";
import { validateMongodbId } from "../../utils/validateMongodbID";
import User from "../../models/user/User.model";
import { cloudinaryUploadImg } from "../../utils/uploadToCloudinary";

// ================================================================
// Create Post
// ================================================================

export const createPost = expressAsyncHandler(
  async (req: any, res: Response) => {
    console.log(req.file);
    const { _id } = req.user;
    // validateMongodbId(req.body.user);
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
    //1. Get the path to img
    const localPath = `src/public/image/post/${req.file.filename}`;
    //2.Upload to cloudinary
    const imgUploaded = await cloudinaryUploadImg(localPath);
    try {
      const post = await Post.create({
        ...req.body,
        image: imgUploaded?.url,
        user: _id,
      });
      res.json(post);

      // Remove uploaded image
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch All Post
// ================================================================

export const fetchAllPosts = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      const posts = await Post.find({}).populate("user");
      res.json(posts);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch a Single Post
// ================================================================

export const fetchSinglePost = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      validateMongodbId(id);
      const post = await (await Post.findById(id)).populate("user");
      res.json(post);
    } catch (error) {
      res.json(error);
    }
  }
);
