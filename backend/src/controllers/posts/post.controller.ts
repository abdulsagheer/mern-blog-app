// Importing Libraries
import { Request, Response } from "express";
import fs from "fs";
import Filter from "bad-words";
import expressAsyncHandler from "express-async-handler";
import * as dotenv from "dotenv";
dotenv.config();

// Importing Dependencies
import Post from "../../models/post/Post.model";
// import { validateMongodbId } from "../../utils/validateMongodbID";
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
      const posts = await await Post.find({})
        .populate("user")
        .populate("dislikes")
        .populate("likes");
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
    const { id } = req.params;
    // validateMongodbId(id);
    try {
      const post = await Post.findById(id)
        .populate("user")
        .populate("dislikes")
        .populate(await Post.find({}).populate("user").populate("dislikes"))
        .populate("likes");
      // Update number of views
      await Post.findByIdAndUpdate(
        id,
        {
          $inc: {
            numViews: +1,
          },
        },
        {
          new: true,
        }
      );
      res.json(post);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Update Post
// ================================================================

export const updatePost = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    // validateMongodbId(id);
    try {
      const post = await Post.findByIdAndUpdate(
        id,
        {
          ...req.body,
          user: req.user?._id,
        },
        { new: true }
      );
      res.json(post);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Delete Post
// ================================================================

export const deletePost = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.params;
    // validateMongodbId(id);
    try {
      const deletedPost = await Post.findByIdAndDelete(id);
      res.json(deletedPost);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Like Post
// ================================================================

export const likePost = expressAsyncHandler(async (req: any, res: Response) => {
  // 1.Find the post to be liked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  // 2. Find the login user
  const loginUserId = req?.user?._id;
  // 3. Find is this user has liked this post?
  const isLiked = post?.isLiked;
  // 4.Check if this user has dislikes this post
  const alreadyDisliked = post?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  // 5.remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  // Toggle
  // Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

// ================================================================
// Dislike Post
// ================================================================

export const dislikePost = expressAsyncHandler(
  async (req: any, res: Response) => {
    // 1.Find the post to be disLiked
    const { postId } = req.body;
    const post = await Post.findById(postId);
    // 2.Find the login user
    const loginUserId = req?.user?._id;
    // 3.Check if this user has already dislikes
    const isDisLiked = post?.isDisliked;
    // 4. Check if already like this post
    const alreadyLiked = post?.likes?.find(
      (userId) => userId.toString() === loginUserId?.toString()
    );
    //Remove this user from likes array if it exists
    if (alreadyLiked) {
      const post = await Post.findOneAndUpdate(
        postId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(post);
    }
    //Toggling
    //Remove this user from dislikes if already disliked
    if (isDisLiked) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { dislikes: loginUserId },
          isDisLiked: false,
        },
        { new: true }
      );
      res.json(post);
    } else {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(post);
    }
  }
);
