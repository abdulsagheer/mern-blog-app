import { Document, ObjectId, Date } from "mongoose";

export interface User extends Document {
  firstName: String;
  lastName: String;
  profilePhoto: String;
  email: String;
  bio: String;
  password: String;
  postCount: Number;
  isBlocked: Boolean;
  isAdmin: Boolean;
  role: String;
  isFollowing: Boolean;
  isUnFollowing: Boolean;
  isAccountVerified: Boolean;
  accountVerificationToken: String;
  accountVerificationTokenExpires: Date;
  viewBy: ObjectId[];
  followers: ObjectId[];
  passwordChangeAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
  active: Boolean;
}

export enum UserStatus {
  Admin = "Admin",
  Guest = "Guest",
  Blogger = "Blogger",
}
