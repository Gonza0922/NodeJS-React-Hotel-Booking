import { Router } from "express";
import { validateTokenUser } from "../middlewares/validateTokenUser.js";
import {
  getAllComments,
  getCommentPerId,
  getCommentPerHotel,
  postComment,
  putComment,
  deleteComment,
} from "../controllers/comment.controllers.js";

const commentRouter = Router();

commentRouter.get("/all/comments", getAllComments);
commentRouter.get("/comments/:comment_ID", getCommentPerId);
commentRouter.get("/per_hotel/:hotel_ID", getCommentPerHotel);
commentRouter.post("/create/comments", validateTokenUser, postComment);
commentRouter.put(
  "/update/comments/:comment_ID",
  validateTokenUser,
  putComment
);
commentRouter.delete(
  "/delete/comments/:comment_ID",
  validateTokenUser,
  deleteComment
);

export default commentRouter;
