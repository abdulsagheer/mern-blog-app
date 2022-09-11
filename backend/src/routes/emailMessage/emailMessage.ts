// Importing Libraries
import express, { NextFunction } from "express";
import { sendEmailMessage } from "../../controllers/emailMessage/emailMessage.controller";

// Importing dependencies
const emailMessageRoute = express.Router();
import { authMiddleware } from "../../middlewares/auth/authMiddleware";

// ================================================================
// Send Email
// ================================================================

emailMessageRoute.post("/", authMiddleware, sendEmailMessage);

export default emailMessageRoute;
