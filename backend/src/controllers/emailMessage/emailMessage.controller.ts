// Importing Libraries
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import sgMail from "@sendgrid/mail";
import Filter from "bad-words";

// Importing Dependencies
import EmailMessage from "../../models/EmailMessage/EmailMessage.model";

// ================================================================
// Create Post
// ================================================================

export const sendEmailMessage = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { to, subject, message } = req.body;
    //get the message
    const emailMessage = subject + " " + message;
    //prevent profanity/bad words
    const filter = new Filter();

    const isProfane = filter.isProfane(emailMessage);
    if (isProfane)
      throw new Error("Email sent failed, because it contains profane words.");
    try {
      // Build up message
      const msg = {
        to,
        subject,
        text: message,
        from: "abdulsagheeras29@gmail.com",
      };
      //send msg
      await sgMail.send(msg);
      //save to our db
      await EmailMessage.create({
        sentBy: req?.user?._id,
        from: req?.user?.email,
        to,
        message,
        subject,
      });
      res.json("Mail sent");
    } catch (error) {
      res.json(error);
    }
  }
);
