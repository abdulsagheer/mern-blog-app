// Importing Libraries
import { Schema, model } from "mongoose";

// Importing Types
import { Category } from "../../interfaces/Category";

const CategorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Category>("Category", CategorySchema);
