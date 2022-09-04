// Importing Libraries
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Importing dependencies
import User from "../../models/user/User.model";

// Register
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

// Login
export const userLogin = (req: Request, res: Response) => {
  // Business logic
  res.json({ user: "User Logged In!!" });
};

// Fetch All Users
export const fetchAllUsers = (req: Request, res: Response) => {
  // Business logic
  res.json({
    users: ["Abdul Sagheer", "Alain", "Alain", "Sagheer", "Green", "Felon"],
  });
};
