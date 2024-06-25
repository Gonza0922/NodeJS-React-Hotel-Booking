import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import hotelRouter from "./hotel/hotel.routes.js";
import userRouter from "./user/user.routes.js";
import reservationRouter from "./reservation/reservation.routes.js";
import partnerRouter from "./partner/partner.routes.js";
import imagesRouter from "./images/images.routes.js";
import commentRouter from "./comment/comment.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/auth", userRouter);
app.use("/auth", partnerRouter);
app.use("/user", reservationRouter);
app.use("/user", commentRouter);
app.use("/partner", hotelRouter);
app.use("/images", imagesRouter);

export default app;
