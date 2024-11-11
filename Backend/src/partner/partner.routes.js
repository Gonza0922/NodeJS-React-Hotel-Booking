import { Router } from "express";
import { update, updatePassword } from "../user/user.schema.js";
import { validateSchema } from "../middlewares/validates/validateSchema.js";
import { validateTokenPartner } from "../middlewares/validates/validateTokenPartner.js";
import {
  getPartner,
  putPartner,
  putPartnerPassword,
  deletePartner,
} from "./partner.controllers.js";

const partnerRouter = Router();

partnerRouter.get("/get/:partner_ID", getPartner);
partnerRouter.put("/update", validateSchema(update), validateTokenPartner, putPartner);
partnerRouter.put(
  "/password/update/:partner_ID",
  validateSchema(updatePassword),
  validateTokenPartner,
  putPartnerPassword
);
partnerRouter.delete("/delete/:partner_ID", validateTokenPartner, deletePartner);

export default partnerRouter;
