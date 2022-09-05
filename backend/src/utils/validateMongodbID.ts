import mongoose from "mongoose";

export const validateMongodbId = (id: any) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error(`Invalid MongoDB ID: ${id}`);
};
