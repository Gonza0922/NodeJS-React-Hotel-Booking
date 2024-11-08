import { Router } from "express";
import { login, register } from "../auth/auth.schema.js";
import { update, updatePassword } from "../user/user.schema.js";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { validateTokenPartner } from "../middlewares/validates/validateTokenPartner.js";
import {
  getPartner,
  registerPartner,
  putPartner,
  putPartnerPassword,
  loginPartner,
  logoutPartner,
  verifyPartner,
  deletePartner,
} from "./partner.controllers.js";

const partnerRouter = Router();

partnerRouter.get("/partners/get/:partner_ID", getPartner);
partnerRouter.post("/partners/register", validateSchema(register), registerPartner);
partnerRouter.put("/partners/update", validateSchema(update), validateTokenPartner, putPartner);
partnerRouter.put(
  "/partners/password/update/:partner_ID",
  validateSchema(updatePassword),
  validateTokenPartner,
  putPartnerPassword
);
partnerRouter.post("/partners/login", validateSchema(login), loginPartner);
partnerRouter.post("/partners/logout", logoutPartner);
partnerRouter.get("/partners/verify", verifyPartner);
partnerRouter.delete("/delete/partners/:partner_ID", validateTokenPartner, deletePartner);

export default partnerRouter;
