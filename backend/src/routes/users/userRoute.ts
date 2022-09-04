// Importing Libraries
import express from "express";

// Importing dependencies
import { fetchAllUsers } from "./../../controllers/users/user.controller";
import {
  userLogin,
  userRegister,
} from "../../controllers/users/user.controller";
const userRoute = express.Router();

// Get Registration Details
userRoute.post("/register", userRegister);

// Fetch Registration Details
userRoute.get("/register", userRegister);

// Get Login Details
userRoute.get("/login", userLogin);

// Fetch Login Details
userRoute.post("/login", userLogin);

// Fetch all users
userRoute.get("/", fetchAllUsers);

// Delete all users
userRoute.delete("/", fetchAllUsers);

export default userRoute;
