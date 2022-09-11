// Importing Libraries
import { Document, ObjectId } from "mongoose";

// Interface for User Model Schema
export interface Comment extends Document {
  post: ObjectId;
  user: Object;
  description: string;
}
