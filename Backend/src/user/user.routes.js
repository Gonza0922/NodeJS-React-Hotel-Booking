import { Router } from "express";
import { update, updatePassword } from "../user/user.schema.js";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { validateTokenUser } from "../middlewares/validates/validateTokenUser.js";
import {
  getAllUsers,
  getUserId,
  putUser,
  putUserPassword,
  deleteUser,
} from "../user/user.controllers.js";
import { pagination } from "../common/paginationSchema.js";
import { validateQuery } from "../middlewares/validates/validatePagination.js";

const userRouter = Router();

userRouter.get("/all/users", validateQuery(pagination), getAllUsers);
userRouter.get("/users/get/:user_ID", getUserId);
userRouter.put("/users/update", validateSchema(update), validateTokenUser, putUser);
userRouter.put(
  "/users/password/update/:user_ID",
  validateSchema(updatePassword),
  validateTokenUser,
  putUserPassword
);
userRouter.delete("/delete/users/:user_ID", validateTokenUser, deleteUser);

export default userRouter;
