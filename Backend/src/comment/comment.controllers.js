import { db } from "../tables.js";
import { generateToken } from "../jwt/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllComments = async (req, res) => {
  //Select all comments
  try {
    const [comments] = await db.query("SELECT * FROM comments");
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Comments" });
  }
};

export const getCommentPerId = async (req, res) => {
  //Select the comment that matches the comment_ID sent by parameter
  try {
    const { comment_ID } = req.params;
    const [findComment] = await db.query("SELECT * FROM comments WHERE comment_ID = ?", [
      comment_ID,
    ]);
    if (findComment.length === 0) return res.status(400).json({ message: ["Comment not found"] });
    res.status(200).json(findComment[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Comment for comment_ID ${comment_ID}`,
    });
  }
};

export const getCommentPerHotel = async (req, res) => {
  //Select the comment(s) created by the Hotel_ID sent by parameter
  try {
    const { hotel_ID } = req.params;
    const [findComments] = await db.query("SELECT * FROM comments WHERE hotel_ID = ?", [
      hotel_ID,
    ]);
    res.status(200).json(findComments);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Comment for hotel_ID ${hotel_ID}`,
    });
  }
};

export const getCommentPerUser = async (req, res) => {
  //Select the comment that matches the user_ID sent by parameter
  try {
    const { user_ID } = req.params;
    const [findComments] = await db.query("SELECT * FROM comments WHERE user_ID = ?", [user_ID]);
    res.status(200).json(findComments);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Comment for user_ID ${user_ID}`,
    });
  }
};

export const postComment = async (req, res) => {
  //Create a comment
  try {
    const { user_ID } = req.user;
    const q = "INSERT INTO comments(content, user_ID, hotel_ID) VALUES (?)";
    const values = [req.body.content, user_ID, req.body.hotel_ID];
    const createComment = await db.query(q, [values]);
    const comment_ID = createComment[0].insertId;
    const [comment] = await db.query("SELECT * FROM comments WHERE comment_ID = ?", [comment_ID]);
    res.status(201).json(comment[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to register Comment" });
  }
};

export const putComment = async (req, res) => {
  //Update a comment that matches the comment_ID sent by parameter
  try {
    const { comment_ID } = req.params;
    const q = "UPDATE comments SET content = ? WHERE comment_ID = ?";
    const values = [req.body.content];
    await db.query(q, [...values, comment_ID]);
    res.status(200).json({ message: `Comment ${comment_ID} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Comment" });
  }
};

export const deleteComment = async (req, res) => {
  //Delete a comment that matches the comment_ID sent by parameter
  try {
    const { comment_ID } = req.params;
    const [deleteComment] = await db.query("DELETE FROM comments WHERE comment_ID = ?", [
      comment_ID,
    ]);
    if (deleteComment.affectedRows === 0)
      return res.status(400).json({ message: ["Comment doesn´t exists"] });
    res.status(204).json({
      message: `Comment ${comment_ID} deleted with its images`,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete Comment" });
  }
};

export const verifyPIN = async (req, res) => {
  //Check if the PIN exists in the database and create a cookie
  try {
    const { hotel_ID } = req.params;
    const [findPIN] = await db.query(
      "SELECT PIN FROM reservations WHERE reservation_ID = ? AND hotel_ID = ?",
      [req.body.reservation_ID, hotel_ID]
    );
    if (findPIN.length === 0)
      return res.status(400).json({
        message: ["Reservation not found, try again"],
      });
    const isMatch = await bcrypt.compare(req.body.PIN.toString(), findPIN[0].PIN);
    if (!isMatch) return res.status(400).json({ message: ["Incorrect PIN"] });
    const token = await generateToken({ PIN: req.body.PIN });
    res.cookie(`TokenPIN`, token);
    res.status(200).json({
      message: "User authorized",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to verify PIN" });
  }
};

export const verifyTokenPIN = async (req, res) => {
  //Check if the TokenPIN exists/matches to be able to write a review
  try {
    const { user_ID } = req.user;
    const TokenPIN = req.cookies.TokenPIN; //encriptado
    if (!TokenPIN) return res.status(400).json({ message: "Unauthorized, no PIN" });
    jwt.verify(TokenPIN, process.env.TOKEN_SECURE, async (err, resultPIN) => {
      if (err) return res.status(400).json({ message: "PIN verification error" });
      const [findPIN] = await db.query("SELECT PIN FROM reservations WHERE user_ID = ?", [
        user_ID,
      ]);
      if (findPIN.length === 0) return res.status(400).json({ message: "PIN not found" });
      const isMatch = await bcrypt.compare(resultPIN.PIN.toString(), findPIN[0].PIN);
      if (!isMatch) return res.status(400).json({ message: "Incorrect PIN" });
      return res.status(200).json({
        message: "User Authorized",
      });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to verify TokenPIN" });
  }
};
