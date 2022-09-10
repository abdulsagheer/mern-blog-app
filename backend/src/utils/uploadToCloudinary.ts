// Importing Libraries
import cloudinary from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

// Setting up cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDARY_NAME,
  api_key: process.env.CLOUDARY_API_KEY,
  api_secret: process.env.CLOUDARY_API_SECRET_KEY,
});

export const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const data = await cloudinary.v2.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};
