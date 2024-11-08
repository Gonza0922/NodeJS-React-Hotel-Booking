import { Router } from "express";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { login, register } from "./auth.schema.js";
import { loginUser, logoutUser, registerUser, verifyUser } from "./auth.controllers.js";

const authRouter = Router();

authRouter.post("/users/register", validateSchema(register), registerUser);
authRouter.post("/users/login", validateSchema(login), loginUser);
authRouter.post("/users/logout", logoutUser);
authRouter.get("/users/verify", verifyUser);

export default authRouter;
