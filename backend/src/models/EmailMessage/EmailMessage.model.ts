// Importing Libraries
import { Schema, model } from "mongoose";

// Importing Types
import { EmailMessage } from "../../interfaces/EmailMessage";

const EmailMessageSchema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<EmailMessage>("EmailMessage", EmailMessageSchema);
