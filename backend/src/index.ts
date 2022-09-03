// Libraries
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";

// Importing dependencies
import dbConnect from "./config/db/dbConnect";
import {
  userRegister,
  userLogin,
  fetchAllUsers,
} from "./controllers/users/user.controller";
dotenv.config();

// DB configuration
dbConnect();

// Using Express Server
const app: Application = express();

// Using Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5000" }));

// Routes(GET, POST, PUT, DELETE)
app.get("/", (req: Request, res: Response) => {
  res.send("Healthy");
});

// Get Registration Details
app.get("/api/users/register", userRegister);

// Get Login Details
app.get("/api/users/login", userLogin);

// Fetch Registration Details
app.post("/api/users/register", userRegister);

// Fetch Login Details
app.post("/api/users/login", userLogin);

// Fetch all users
app.get("/api/users", fetchAllUsers);

// Server
const PORT = process.env.PORT || 5000;

// Listening on PORT Number
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
