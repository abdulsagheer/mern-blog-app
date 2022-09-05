// Importing Libraries
import express from "express";

// Importing dependencies
import {
  userLogin,
  userRegister,
  fetchAllUsers,
  deleteUser,
} from "../../controllers/users/user.controller";
const userRoute = express.Router();

// Get Registration Details
userRoute.post("/register", userRegister);

// Fetch Login Details
userRoute.post("/login", userLogin);

// Fetch all users
userRoute.get("/", fetchAllUsers);

// Delete all users
userRoute.delete("/:id", deleteUser);

export default userRoute;
