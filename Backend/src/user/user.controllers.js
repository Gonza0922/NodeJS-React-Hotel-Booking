import { db } from "../tables.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  //Select all users
  try {
    const { limit, page } = req.query;
    const offset = (page - 1) * limit;
    const [users] = await db.query("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
    const [totalPageData] = await db.query("SELECT count(*) as count FROM users");
    const totalPage = Math.ceil(totalPageData[0]?.count / limit);
    res.status(200).json({ data: users, pagination: { page, limit, totalPage } });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Users" });
  }
};

export const getUserId = async (req, res) => {
  //Select the user that matches the user_ID sent by parameter
  try {
    const { user_ID } = req.params;
    const [findUser] = await db.query("SELECT * FROM users WHERE user_ID = ?", [user_ID]);
    if (findUser.length === 0) return res.status(404).json({ message: "User not found" });
    res.status(200).json(findUser[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover User for user_ID ${user_ID}`,
    });
  }
};

export const putUser = async (req, res) => {
  //Update a user
  try {
    const q =
      "UPDATE users SET email = ?, first_name = ?, last_name = ?, birthdate = ?, nacionality = ?, phone = ? WHERE user_ID = ?";
    const values = [
      req.body.email,
      req.body.first_name,
      req.body.last_name,
      req.body.birthdate.replace("T", " ").substring(0, 19),
      req.body.nacionality,
      req.body.phone,
    ];
    const [myData] = await db.query("SELECT email FROM users WHERE user_ID = ?", [
      req.body.user_ID,
    ]);
    const [findEmail] = await db.query("SELECT email FROM users WHERE email = ?", [
      req.body.email,
    ]);
    if (findEmail.length > 0 && myData[0].email !== req.body.email)
      return res.status(409).json({ message: "Email already exists" });
    await db.query(q, [...values, req.body.user_ID]);
    res.status(200).json({ message: `User ${req.body.user_ID} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update User" });
  }
};

export const putUserPassword = async (req, res) => {
  //Update a user's password
  try {
    const { oldPassword, newPassword, againNewPassword } = req.body;
    const { user_ID } = req.params;
    if (newPassword !== againNewPassword)
      return res.status(400).json({ message: "New passwords don't match" });
    const [findPassword] = await db.query("SELECT password FROM users WHERE user_ID = ?", [
      user_ID,
    ]);
    const isMatch = await bcrypt.compare(oldPassword, findPassword[0].password);
    if (!isMatch) return res.status(400).json({ message: "Old Password Incorrect" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE user_ID = ?", [hashedPassword, user_ID]);
    res.status(200).json({
      message: `Password from user ${user_ID} updated`,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update User password" });
  }
};

export const deleteUser = async (req, res) => {
  //Delete a user that matches the user_ID sent by parameter and all its reservations
  try {
    const { user_ID } = req.params;
    await db.query("DELETE FROM reservations WHERE user_ID = ?", [user_ID]);
    const [deleteUser] = await db.query("DELETE FROM users WHERE user_ID = ?", [user_ID]);
    if (deleteUser.affectedRows === 0)
      return res.status(404).json({ message: "User doesn´t exists" });
    res.cookie("UserToken", "", { expires: new Date(0) });
    res.status(204).json({
      message: `User ${user_ID} and his reservations deleted`,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete User" });
  }
};
