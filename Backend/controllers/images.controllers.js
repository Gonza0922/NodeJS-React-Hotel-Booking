import { db } from "../tables.js";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryUploader } from "../cloudinary/cloudinary.uploader.js";

export const getAllImages = async (req, res) => {
  //Selecciona todas las imagenes del hotel enviado por parametro
  try {
    const id = req.params.hotel_ID;
    const [findHotel] = await db.query(
      "SELECT image_name FROM images WHERE hotel_ID = ?",
      id
    );
    if (findHotel.length === 0)
      return res.status(400).json({ message: "Images not found" });
    res.status(200).json(findHotel);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Images" });
  }
};

export const postSingleImage = async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const file = req.files.principalImg;
    if (!file) {
      return res.status(400).json({ message: "No image has been uploaded" });
    }
    const response = await cloudinaryUploader(file);
    const [findUrl] = await db.query(
      "SELECT principalImg FROM hotels WHERE principalImg = ?",
      [response.secure_url]
    );
    if (findUrl.length > 0)
      return res.status(400).json({ message: "PrincipalImg already exists" });
    await db.query("UPDATE hotels SET principalImg = ? WHERE hotel_ID = ?", [
      response.secure_url,
      id,
    ]);
    res.status(201).json({
      message: "Image uploaded to database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Create Principal Image" });
  }
};

export const postMultipleImages = async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const files = req.files.moreImages;
    if (!files) {
      return res.status(400).json({ message: "No images have been uploaded" });
    }
    files.forEach(async (file) => {
      const response = await cloudinaryUploader(file);
      const values = [id, response.secure_url];
      await db.query("INSERT INTO images (hotel_ID, image_name) VALUES (?)", [
        values,
      ]);
    });
    res.status(201).json({
      message: "Images uploaded to database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Create Images" });
  }
};

export const putSingleImages = async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const file = req.files.principalImg;
    if (!file) {
      return res.status(400).json({ message: "No image has been uploaded" });
    }
    const response = await cloudinaryUploader(file);
    const [findUrl] = await db.query(
      "SELECT principalImg FROM hotels WHERE principalImg = ?",
      [response.secure_url]
    );
    if (findUrl.length > 0)
      return res.status(400).json({ message: "PrincipalImg already exists" });
    await db.query("UPDATE hotels SET principalImg = ? WHERE hotel_ID = ?", [
      response.secure_url,
      id,
    ]);
    res.status(200).json({
      message: "Image updated in database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Update Principal Image" });
  }
};

export const putMultipleImages = async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const files = req.files.moreImages;
    const [findImage_ID] = await db.query(
      "SELECT image_ID FROM images WHERE hotel_ID = ?",
      [id]
    );
    const image_ID = findImage_ID[0].image_ID;
    if (!files) {
      return res.status(400).json({ message: "No images have been uploaded" });
    }
    files.forEach(async (file, index) => {
      const response = await cloudinaryUploader(file);
      await db.query("UPDATE images SET image_name = ? WHERE image_ID = ?", [
        response.secure_url,
        image_ID + index,
      ]);
    });
    res.status(200).json({
      message: "Images updated in database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Update Images" });
  }
};

export const deleteSingleImages = async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const [getUrl] = await db.query(
      "SELECT principalImg FROM hotels WHERE hotel_ID = ?",
      [id]
    );
    if (getUrl[0] === undefined) {
      return res.status(400).json({ message: "There is no image to delete" });
    }
    const url = getUrl[0].principalImg;
    const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
      res.status(200).json({
        message: "Image successfully removed from cloudinary",
      });
    } else {
      res.status(500).json({ message: "Couldn´t extract Public ID from URL" });
    }
  } catch (error) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Delete Principal Image" });
  }
};

export const deleteMultipleImages = async (req, res) => {
  try {
    let count = 0;
    const id = req.params.hotel_ID;
    const [getUrl] = await db.query(
      "SELECT image_name FROM images WHERE hotel_ID = ?",
      [id]
    );
    if (getUrl[0] === undefined) {
      return res.status(400).json({ message: "There are no images to delete" });
    }
    getUrl.forEach(async (element) => {
      const url = element.image_name;
      const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
      if (match && match[1]) {
        count++;
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
      } else {
        console.error("Couldn´t extract Public ID from URL");
      }
    });
    console.log(`${count} Images successfully removed from cloudinary`);
  } catch (error) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Delete Images" });
  }
};
