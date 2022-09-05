// Importing Libraries
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Importing dependencies
import User from "../../models/user/User.model";
import { generateToken } from "./../../config/token/generateToken";
import { validateMongodbId } from "../../utils/validateMongodbID";

// ================================================================
// Register User
// ================================================================

export const userRegister = asyncHandler(
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

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
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
});

// ================================================================
// Fetch All Users
// ================================================================

export const fetchAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
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
// Delete Users
// ================================================================

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});
