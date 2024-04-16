import jwt from "jsonwebtoken";

export const validatePIN = (req, res, next) => {
  const { TokenPIN } = req.cookies;
  if (!TokenPIN)
    return res.status(401).json({ message: "No authorization, no PIN" });
  jwt.verify(TokenPIN, process.env.TOKEN_SECURE, (err, PIN) => {
    if (err) res.status(401).json({ message: "Invalid PIN" });
    req.PIN = PIN;
    next();
  });
};
