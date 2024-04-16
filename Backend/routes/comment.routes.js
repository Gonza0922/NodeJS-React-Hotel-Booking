import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateTokenUser } from "../middlewares/validateTokenUser.js";
import { validatePIN } from "../middlewares/validatePIN.js";
import { PIN, comment } from "../schemas/comment.schema.js";
import {
  getAllComments,
  getCommentPerId,
  getCommentPerHotel,
  postComment,
  putComment,
  deleteComment,
  verifyPIN,
  verifyTokenPIN,
} from "../controllers/comment.controllers.js";

const commentRouter = Router();

commentRouter.get("/all/comments", getAllComments);
commentRouter.get("/comments/:comment_ID", getCommentPerId);
commentRouter.get("/per_hotel/:hotel_ID", getCommentPerHotel);
commentRouter.post(
  "/create/comments",
  validateSchema(comment),
  validateTokenUser,
  validatePIN,
  postComment
);
commentRouter.put(
  "/update/comments/:comment_ID",
  validateSchema(comment),
  validatePIN,
  putComment
);
commentRouter.delete(
  "/delete/comments/:comment_ID",
  validatePIN,
  deleteComment
);
commentRouter.post(
  "/verify/PIN/comments/:hotel_ID",
  validateSchema(PIN),
  validateTokenUser,
  verifyPIN
); //Check PIN in data base and create a cookie
commentRouter.get("/verify/token/PIN/:hotel_ID", verifyTokenPIN); //Check PIN in the cookie

export default commentRouter;
