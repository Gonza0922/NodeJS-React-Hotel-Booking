import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { validateTokenPartner } from "../middlewares/validateTokenPartner.js";
import {
  getAllImagesHotel,
  postSingleImage,
  postMultipleImages,
  putMultipleImages,
} from "../controllers/images.controllers.js";
import {
  deleteSingleImage,
  deleteMultipleImages,
} from "../middlewares/deleteImagesMiddlewares.js";

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const imagesRouter = Router();

imagesRouter.get("/all/:hotel_ID", getAllImagesHotel);
imagesRouter.post(
  "/create/single/:hotel_ID",
  validateTokenPartner,
  postSingleImage
);
imagesRouter.post(
  "/create/multiple/:hotel_ID",
  validateTokenPartner,
  postMultipleImages
);
imagesRouter.put(
  "/update/single/:hotel_ID",
  validateTokenPartner,
  deleteSingleImage,
  postSingleImage
);
imagesRouter.put(
  "/update/multiple/:hotel_ID",
  validateTokenPartner,
  deleteMultipleImages,
  putMultipleImages
);
// IT CAN USE
// imagesRouter.get(
//   "/delete/single/:hotel_ID",
//   validateTokenPartner,
//   deleteSingleImage
// );
// imagesRouter.get(
//   "/delete/multiple/:hotel_ID",
//   validateTokenPartner,
//   deleteMultipleImages
// );

export default imagesRouter;
