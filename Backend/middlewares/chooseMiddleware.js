import { validateTokenPartner } from "./validates/validateTokenPartner.js";
import { validateTokenUser } from "./validates/validateTokenUser.js";

export const chooseMiddleware = (req, res, next) => {
  req.cookies.PartnerToken
    ? validateTokenPartner(req, res, next)
    : validateTokenUser(req, res, next);
};
