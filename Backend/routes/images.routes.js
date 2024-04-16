import { Router } from "express";
import { db } from "../tables.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const imagesRouter = Router();

imagesRouter.get("/all/:hotel_ID", async (req, res) => {
  //Selecciona todas las imagenes del hotel enviado por parametro
  try {
    const id = req.params.hotel_ID;
    const [findHotel] = await db.query("SELECT image_name FROM images WHERE hotel_ID = ?", id);
    if (findHotel.length === 0) return res.status(400).json({ message: "Images not found" });
    res.json(findHotel);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Images" });
  }
});

imagesRouter.post("/create/single/:hotel_ID", async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const file = req.files.principalImg;
    if (!file) {
      return res.status(400).json({ message: "No image has been uploaded" });
    }
    const buffer = fs.readFileSync(file.tempFilePath);
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });
    fs.unlinkSync(file.tempFilePath);
    const [findUrl] = await db.query("SELECT principalImg FROM hotels WHERE principalImg = ?", [
      response.secure_url,
    ]);
    if (findUrl.length > 0)
      return res.status(400).json({ message: "PrincipalImg already exists" });
    await db.query("UPDATE hotels SET principalImg = ? WHERE hotel_ID = ?", [
      response.secure_url,
      id,
    ]);
    return res.status(200).json({
      message: "Image uploaded to database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Create Principal Image" });
  }
});

imagesRouter.post("/create/multiple/:hotel_ID", async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const file = req.files.moreImages;
    if (!file) {
      return res.status(400).json({ message: "No images have been uploaded" });
    }
    file.forEach(async (element) => {
      const buffer = fs.readFileSync(element.tempFilePath);
      const response = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, (err, result) => {
            if (err) reject(err);
            resolve(result);
          })
          .end(buffer);
      });
      fs.unlinkSync(element.tempFilePath);
      const values = [id, response.secure_url];
      const [CreateUrl] = await db.query("INSERT INTO images (hotel_ID, image_name) VALUES (?)", [
        values,
      ]);
    });
    return res.status(200).json({
      message: "Images uploaded to database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Create Images" });
  }
});

imagesRouter.post("/update/single/:hotel_ID", async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const file = req.files.principalImg;
    if (!file) {
      return res.status(400).json({ message: "No image has been uploaded" });
    }
    const buffer = fs.readFileSync(file.tempFilePath);
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });
    fs.unlinkSync(file.tempFilePath);
    const [findUrl] = await db.query("SELECT principalImg FROM hotels WHERE principalImg = ?", [
      response.secure_url,
    ]);
    if (findUrl.length > 0)
      return res.status(400).json({ message: "PrincipalImg already exists" });
    await db.query("UPDATE hotels SET principalImg = ? WHERE hotel_ID = ?", [
      response.secure_url,
      id,
    ]);
    return res.status(200).json({
      message: "Image updated in database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Update Principal Image" });
  }
});

imagesRouter.post("/update/multiple/:hotel_ID", async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const file = req.files.moreImages;
    console.log(file);
    const [findImage_ID] = await db.query("SELECT image_ID FROM images WHERE hotel_ID = ?", [id]);
    const image_ID = findImage_ID[0].image_ID;
    if (!file) {
      return res.status(400).json({ message: "No images have been uploaded" });
    }
    file.forEach(async (element, index) => {
      const buffer = fs.readFileSync(element.tempFilePath);
      const response = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, (err, result) => {
            if (err) reject(err);
            resolve(result);
          })
          .end(buffer);
      });
      fs.unlinkSync(element.tempFilePath);
      const [CreateUrl] = await db.query("UPDATE images SET image_name = ? WHERE image_ID = ?", [
        response.secure_url,
        image_ID + index,
      ]);
    });
    return res.status(200).json({
      message: "Images updated in database and cloudinary",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Update Images" });
  }
});

imagesRouter.get("/delete/single/:hotel_ID", async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const [getUrl] = await db.query("SELECT principalImg FROM hotels WHERE hotel_ID = ?", [id]);
    if (getUrl[0] === undefined) {
      return res.status(400).json({ message: "There is no image to delete" });
    }
    const url = getUrl[0].principalImg;
    const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
      console.log("Image successfully removed from cloudinary");
    } else {
      console.error("Couldn´t extract Public ID from URL");
    }
  } catch (error) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Delete Principal Image" });
  }
});

imagesRouter.get("/delete/multiple/:hotel_ID", async (req, res) => {
  try {
    const id = req.params.hotel_ID;
    const [getUrl] = await db.query("SELECT image_name FROM images WHERE hotel_ID = ?", [id]);
    if (getUrl[0] === undefined) {
      return res.status(400).json({ message: "There are no images to delete" });
    }
    getUrl.forEach(async (element) => {
      const url = element.image_name;
      const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
      if (match && match[1]) {
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
        console.log("Image successfully removed from cloudinary");
      } else {
        console.error("Couldn´t extract Public ID from URL");
      }
    });
  } catch (error) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to Delete Images" });
  }
});

export default imagesRouter;
