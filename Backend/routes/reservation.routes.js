import { Router } from "express";
import { validateTokenUser } from "../middlewares/validateTokenUser.js";
import { validateTokenPartner } from "../middlewares/validateTokenPartner.js";
import { chooseMiddleware } from "../middlewares/chooseMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { reservation } from "../schemas/reservation.schema.js";
import {
  getReservationPerUser,
  getReservationPerId,
  getReservationPerHotel,
  postReservation,
  putReservation,
  deleteReservation,
} from "../controllers/reservation.controllers.js";

const reservationRouter = Router();

reservationRouter.get(
  "/per_user/reservations",
  validateTokenUser,
  getReservationPerUser
);
reservationRouter.get(
  "/reservations/:reservation_ID",
  validateTokenUser,
  getReservationPerId
);
reservationRouter.get(
  "/hotel/reservations/:hotel_ID",
  validateTokenPartner,
  getReservationPerHotel
);
reservationRouter.post(
  "/create/reservations",
  validateSchema(reservation),
  validateTokenUser,
  postReservation
);
reservationRouter.put(
  "/update/reservations/:reservation_ID",
  validateSchema(reservation),
  validateTokenUser,
  putReservation
);
reservationRouter.delete(
  "/delete/reservations/:reservation_ID",
  chooseMiddleware,
  deleteReservation
);

export default reservationRouter;
