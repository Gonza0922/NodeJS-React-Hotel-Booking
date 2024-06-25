import jwt from "jsonwebtoken";

export const validateTokenPartner = (req, res, next) => {
  const { PartnerToken } = req.cookies;
  if (!PartnerToken) return res.status(401).json({ message: "No authorization" });
  jwt.verify(PartnerToken, process.env.TOKEN_SECURE, (err, partner) => {
    if (err) res.status(401).json({ message: "Invalid Token" });
    req.partner = partner;
    next();
  });
};
