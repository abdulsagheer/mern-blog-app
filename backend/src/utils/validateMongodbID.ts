import { ObjectId } from "mongoose";
// Importing Libraries
import mongoose from "mongoose";

// Function to Validate MongoDB ID
export const validateMongodbID = (id: any) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("User id is not valid or found");
};
