import { db } from "../tables.js";
import { cloudinaryCreate } from "../cloudinary/cloudinary.uploader.js";

export const getAllImagesHotel = async (req, res) => {
  //Select all images of the hotel sent by parameter
  try {
    const { hotel_ID } = req.params;
    const [findHotel] = await db.query("SELECT image_name FROM images WHERE hotel_ID = ?", [
      hotel_ID,
    ]);
    if (findHotel.length === 0) return res.status(400).json({ message: "Images not found" });
    res.status(200).json(findHotel);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Images" });
  }
};

export const postSingleImage = async (req, res) => {
  //Create the principal image
  try {
    const { hotel_ID } = req.params;
    const file = req.files.principalImg;
    if (!file) return res.status(400).json({ message: "No image has been uploaded" });
    const response = await cloudinaryCreate(file); // Create principal image in cloudinary
    const [findUrl] = await db.query("SELECT principalImg FROM hotels WHERE principalImg = ?", [
      response.secure_url,
    ]);
    if (findUrl.length > 0)
      return res.status(400).json({ message: "PrincipalImg already exists" });
    await db.query(
      "UPDATE hotels SET principalImg = ? WHERE hotel_ID = ?", // Create principal image in data base
      [response.secure_url, hotel_ID]
    );
    res.status(201).json({
      message: "Image uploaded to database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Create Principal Image" });
  }
};

export const postMultipleImages = async (req, res) => {
  //Create multiple images
  try {
    const { hotel_ID } = req.params;
    const files = req.files.moreImages;
    console.log(files);
    if (!files) return res.status(400).json({ message: "No images have been uploaded" });
    files.forEach(async (file) => {
      const response = await cloudinaryCreate(file); // Create multiple images in cloudinary
      await db.query(
        "INSERT INTO images (hotel_ID, image_name) VALUES (?)", // Create multiple images in data base
        [[hotel_ID, response.secure_url]]
      );
    });
    res.status(201).json({
      message: "Images uploaded to database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Create Images" });
  }
};

export const putMultipleImages = async (req, res) => {
  //Update multiple images
  try {
    const { hotel_ID } = req.params;
    const files = req.files.moreImages;
    const [findImage_ID] = await db.query("SELECT image_ID FROM images WHERE hotel_ID = ?", [
      hotel_ID,
    ]);
    const image_ID = findImage_ID[0].image_ID;
    if (!files) return res.status(400).json({ message: "No images have been uploaded" });
    files.forEach(async (file, index) => {
      const response = await cloudinaryCreate(file); // Create multiple images in cloudinary
      await db.query(
        "UPDATE images SET image_name = ? WHERE image_ID = ?", // Update multiple images in data base
        [response.secure_url, image_ID + index]
      );
    });
    res.status(200).json({
      message: "Images updated in database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Update Images" });
  }
};
