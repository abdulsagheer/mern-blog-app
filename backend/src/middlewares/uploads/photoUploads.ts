import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import sharp from "sharp";

// Storage
const multerStorage = multer.memoryStorage();

// ================================================================
// File Type Checking
// ================================================================

const multerFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  // Check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // Rejected Files
    cb(
      {
        message: "Unsupported file type",
      },
      false
    );
  }
};

export const photoUploads = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// ================================================================
// Image Resizing
// ================================================================

export const profilePhotoResize = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`src/public/image/profile/${req.file.filename}`));
  next();
};

// ================================================================
// Post Image Resizing
// ================================================================

export const postImageResize = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  //Find the login user
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`src/public/image/post/${req.file.filename}`));
  next();
};
