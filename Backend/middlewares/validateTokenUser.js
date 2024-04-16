import jwt from "jsonwebtoken";

export const validateTokenUser = (req, res, next) => {
  const { UserToken } = req.cookies;
  if (!UserToken) return res.status(401).json({ message: "No authorization" });
  jwt.verify(UserToken, process.env.TOKEN_SECURE, (err, user) => {
    if (err) res.status(401).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};
