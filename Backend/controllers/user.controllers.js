import { db } from "../tables.js";

import { generateToken } from "../libs/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  //Selecciona todos los usuarios
  try {
    const [findUser] = await db.query("SELECT * FROM users");
    res.status(200).json(findUser);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Users" });
  }
};

export const getUserId = async (req, res) => {
  //Selecciona el usuario que coincida con el user_ID enviado por parametro
  try {
    const id = req.params.user_ID;
    const [findUser] = await db.query("SELECT * FROM users WHERE user_ID = ?", id);
    if (findUser.length === 0) return res.status(400).json({ message: "User not found" });
    res.status(200).json(findUser[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover User" });
  }
};

export const registerUser = async (req, res) => {
  //Registra un usuario nuevo
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const q = "INSERT INTO users(email, password, first_name, last_name, DNI, phone) VALUES (?)";
    const values = [
      req.body.email,
      hashedPassword,
      req.body.first_name,
      req.body.last_name,
      req.body.DNI,
      req.body.phone,
    ];
    const [findDNI] = await db.query("SELECT DNI FROM users WHERE DNI = ?", [req.body.DNI]);
    if (findDNI.length > 0) return res.status(400).json({ message: "User already exists" });
    const create = await db.query(q, [values]);
    const getID = create[0].insertId;
    const [user] = await db.query("SELECT * FROM users WHERE user_ID = ?", [getID]);
    const token = await generateToken({ user_ID: user[0].user_ID });
    res.cookie("UserToken", token);
    res.status(201).json(user[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to register User" });
  }
};

export const putUser = async (req, res) => {
  //Actualiza un usuario
  try {
    const q =
      "UPDATE users SET email = ?, first_name = ?, last_name = ?, DNI = ?, phone = ? WHERE user_ID = ?";
    const values = [
      req.body.email,
      req.body.first_name,
      req.body.last_name,
      req.body.DNI,
      req.body.phone,
    ];
    const [findDNI] = await db.query("SELECT DNI FROM users WHERE user_ID = ?", [
      req.body.user_ID,
    ]);
    if (findDNI.length > 0 && findDNI[0].DNI !== req.body.DNI)
      //se encontro un DNI igual al que pongo y el DNI es distinto del DNI del user al que estoy editando
      return res.status(400).json({ message: "User already exists" });
    await db.query(q, [...values, req.body.user_ID]);
    res.status(200).json({ message: `User ${req.body.user_ID} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update User" });
  }
};

export const putUserPassword = async (req, res) => {
  //Actualiza la contraseña de un usuario
  try {
    const { oldPassword, newPassword, againNewPassword } = req.body;
    const id = req.params.user_ID;
    if (newPassword !== againNewPassword)
      return res.status(400).json({ message: "New passwords don't match" });
    const [findPassword] = await db.query("SELECT password FROM users WHERE user_ID = ?", [id]);
    const isMatch = await bcrypt.compare(oldPassword, findPassword[0].password);
    if (!isMatch) return res.status(400).json({ message: "Old Password Incorrect" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE user_ID = ?", [hashedPassword, id]);
    res.status(200).json({ message: `User password from user ${id} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update User password" });
  }
};

export const loginUser = async (req, res) => {
  //Loguea un usuario que coincida con los datos enviados
  try {
    const { email, password } = req.body;
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect Password" });
    const token = await generateToken({ user_ID: user[0].user_ID });
    res.cookie("UserToken", token);
    res.status(200).json({
      user_ID: user[0].user_ID,
      first_name: user[0].first_name,
      message: "Logged in",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to login User" });
  }
};

export const logoutUser = async (req, res) => {
  //Desloguea un usuario
  try {
    res.cookie("UserToken", "", { expires: new Date(0) });
    return res.status(200).json({ message: "Disconnected" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to logout user" });
  }
};

export const verifyUser = async (req, res) => {
  //Verifica si existe/coincide el UserToken para ingresar a la cuenta del usuario
  try {
    const { UserToken } = req.cookies;
    if (!UserToken) return res.status(400).json({ message: "Unauthorized, no token" });
    jwt.verify(UserToken, process.env.TOKEN_SECURE, async (err, user) => {
      if (err) return res.status(400).json({ message: "Verification error" });
      const [userFound] = await db.query("SELECT * FROM users WHERE user_ID = ?", user.user_ID);
      if (userFound.length === 0) return res.status(400).json({ message: "User not found" });
      return res.status(200).json({
        user_ID: userFound[0].user_ID,
        first_name: userFound[0].first_name,
        email: userFound[0].email,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to verify User" });
  }
};

export const deleteUser = async (req, res) => {
  //Elimina un usuario que coincida con el user_ID enviado por parametro y todas sus reservaciones
  try {
    const id = req.params.user_ID;
    await db.query("DELETE FROM reservations WHERE user_ID = ?", id);
    const [deleteUser] = await db.query("DELETE FROM users WHERE user_ID = ?", id);
    if (deleteUser.affectedRows === 0)
      return res.status(400).json({ message: "User doesn´t exists" });
    res.cookie("UserToken", "", { expires: new Date(0) });
    res.status(200).json({ message: `User ${id} and his reservations deleted` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete User" });
  }
};
