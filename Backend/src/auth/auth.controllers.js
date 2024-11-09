import { db } from "../tables.js";
import { generateToken } from "../jwt/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  //Register a new user/partner
  try {
    const { role } = req.body;
    if (role !== "users" && role !== "partners")
      return res.status(400).json({ message: "Invalid role" });
    const roleId = role === "users" ? "user" : "partner";
    const stringRole = role === "users" ? "User" : "Partner";
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const q = `INSERT INTO ${role}(email, password, first_name, last_name, birthdate, nacionality, phone) VALUES (?)`;
    const values = [
      req.body.email,
      hashedPassword,
      req.body.first_name,
      req.body.last_name,
      req.body.birthdate.replace("T", " ").substring(0, 19),
      req.body.nacionality,
      req.body.phone,
    ];
    const [findEmail] = await db.query(`SELECT email FROM ${role} WHERE email = ?`, [
      req.body.email,
    ]);
    if (findEmail.length > 0) return res.status(409).json({ message: ["Email already exists"] });
    const createUser = await db.query(q, [values]);
    const user_ID = createUser[0].insertId;
    const [user] = await db.query(`SELECT * FROM ${role} WHERE ${roleId}_ID = ?`, [user_ID]);
    const tokenPayload =
      role === "users"
        ? { user_ID: user[0].user_ID, role }
        : { partner_ID: user[0].partner_ID, role };
    const token = await generateToken(tokenPayload);
    res.cookie(`${stringRole}Token`, token);
    res.status(201).json(user[0], token);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to register User/Partner" });
  }
};

export const loginUser = async (req, res) => {
  //Log in a user/partner that matches the data sent
  try {
    const { email, password, role } = req.body;
    if (role !== "users" && role !== "partners")
      return res.status(400).json({ message: "Invalid role" });
    const stringRole = role === "users" ? "User" : "Partner";
    const [user] = await db.query(`SELECT * FROM ${role} WHERE email = ?`, [email]);
    if (user.length === 0) return res.status(404).json({ message: `${stringRole} not found` });
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect Password" });
    const tokenPayload =
      role === "users"
        ? { user_ID: user[0].user_ID, role }
        : { partner_ID: user[0].partner_ID, role };
    const token = await generateToken(tokenPayload);
    res.cookie(`${stringRole}Token`, token);
    const responseData = {
      message: "Logged in",
      first_name: user[0].first_name,
      last_name: user[0].last_name,
      ...(role === "users" ? { user_ID: user[0].user_ID } : { partner_ID: user[0].partner_ID }),
    };
    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to login User/Partner" });
  }
};

export const logoutUser = async (req, res) => {
  //Log out a user/partner
  try {
    const { role } = req.body;
    const stringRole = role === "users" ? "User" : "Partner";
    res.cookie(`${stringRole}Token`, "", { expires: new Date(0) });
    return res.status(200).json({ message: "Disconnected" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to logout User/Partner" });
  }
};

export const verifyUser = async (req, res) => {
  //Check if the UserToken/PartnerToken exists/matches to enter the user/partner account
  try {
    const { UserToken, PartnerToken } = req.cookies;
    const token = UserToken || PartnerToken;
    if (!token) return res.status(401).json({ message: "Unauthorized, no token" });
    jwt.verify(token, process.env.TOKEN_SECURE, async (err, user) => {
      if (err) return res.status(400).json({ message: "Verification error" });
      const { role } = user;
      const roleId = role === "users" ? "user" : "partner";
      const stringRole = role === "users" ? "User" : "Partner";
      const [userFound] = await db.query(`SELECT * FROM ${role} WHERE ${roleId}_ID = ?`, [
        user.user_ID,
      ]);
      if (userFound.length === 0)
        return res.status(404).json({ message: `${stringRole} not found` });
      const responseData = {
        first_name: userFound[0].first_name,
        last_name: userFound[0].last_name,
        email: userFound[0].email,
        ...(role === "users"
          ? { user_ID: userFound[0].user_ID }
          : { partner_ID: userFound[0].partner_ID }),
      };
      return res.status(200).json(responseData);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to verify User/Partner" });
  }
};
