import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import hotelRouter from "./routes/hotel.routes.js";
import userRouter from "./routes/user.routes.js";
import reservationRouter from "./routes/reservation.routes.js";
import partnerRouter from "./routes/partner.routes.js";
import imagesRouter from "./routes/images.routes.js";
import commentRouter from "./routes/comment.routes.js";
import fileUpload from "express-fileupload";

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
// app.use("/uploads", express.static("BackEnd/uploads"));
app.use("/auth", userRouter);
app.use("/auth", partnerRouter);
app.use("/user", reservationRouter);
app.use("/user", commentRouter);
app.use("/partner", hotelRouter);
app.use("/images", imagesRouter);

export default app;
