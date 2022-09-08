// Importing Libraries
import { Document, ObjectId, Date } from "mongoose";

// Interface for User Model Schema
export interface User extends Document {
  firstName: string;
  lastName: string;
  profilePhoto: string;
  email: string;
  bio: string;
  password: string;
  postCount: number;
  isBlocked: boolean;
  isAdmin: boolean;
  role: string;
  isFollowing: boolean;
  isUnFollowing: boolean;
  isAccountVerified: boolean;
  accountVerificationToken: string;
  accountVerificationTokenExpires: Date;
  viewBy: ObjectId[];
  followers: ObjectId[];
  following: ObjectId[];
  passwordChangeAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;
  isPasswordMatched: (password: string) => boolean;
  createAccountVerificationToken: () => string;
  createPasswordResetToken: () => string;
}

// Enums for User Status
export enum UserStatus {
  Admin = "Admin",
  Guest = "Guest",
  Blogger = "Blogger",
}
