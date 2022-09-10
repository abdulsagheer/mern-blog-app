// Importing Libraries
import mongoose from "mongoose";

// Function to Validate MongoDB ID
export const validateMongodbId = (id: any) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error(`Invalid ID: ${id}`);
};
