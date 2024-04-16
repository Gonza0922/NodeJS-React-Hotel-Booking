import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import {
  getAllImages,
  postSingleImage,
  postMultipleImages,
  putSingleImage,
  putMultipleImages,
  deleteSingleImage,
  deleteMultipleImages,
} from "../controllers/images.controllers.js";
import { validateTokenPartner } from "../middlewares/validateTokenPartner.js";

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const imagesRouter = Router();

imagesRouter.get("/all/:hotel_ID", getAllImages);
imagesRouter.post("/create/single/:hotel_ID", validateTokenPartner, postSingleImage);
imagesRouter.post("/create/multiple/:hotel_ID", validateTokenPartner, postMultipleImages);
imagesRouter.post("/update/single/:hotel_ID", validateTokenPartner, putSingleImage);
imagesRouter.post("/update/multiple/:hotel_ID", validateTokenPartner, putMultipleImages);
imagesRouter.get("/delete/single/:hotel_ID", validateTokenPartner, deleteSingleImage);
imagesRouter.get("/delete/multiple/:hotel_ID", validateTokenPartner, deleteMultipleImages);

export default imagesRouter;
