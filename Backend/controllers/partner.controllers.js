import { db } from "../tables.js";

import { generateToken } from "../libs/jwt.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getPartner = async (req, res) => {
  //Selecciona el partner que coincida con el partner_ID enviado por parametro
  try {
    const id = req.params.partner_ID;
    const [findPartner] = await db.query("SELECT * FROM partners WHERE partner_ID = ?", id);
    if (findPartner.length === 0) return res.status(400).json({ message: "Partner not found" });
    res.json(findPartner[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Partner" });
  }
};

export const registerPartner = async (req, res) => {
  //Registra un partner nuevo
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const q =
      "INSERT INTO partners(email, password, first_name, last_name, DNI, phone) VALUES (?)";
    const values = [
      req.body.email,
      hashedPassword,
      req.body.first_name,
      req.body.last_name,
      req.body.DNI,
      req.body.phone,
    ];
    const [findDNI] = await db.query("SELECT DNI FROM partners WHERE DNI = ?", [req.body.DNI]);
    if (findDNI.length > 0) return res.status(400).json({ message: "Partner already exists" });
    const create = await db.query(q, [values]);
    const getID = create[0].insertId;
    const [partner] = await db.query("SELECT * FROM partners WHERE partner_ID = ?", [getID]);
    const token = await generateToken({ partner_ID: partner[0].partner_ID });
    res.cookie("PartnerToken", token);
    res.status(201).json(partner[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to register Partner" });
  }
};

export const putPartner = async (req, res) => {
  //Actualiza un partner
  try {
    const q =
      "UPDATE partners SET email = ?, first_name = ?, last_name = ?, DNI = ?, phone = ? WHERE partner_ID = ?";
    const values = [
      req.body.email,
      req.body.first_name,
      req.body.last_name,
      req.body.DNI,
      req.body.phone,
    ];
    const [findDNI] = await db.query("SELECT DNI FROM partners WHERE partner_ID = ?", [
      req.body.partner_ID,
    ]);
    if (findDNI.length > 0 && findDNI[0].DNI !== req.body.DNI)
      return res.status(400).json({ message: "Partner already exists" });
    await db.query(q, [...values, req.body.partner_ID]);
    res.status(200).json({ message: `Partner ${req.body.partner_ID} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Partner" });
  }
};

export const putPartnerPassword = async (req, res) => {
  //Actualiza la contraseña de un partner
  try {
    const id = req.params.partner_ID;
    if (req.body.newPassword !== req.body.againNewPassword)
      return res.status(400).json({ message: "New passwords don't match" });
    const [findPassword] = await db.query("SELECT password FROM partners WHERE partner_ID = ?", [
      id,
    ]);
    const isMatch = await bcrypt.compare(req.body.oldPassword, findPassword[0].password);
    if (!isMatch) return res.status(400).json({ message: "Old Password Incorrect" });
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    await db.query("UPDATE partners SET password = ? WHERE partner_ID = ?", [hashedPassword, id]);
    res.status(200).json({ message: `Partner password from partner ${id} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Partner password" });
  }
};
export const loginPartner = async (req, res) => {
  //Loguea un partner que coincida con los datos enviados
  try {
    const { email, password } = req.body;
    const [partner] = await db.query("SELECT * FROM partners WHERE email = ?", [email]);
    if (partner.length === 0) return res.status(400).json({ message: "Partner not found" });
    const isMatch = await bcrypt.compare(password, partner[0].password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect Password" });
    const token = await generateToken({ partner_ID: partner[0].partner_ID });
    res.cookie("PartnerToken", token);
    res.status(200).json({
      partner_ID: partner[0].partner_ID,
      first_name: partner[0].first_name,
      last_name: partner[0].last_name,
      message: "Logged in",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to login Partner" });
  }
};

export const logoutPartner = async (req, res) => {
  //Desloguea un partner
  try {
    res.cookie("PartnerToken", "", { expires: new Date(0) });
    return res.status(200).json({ message: "Disconnected" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to logout Partner" });
  }
};

export const verifyPartner = async (req, res) => {
  //Verifica si existe/coincide el PartnerToken para ingresar a la cuenta del partner
  try {
    const { PartnerToken } = req.cookies;
    if (!PartnerToken) return res.status(400).json({ message: "Unauthorized, no token" });
    jwt.verify(PartnerToken, process.env.TOKEN_SECURE, async (err, partner) => {
      if (err) return res.status(400).json({ message: "Verification error" });
      const [partnerFound] = await db.query(
        "SELECT * FROM partners WHERE partner_ID = ?",
        partner.partner_ID
      );
      if (partnerFound.length === 0)
        return res.status(400).json({ message: "Partner not found" });
      return res.json({
        partner_ID: partnerFound[0].partner_ID,
        email: partnerFound[0].email,
        first_name: partnerFound[0].first_name,
        last_name: partnerFound[0].last_name,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to verify Partner" });
  }
};

export const deletePartner = async (req, res) => {
  //Elimina un partner que coincida con el partner_ID enviado por parametro y todas sus reservaciones
  try {
    let count = 0;
    const { partner_ID } = req.params;
    const [findHotel_ID] = await db.query(
      "SELECT hotel_ID FROM hotels WHERE partner_ID = ?",
      partner_ID
    );
    // eliminar principal
    for (let i = 0; i < findHotel_ID.length; i++) {
      const [getUrl] = await db.query("SELECT principalImg FROM hotels WHERE hotel_ID = ?", [
        findHotel_ID[i].hotel_ID,
      ]);
      if (getUrl[0].principalImg === "none") {
        console.log({
          message: "There are no images to delete from Principal_Img",
        });
      }
      const url = getUrl[0].principalImg;
      const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
      if (url !== "none") {
        if (match && match[1]) {
          const publicId = match[1];
          await cloudinary.uploader.destroy(publicId);
          console.log("Image successfully removed from cloudinary");
        } else {
          console.error("Couldn´t extract Public ID from URL");
        }
      }
      // eliminar photos
      const [getPhotosUrl] = await db.query("SELECT image_name FROM images WHERE hotel_ID = ?", [
        findHotel_ID[i].hotel_ID,
      ]);
      if (getPhotosUrl[0] === undefined) {
        console.log({ message: "There are no images to delete from images" });
      }
      getPhotosUrl.forEach(async (element) => {
        const url = element.image_name;
        const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
        if (match && match[1]) {
          count++;
          const publicId = match[1];
          await cloudinary.uploader.destroy(publicId);
        } else {
          console.error("Couldn´t extract Public ID from URL");
        }
      });
      console.log(`${count} Images successfully removed from cloudinary`);
      await db.query("DELETE FROM images WHERE hotel_ID = ?", findHotel_ID[i].hotel_ID);
      await db.query("DELETE FROM reservations WHERE hotel_ID = ?", findHotel_ID[i].hotel_ID);
    }
    await db.query("DELETE FROM hotels WHERE partner_ID = ?", partner_ID);
    const [deletePartner] = await db.query(
      "DELETE FROM partners WHERE partner_ID = ?",
      partner_ID
    );
    if (deletePartner.affectedRows === 0)
      return res.status(400).json({ message: "Partner doesn´t exists" });
    res.cookie("PartnerToken", "", { expires: new Date(0) });
    res.status(200).json({ message: `Partner ${partner_ID} and his hotels deleted` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete Partner" });
  }
};
