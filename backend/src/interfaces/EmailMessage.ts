// Importing Libraries
import { Document, ObjectId } from "mongoose";

// Interface for User Model Schema
export interface EmailMessage extends Document {
  from: string;
  to: string;
  message: string;
  subject: string;
  sentBy: ObjectId;
  isFlagged: boolean;
}
