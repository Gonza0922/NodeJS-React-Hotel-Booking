import { Router } from "express";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { validateTokenUser } from "../middlewares/validates/validateTokenUser.js";
import { validatePIN } from "../middlewares/validates/validatePIN.js";
import { PIN, comment } from "../comment/comment.schema.js";
import {
  getAllComments,
  getCommentPerId,
  getCommentPerHotel,
  postComment,
  putComment,
  deleteComment,
  verifyPIN,
  verifyTokenPIN,
} from "../comment/comment.controllers.js";

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
commentRouter.delete("/delete/comments/:comment_ID", validatePIN, deleteComment);
commentRouter.post(
  "/verify/PIN/comments/:hotel_ID",
  validateSchema(PIN),
  validateTokenUser,
  verifyPIN
); //Check PIN in data base and create a cookie
commentRouter.get("/verify/token/PIN/:hotel_ID", validateTokenUser, verifyTokenPIN); //Check PIN in the cookie

export default commentRouter;
