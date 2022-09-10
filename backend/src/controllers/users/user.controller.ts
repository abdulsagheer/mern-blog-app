// Importing Libraries
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import fs from "fs";
import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";

// Importing dependencies
import User from "../../models/user/User.model";
import { generateToken } from "./../../config/token/generateToken";
import { validateMongodbId } from "../../utils/validateMongodbID";
import { cloudinaryUploadImg } from "../../utils/uploadToCloudinary";

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
      const profile = await User.findById(id).populate('posts');
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
// Generate Email Verification Token
// ================================================================
export const generateVerificationToken = expressAsyncHandler(
  async (req: any, res: Response) => {
    const loginUserId = req.user.id;

    const user = await User.findById(loginUserId);

    try {
      //Generate token
      const verificationToken = await user.createAccountVerificationToken();
      //save the user
      await user.save();
      console.log(verificationToken);
      //build your message

      const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;
      const msg = {
        to: "abdulsagheeras29@gmail.com",
        from: "abdulsagheeras29.com",
        subject: "Verify your account",
        html: resetURL,
      };

      await sgMail.send(msg);
      res.json(resetURL);
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
//Account verification
// ================================================================

export const accountVerification = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //find this user by token

    const userFound = await User.findOne({
      accountVerificationToken: hashedToken,
      accountVerificationTokenExpires: { $gt: new Date() },
    });
    if (!userFound) throw new Error("Token expired, try again later");
    //update the property to true
    userFound.isAccountVerified = true;
    userFound.accountVerificationToken = undefined;
    userFound.accountVerificationTokenExpires = undefined;
    await userFound.save();
    res.json(userFound);
  }
);

// ================================================================
// Forget Password Token Generator
// ================================================================

export const forgetPasswordToken = expressAsyncHandler(
  async (req: any, res: Response) => {
    //find the user by email
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("User Not Found");

    try {
      //Create token
      const token = await user.createPasswordResetToken();
      console.log(token);
      await user.save();

      //build your message
      const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/reset-password/${token}">Click to Reset</a>`;
      const msg = {
        to: email,
        from: "abdulsagheer35@gmail.com",
        subject: "Reset Password",
        html: resetURL,
      };

      await sgMail.send(msg);
      res.json({
        msg: `A verification message is successfully sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
      });
    } catch (error) {
      res.json(error);
    }
  }
);

// ================================================================
// Forget Password
// ================================================================

export const passwordReset = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //find this user by token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token Expired, try again later");

    //Update/change the password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  }
);

// ================================================================
// Profile photo upload
// ================================================================

export const profilePhotoUploading = expressAsyncHandler(
  async (req: any, res: Response) => {
    //Find the login user
    const { _id } = req?.user;

    //1. Get the path to img
    const localPath = `src/public/image/profile/${req.file.filename}`;
    //2.Upload to cloudinary
    const imgUploaded = await cloudinaryUploadImg(localPath);

    const foundUser = await User.findByIdAndUpdate(
      _id,
      {
        profilePhoto: imgUploaded?.url,
      },
      { new: true }
    );
    // Remove the saved image
    fs.unlinkSync(localPath);
    res.json(imgUploaded);
  }
);
