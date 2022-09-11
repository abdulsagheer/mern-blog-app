import { Schema, model } from "mongoose";
import { Comment } from "../../interfaces/Comment";

const CommentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    user: {
      type: Object,
      required: [true, "Please Author is required"],
    },
    description: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default model<Comment>("Comment", CommentSchema);
