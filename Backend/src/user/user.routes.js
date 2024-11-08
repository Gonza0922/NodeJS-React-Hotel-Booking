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

userRouter.get("/all", validateQuery(pagination), getAllUsers);
userRouter.get("/get/:user_ID", getUserId);
userRouter.put("/update", validateSchema(update), validateTokenUser, putUser);
userRouter.put(
  "/password/update/:user_ID",
  validateSchema(updatePassword),
  validateTokenUser,
  putUserPassword
);
userRouter.delete("/delete/:user_ID", validateTokenUser, deleteUser);

export default userRouter;
