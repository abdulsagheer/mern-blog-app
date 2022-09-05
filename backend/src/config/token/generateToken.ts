// Importing Libraries
import jwt from "jsonwebtoken";

// Function for Generating Token with Mongo User ID and Secret Key
export const generateToken = (id: string) => {
  return jwt.sign({ id }, String(process.env.JWT_KEY), { expiresIn: "20d" });
};
