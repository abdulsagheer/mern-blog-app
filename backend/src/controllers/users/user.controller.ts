// Importing Libraries
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import expressAsyncHandler from "express-async-handler";

// Importing dependencies
import User from "../../models/user/User.model";
import { generateToken } from "./../../config/token/generateToken";
import { validateMongodbId } from "../../utils/validateMongodbID";

// API Key for Send Grid
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

// ================================================================
// Register User
// ================================================================

export const userRegister = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // Check if user is already registered
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      throw new Error("Already registered!");
    }
    try {
      // Register user
      const { firstName, lastName, email, password } = req.body;
      const user = await User.create({ firstName, lastName, email, password });
      res.json(user);
    } catch (error: any) {
      res.json({ error: error.message });
    }
  }
);

// ================================================================
// Login User
// ================================================================

export const userLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Check if user is already exists
    const userFound = await User.findOne({ email });
    // Check if password is matched
    if (userFound && (await userFound.isPasswordMatched(password))) {
      res.json({
        _id: userFound?._id,
        firstName: userFound?.firstName,
        lastName: userFound?.lastName,
        email: userFound?.email,
        profilePhoto: userFound?.profilePhoto,
        isAdmin: userFound?.isAdmin,
        token: generateToken(userFound._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Login Credentials");
    }
  }
);

// ================================================================
// Delete User By ID
// ================================================================

export const deleteUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      res.json(deletedUser);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch All Users Details
// ================================================================

export const fetchAllUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.headers);

    // Fetch all users
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch User Details By ID
// ================================================================

export const fetchUserDetails = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // Fetch Single User Details By ID
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const user = await User.findById(id);
      res.json(user);
    } catch (error: any) {
      res.json(error);
    }
  }
);

// ================================================================
// Fetch User Profile
// ================================================================
export const userProfile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // User profile fetching
    const { id } = req.params;
    validateMongodbId(id);

    try {
      const profile = await User.findById(id);
      res.json(profile);
    } catch (error: any) {
      res.json(error);
    }
  }
);

// ================================================================
// Update User Profile
// ================================================================
export const updateUserProfile = expressAsyncHandler(
  async (req: any, res: Response) => {
    // Update User profile
    const { _id } = req?.user;
    validateMongodbId(_id);
    const user = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id) },
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(user);
  }
);

// ================================================================
// Update Password
// ================================================================
export const updateUserPassword = expressAsyncHandler(
  async (req: any, res: Response) => {
    //destructure the login user
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);
    //Find the user by _id
    const user = await User.findById(_id);

    if (password) {
      console.log(user);
      console.log(password);
      user.password = password;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.json(user);
    }
  }
);

// ================================================================
// Following Other Users
// ================================================================
export const followingUser = expressAsyncHandler(
  async (req: any, res: Response) => {
    // ID of logged in user and target User(the user you want to follow)
    const { followId } = req.body;
    const loggedInUserId = req.user.id;

    // Find the target User(the user you want to follow) and check if the login id is already in the followers field
    const targetUser = await User.findById(followId);
    console.log(targetUser);
    // Checking if you are already in the followers fields of target User(the user you want to follow)
    const alreadyFollowing = targetUser?.followers?.find(
      (user) => user?.toString() === loggedInUserId.toString()
    );
    console.log(alreadyFollowing);
    if (alreadyFollowing) throw new Error(`Already following ${targetUser}`);
    // Find the user you want to follow and update its followers field
    await User.findByIdAndUpdate(
      followId,
      {
        $push: {
          followers: loggedInUserId,
        },
        isFollowing: true,
      },
      {
        new: true,
      }
    );
    // 2. Update the logged in user following field
    await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $push: {
          following: followId,
        },
      },
      {
        new: true,
      }
    );
    res.json("You have successfully followed this user");
  }
);

// ================================================================
// Unfollow Other Users
// ================================================================
export const unfollowUser = expressAsyncHandler(
  async (req: any, res: Response) => {
    // ID of logged in user and target User(the user you want to follow)
    const { unFollowId } = req.body;
    const loggedInUserId = req.user.id;
    await User.findByIdAndUpdate(
      unFollowId,
      {
        $pull: {
          followers: loggedInUserId,
        },
        isFollowing: false,
      },
      {
        new: true,
      }
    );
    await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $pull: {
          following: unFollowId,
        },
      },
      {
        new: true,
      }
    );
    res.json("You have successfully unfollowed this user");
  }
);

// ================================================================
// Block Other Users
// ================================================================
export const blockUser = expressAsyncHandler(
  async (req: any, res: Response) => {
    // ID of logged in user and target User(the user you want to follow)
    const { id } = req.params;
    validateMongodbId(id);
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(user);
    res.json("You have successfully Blocked this user");
  }
);

// ================================================================
// UnBlock Other Users
// ================================================================
export const unblockUser = expressAsyncHandler(
  async (req: any, res: Response) => {
    // ID of logged in user and target User(the user you want to follow)
    const { id } = req.params;
    validateMongodbId(id);
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(user);
    res.json("You have successfully Blocked this user");
  }
);

// ================================================================
// Email Verification
// ================================================================
export const generateVerificationToken = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      // Build Message
      const msg = {
        to: "abdulsagheer35@gmail.com",
        from: "abdulsagheeras29@gmail.com",
        subject: "My First Message",
        text: "Hi, I used Twillio for the first time",
      };
      await sgMail.send(msg);
      res.json("Email send Succeded!!");
    } catch (error) {
      res.json("Email send failed");
    }
  }
);
