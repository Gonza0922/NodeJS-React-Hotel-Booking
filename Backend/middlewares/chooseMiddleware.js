import { validateTokenPartner } from "./validateTokenPartner.js";
import { validateTokenUser } from "./validateTokenUser.js";

export const chooseMiddleware = (req, res, next) => {
  req.cookies.PartnerToken
    ? validateTokenPartner(req, res, next)
    : validateTokenUser(req, res, next);
};
