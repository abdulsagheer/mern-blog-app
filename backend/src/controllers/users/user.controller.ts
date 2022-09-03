import { Request, Response, NextFunction } from "express";
import User from "../../models/user/User.model";

// Register
export const userRegister = async (req: Request, res: Response) => {
  try {
    // Register user
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({ firstName, lastName, email, password });
    res.json(user);
  } catch (error: any) {
    res.json({ error: error.message });
  }
};

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
