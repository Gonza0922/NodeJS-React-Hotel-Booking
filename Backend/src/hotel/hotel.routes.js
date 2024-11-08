import { Router } from "express";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { validateTokenPartner } from "../middlewares/validates/validateTokenPartner.js";
import { hotel } from "../hotel/hotel.schema.js";
import {
  getAllHotels,
  getHotelId,
  getHotelByPartner,
  postHotel,
  putHotel,
  deleteHotel,
} from "../hotel/hotel.controllers.js";
import {
  deleteSingleImage,
  deleteMultipleImages,
} from "../middlewares/deleteImagesMiddlewares.js";
import { validateQuery } from "../middlewares/validates/validatePagination.js";
import { pagination } from "../common/paginationSchema.js";

const hotelRouter = Router();

hotelRouter.get("/all", validateQuery(pagination), getAllHotels);
hotelRouter.get("/:hotel_ID", getHotelId);
hotelRouter.get("/by_partner", validateTokenPartner, getHotelByPartner);
hotelRouter.post("/create", validateSchema(hotel), validateTokenPartner, postHotel);
hotelRouter.put("/update/:hotel_ID", validateSchema(hotel), validateTokenPartner, putHotel);
hotelRouter.delete(
  "/delete/:hotel_ID",
  validateTokenPartner,
  deleteSingleImage,
  deleteMultipleImages,
  deleteHotel
);

export default hotelRouter;
