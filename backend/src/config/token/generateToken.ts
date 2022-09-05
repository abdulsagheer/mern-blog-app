// Importing Libraries
import jwt from "jsonwebtoken";

// Function for Generating Token
export const generateToken = (id: string) => {
  return jwt.sign({ id }, String(process.env.JWT_KEY), { expiresIn: "20d" });
};
