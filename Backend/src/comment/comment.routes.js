import { Router } from "express";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { validateTokenUser } from "../middlewares/validates/validateTokenUser.js";
import { validatePIN } from "../middlewares/validates/validatePIN.js";
import { PIN, comment } from "../comment/comment.schema.js";
import {
  getAllComments,
  getCommentById,
  getCommentByHotel,
  postComment,
  putComment,
  deleteComment,
  verifyPIN,
  verifyTokenPIN,
  getCommentByUser,
} from "../comment/comment.controllers.js";
import { validateQuery } from "../middlewares/validates/validatePagination.js";
import { pagination } from "../common/paginationSchema.js";

const commentRouter = Router();

commentRouter.get("/all", validateQuery(pagination), getAllComments);
commentRouter.get("/by_comment/:comment_ID", getCommentById);
commentRouter.get("/by_hotel/:hotel_ID", getCommentByHotel);
commentRouter.get("/by_user/:user_ID", validateTokenUser, getCommentByUser);
commentRouter.post(
  "/create",
  validateSchema(comment),
  validateTokenUser,
  validatePIN,
  postComment
);
commentRouter.put("/update/:comment_ID", validateSchema(comment), validateTokenUser, putComment);
commentRouter.delete("/delete/:comment_ID", validateTokenUser, deleteComment);
commentRouter.post("/verify/PIN/:hotel_ID", validateSchema(PIN), validateTokenUser, verifyPIN); //Check PIN in data base and create a cookie
commentRouter.get("/verify/token/PIN/:hotel_ID", validateTokenUser, verifyTokenPIN); //Check PIN in the cookie

export default commentRouter;
