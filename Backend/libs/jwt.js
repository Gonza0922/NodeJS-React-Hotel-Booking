import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECURE,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};
