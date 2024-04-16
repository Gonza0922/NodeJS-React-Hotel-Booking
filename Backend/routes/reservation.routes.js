import { Router } from "express";
import { validateTokenUser } from "../middlewares/validateTokenUser.js";
import { validateTokenPartner } from "../middlewares/validateTokenPartner.js";
import { chooseMiddleware } from "../middlewares/chooseMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { reservation } from "../schemas/reservation.schema.js";
import {
  getReservationPerUser,
  getReservationId,
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
  getReservationId
);
reservationRouter.get(
  "/hotel/reservations/:hotel_ID",
  validateTokenPartner,
  getReservationPerHotel
);
reservationRouter.post(
  "/create/reservations",
  validateTokenUser,
  validateSchema(reservation),
  postReservation
);
reservationRouter.put(
  "/update/reservations/:reservation_ID",
  validateTokenUser,
  putReservation
);
reservationRouter.delete(
  "/delete/reservations/:reservation_ID",
  chooseMiddleware,
  deleteReservation
);

export default reservationRouter;
