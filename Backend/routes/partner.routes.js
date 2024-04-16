import { Router } from "express";
import { register, login } from "../schemas/user.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateTokenPartner } from "../middlewares/validateTokenPartner.js";
import {
  getPartner,
  registerPartner,
  putPartner,
  putPartnerPassword,
  loginPartner,
  logoutPartner,
  verifyPartner,
  deletePartner,
} from "../controllers/partner.controllers.js";

const partnerRouter = Router();

partnerRouter.get("/partners/get/:partner_ID", getPartner);
partnerRouter.post(
  "/partners/register",
  validateSchema(register),
  registerPartner
);
partnerRouter.put("/partners/update", validateTokenPartner, putPartner);
partnerRouter.put(
  "/partners/password/update/:partner_ID",
  validateTokenPartner,
  putPartnerPassword
);
partnerRouter.post("/partners/login", validateSchema(login), loginPartner);
partnerRouter.post("/partners/logout", logoutPartner);
partnerRouter.get("/partners/verify", verifyPartner);
partnerRouter.delete(
  "/delete/partners/:partner_ID",
  validateTokenPartner,
  deletePartner
);

export default partnerRouter;
