import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const cloudinaryUploader = async (file) => {
  const buffer = fs.readFileSync(file.tempFilePath);
  const response = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({}, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
      .end(buffer);
  });
  return response;
};
