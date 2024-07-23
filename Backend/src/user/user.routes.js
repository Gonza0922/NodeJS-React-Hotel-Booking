import { Router } from "express";
import { register, login, update } from "../user/user.schema.js";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { validateTokenUser } from "../middlewares/validates/validateTokenUser.js";
import {
  getAllUsers,
  getUserId,
  registerUser,
  putUser,
  putUserPassword,
  loginUser,
  logoutUser,
  verifyUser,
  deleteUser,
} from "../user/user.controllers.js";
import { pagination } from "../common/paginationSchema.js";
import { validateQuery } from "../middlewares/validates/validatePagination.js";

const userRouter = Router();

userRouter.get("/all/users", validateQuery(pagination), getAllUsers);
userRouter.get("/users/get/:user_ID", getUserId);
userRouter.post("/users/register", validateSchema(register), registerUser);
userRouter.put("/users/update", validateSchema(update), validateTokenUser, putUser);
userRouter.put("/users/password/update/:user_ID", validateTokenUser, putUserPassword);
userRouter.post("/users/login", validateSchema(login), loginUser);
userRouter.post("/users/logout", logoutUser);
userRouter.get("/users/verify", verifyUser);
userRouter.delete("/delete/users/:user_ID", validateTokenUser, deleteUser);

export default userRouter;
