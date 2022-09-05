// Importing Libraries
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";

// Importing dependencies
import dbConnect from "./config/db/dbConnect";
import userRoute from "./routes/users/userRoute";
import { errorHandler, notFound } from "./middlewares/error/errorHandler";
dotenv.config();

// DB configuration
dbConnect();

// Using Express Server
const app: Application = express();

// Using Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5000" }));

// Testing Server
app.get("/", (req: Request, res: Response) => {
  res.send("Healthy");
});

// Using User Routes to CRUD Operations
app.use("/api/users", userRoute);

// Error Handler
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

// Listening on PORT Number
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
