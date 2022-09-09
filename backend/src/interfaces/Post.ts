// Importing Libraries
import { Document, ObjectId } from "mongoose";

// Interface for User Model Schema
export interface Post extends Document {
  title: string;
  category: string;
  isLiked: boolean;
  isDisliked: boolean;
  numViews: number;
  likes: ObjectId;
  user: ObjectId;
  description: string;
  image: string;
}
