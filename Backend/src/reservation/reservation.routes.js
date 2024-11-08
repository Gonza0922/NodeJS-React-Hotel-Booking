import { Router } from "express";
import { validateTokenUser } from "../middlewares/validates/validateTokenUser.js";
import { validateTokenPartner } from "../middlewares/validates/validateTokenPartner.js";
import { chooseMiddleware } from "../middlewares/chooseMiddleware.js";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { reservation } from "../reservation/reservation.schema.js";
import {
  getReservationByUser,
  getReservationById,
  getReservationByHotel,
  postReservation,
  putReservation,
  deleteReservation,
} from "../reservation/reservation.controllers.js";
import { sendEmail } from "../email/email.controllers.js";

const reservationRouter = Router();

reservationRouter.get("/by_user", validateTokenUser, getReservationByUser);
reservationRouter.get("/:reservation_ID", validateTokenUser, getReservationById);
reservationRouter.get("/hotel/:hotel_ID", validateTokenPartner, getReservationByHotel);
reservationRouter.post(
  "/create",
  validateSchema(reservation),
  validateTokenUser,
  postReservation,
  sendEmail
);
reservationRouter.put(
  "/update/:reservation_ID",
  validateSchema(reservation),
  validateTokenUser,
  putReservation
);
reservationRouter.delete("/delete/:reservation_ID", chooseMiddleware, deleteReservation);

export default reservationRouter;
