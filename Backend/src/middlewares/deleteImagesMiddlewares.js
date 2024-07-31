import { db } from "../tables.js";
import { v2 as cloudinary } from "cloudinary";

export const deleteSingleImage = async (req, res, next) => {
  //Delete the principal image
  try {
    const { hotel_ID } = req.params;
    const [getUrl] = await db.query("SELECT principalImg FROM hotels WHERE hotel_ID = ?", [
      hotel_ID,
    ]);
    if (getUrl[0] === undefined)
      return res.status(400).json({ message: "There is no image to delete" });
    const url = getUrl[0].principalImg;
    const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId); // delete principal image in cloudinary
    } else {
      res.status(500).json({ message: "Couldn´t extract Public ID from URL" });
    }
    next();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Delete Principal Image" });
  }
};

export const deleteMultipleImages = async (req, res, next) => {
  //Delete multiple images
  try {
    let count = 0;
    const { hotel_ID } = req.params;
    const [getUrl] = await db.query("SELECT image_name FROM images WHERE hotel_ID = ?", [
      hotel_ID,
    ]);
    if (getUrl[0] === undefined)
      return res.status(400).json({ message: "There are no images to delete" });
    getUrl.forEach(async (element) => {
      const url = element.image_name;
      const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
      if (match && match[1]) {
        count++;
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId); // delete multiple images in cloudinary
      } else {
        console.error("Couldn´t extract Public ID from URL");
      }
    });
    next();
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Failed to Delete Images" });
  }
};
