// Importing Libraries
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Importing dependencies
import User from "../../models/user/User.model";

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
  // check if user is already exists
  const userFound = await User.findOne({ email });
  // Check if password is matched
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json(userFound);
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

// Fetch All Users
export const fetchAllUsers = (req: Request, res: Response) => {
  // Business logic
  res.json({
    users: ["Abdul Sagheer", "Alain", "Alain", "Sagheer", "Green", "Felon"],
  });
};
