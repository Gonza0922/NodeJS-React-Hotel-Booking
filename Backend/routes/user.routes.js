import { Router } from "express";
import { register, login, update } from "../schemas/user.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateTokenUser } from "../middlewares/validateTokenUser.js";
import { chooseMiddleware } from "../middlewares/chooseMiddleware.js";
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
} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.get("/all/users", getAllUsers);
userRouter.get("/users/get/:user_ID", chooseMiddleware, getUserId);
userRouter.post("/users/register", validateSchema(register), registerUser);
userRouter.put(
  "/users/update",
  validateSchema(update),
  validateTokenUser,
  putUser
);
userRouter.put(
  "/users/password/update/:user_ID",
  validateTokenUser,
  putUserPassword
);
userRouter.post("/users/login", validateSchema(login), loginUser);
userRouter.post("/users/logout", logoutUser);
userRouter.get("/users/verify", verifyUser);
userRouter.delete("/delete/users/:user_ID", validateTokenUser, deleteUser);

export default userRouter;
