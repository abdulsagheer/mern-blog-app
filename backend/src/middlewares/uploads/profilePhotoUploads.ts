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

export const profilePhotoUploads = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// ================================================================
// Image Resizing
// ================================================================

export const profilePhotoResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};
