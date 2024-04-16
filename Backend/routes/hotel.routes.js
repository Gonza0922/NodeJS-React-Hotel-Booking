import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateTokenPartner } from "../middlewares/validateTokenPartner.js";
import { hotel } from "../schemas/hotel.schema.js";
import {
  getAllHotels,
  getHotelId,
  getHotelPerPartner,
  postHotel,
  putHotel,
  deleteHotel,
} from "../controllers/hotel.controllers.js";
import {
  deleteSingleImage,
  deleteMultipleImages,
} from "../middlewares/deleteImagesMiddlewares.js";

const hotelRouter = Router();

hotelRouter.get("/all/hotels", getAllHotels);
hotelRouter.get("/hotels/:hotel_ID", getHotelId);
hotelRouter.get(
  "/per_partner/hotels",
  validateTokenPartner,
  getHotelPerPartner
);
hotelRouter.post(
  "/create/hotels",
  validateSchema(hotel),
  validateTokenPartner,
  postHotel
);
hotelRouter.put(
  "/update/hotels/:hotel_ID",
  validateSchema(hotel),
  validateTokenPartner,
  putHotel
);
hotelRouter.delete(
  "/delete/hotels/:hotel_ID",
  validateTokenPartner,
  deleteSingleImage,
  deleteMultipleImages,
  deleteHotel
);

export default hotelRouter;
