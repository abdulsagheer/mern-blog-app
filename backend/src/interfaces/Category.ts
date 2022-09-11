// Importing Libraries
import { Document, ObjectId } from "mongoose";

// Interface for User Model Schema
export interface Category extends Document {
  user: ObjectId;
  title: string;
}
