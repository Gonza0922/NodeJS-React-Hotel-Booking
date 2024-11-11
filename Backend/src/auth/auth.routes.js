import { Router } from "express";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { login, logout, register, verifyPartner, verifyUser } from "./auth.controllers.js";

const authRouter = Router();

authRouter.post("/register", validateSchema(registerSchema), register);
authRouter.post("/login", validateSchema(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/users/verify", verifyUser);
authRouter.get("/partners/verify", verifyPartner);

export default authRouter;
