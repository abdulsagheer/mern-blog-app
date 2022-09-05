// Importing Libraries
import { Request, Response, NextFunction } from "express";

// ================================================================
// Handling Not Found Errors
// ================================================================

export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Not Found: - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// ================================================================
// Function for Handling Error
// ================================================================

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}
