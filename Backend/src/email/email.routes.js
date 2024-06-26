import { Router } from "express";
import { sendEmail } from "./email.controllers.js";

const emailRouter = Router();

emailRouter.post("/send", sendEmail);

export default emailRouter;
