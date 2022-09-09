import { Schema, model } from "mongoose";
import { Post } from "../../interfaces/Post";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Created by only category
    category: {
      type: String,
      required: [true, "Post category is required"],
      default: "All",
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Author is Required"],
    },
    description: {
      type: String,
      required: [true, "Post description is Required"],
    },
    image: {
      type: String,
      default:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.deleuzegroup.com%2Fwp-content%2Fthemes%2Fazoomtheme%2Fimages%2Fdemo%2Fdemo-image-default.jpg%3Fx20736&imgrefurl=https%3A%2F%2Fdeleuzegroup.com%2Fdefault-item%2Fretina-icons%2F&tbnid=nj98n8t5EGk4sM&vet=12ahUKEwiEn878j4j6AhURjNgFHTB-DK8QMygEegUIARC8AQ..i&docid=nP1tc3idLFOkQM&w=1920&h=1080&q=post%20default%20image&ved=2ahUKEwiEn878j4j6AhURjNgFHTB-DK8QMygEegUIARC8AQ",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export default model<Post>("Post", PostSchema);
