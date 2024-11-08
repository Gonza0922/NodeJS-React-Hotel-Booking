import { db } from "../tables.js";
import { generateToken } from "../jwt/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  //Register a new user
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const q =
      "INSERT INTO users(email, password, first_name, last_name, birthdate, nacionality, phone) VALUES (?)";
    const values = [
      req.body.email,
      hashedPassword,
      req.body.first_name,
      req.body.last_name,
      req.body.birthdate.replace("T", " ").substring(0, 19),
      req.body.nacionality,
      req.body.phone,
    ];
    const [findEmail] = await db.query("SELECT email FROM users WHERE email = ?", [
      req.body.email,
    ]);
    if (findEmail.length > 0) return res.status(409).json({ message: ["Email already exists"] });
    const createUser = await db.query(q, [values]);
    const user_ID = createUser[0].insertId;
    const [user] = await db.query("SELECT * FROM users WHERE user_ID = ?", [user_ID]);
    const token = await generateToken({ user_ID: user[0].user_ID });
    res.cookie("UserToken", token);
    res.status(201).json(user[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to register User" });
  }
};

export const loginUser = async (req, res) => {
  //Log in a user that matches the data sent
  try {
    const { email, password } = req.body;
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect Password" });
    const token = await generateToken({ user_ID: user[0].user_ID });
    res.cookie("UserToken", token);
    res.status(200).json({
      user_ID: user[0].user_ID,
      first_name: user[0].first_name,
      last_name: user[0].last_name,
      message: "Logged in",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to login User" });
  }
};

export const logoutUser = async (req, res) => {
  //Log out a partner
  try {
    res.cookie("UserToken", "", { expires: new Date(0) });
    return res.status(200).json({ message: "Disconnected" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to logout user" });
  }
};

export const verifyUser = async (req, res) => {
  //Check if the UserToken exists/matches to enter the user account
  try {
    const { UserToken } = req.cookies;
    if (!UserToken) return res.status(401).json({ message: "Unauthorized, no token" });
    jwt.verify(UserToken, process.env.TOKEN_SECURE, async (err, user) => {
      if (err) return res.status(400).json({ message: "Verification error" });
      const [userFound] = await db.query("SELECT * FROM users WHERE user_ID = ?", [user.user_ID]);
      if (userFound.length === 0) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({
        user_ID: userFound[0].user_ID,
        first_name: userFound[0].first_name,
        last_name: userFound[0].last_name,
        email: userFound[0].email,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to verify User" });
  }
};
