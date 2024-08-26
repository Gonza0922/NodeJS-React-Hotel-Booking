import { db } from "../tables.js";
import redisClient from "../redisConfig.js";

const CACHE_KEY = `hotels:cache`;

export const getAllHotels = async (req, res) => {
  //Select all hotels
  try {
    const { limit = 1000000, page = 1 } = req.query;
    const cachedHotels = await redisClient.get(CACHE_KEY);
    const cachedData = JSON.parse(cachedHotels);
    if (cachedHotels && cachedData.pagination.limit === limit)
      return res.status(200).json(cachedData);
    const offset = (page - 1) * limit;
    const [hotels] = await db.query("SELECT * FROM hotels LIMIT ? OFFSET ?", [limit, offset]);
    const [totalPageData] = await db.query("SELECT count(*) as count FROM hotels");
    const totalPage = Math.ceil(totalPageData[0]?.count / limit);
    await redisClient.set(
      CACHE_KEY,
      JSON.stringify({ data: hotels, pagination: { page, limit, totalPage } })
    );
    res.status(200).json({ data: hotels, pagination: { page, limit, totalPage } });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Hotels" });
  }
};

export const getHotelId = async (req, res) => {
  //Select the hotel that matches the hotel_ID sent by parameter
  try {
    const { hotel_ID } = req.params;
    const [findHotel] = await db.query("SELECT * FROM hotels WHERE hotel_ID = ?", [hotel_ID]);
    if (findHotel.length === 0) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(findHotel[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Hotel for hotel_ID ${hotel_ID}`,
    });
  }
};

export const getHotelPerPartner = async (req, res) => {
  //Select the hotel(s) created by the partner_ID, selected when validating the PartnerToken
  try {
    const { partner_ID } = req.partner;
    const [findHotels] = await db.query("SELECT * FROM hotels WHERE partner_ID = ?", [
      partner_ID,
    ]);
    res.status(200).json(findHotels);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Hotel for partner_ID ${partner_ID}`,
    });
  }
};

export const postHotel = async (req, res) => {
  //Create a hotel
  try {
    const { partner_ID } = req.partner;
    const q =
      "INSERT INTO hotels(name, price_per_night, description, services, location, phone, principalImg, partner_ID) VALUES (?)";
    const values = [
      req.body.name,
      req.body.price_per_night,
      req.body.description,
      req.body.services,
      req.body.location,
      req.body.phone,
      "none",
      partner_ID,
    ];
    const [findName] = await db.query("SELECT name FROM hotels WHERE name = ?", [req.body.name]);
    if (findName.length > 0) return res.status(409).json({ message: "Hotel already exists" });
    const createHotel = await db.query(q, [values]);
    const hotel_ID = createHotel[0].insertId;
    const [hotel] = await db.query("SELECT * FROM hotels WHERE hotel_ID = ?", [hotel_ID]);
    await redisClient.del(CACHE_KEY);
    res.status(201).json(hotel[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to register Hotel" });
  }
};

export const putHotel = async (req, res) => {
  //Update a hotel that matches the hotel_ID sent by parameter
  try {
    const { hotel_ID } = req.params;
    const q =
      "UPDATE hotels SET name = ?, price_per_night = ?, description = ?, services = ?, location = ?, phone = ? WHERE hotel_ID = ?";
    const values = [
      req.body.name,
      req.body.price_per_night,
      req.body.description,
      req.body.services,
      req.body.location,
      req.body.phone,
    ];
    const [findName] = await db.query("SELECT name FROM hotels WHERE name = ?", [req.body.name]);
    const [findNamePerHotelId] = await db.query("SELECT name FROM hotels WHERE hotel_ID = ?", [
      hotel_ID,
    ]);
    if (findName.length > 0 && findNamePerHotelId[0].name !== req.body.name)
      return res.status(409).json({ message: "Hotel already exists" });
    await db.query(q, [...values, hotel_ID]);
    await redisClient.del(CACHE_KEY);
    res.status(200).json({ message: `Hotel ${hotel_ID} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Hotel" });
  }
};

export const deleteHotel = async (req, res) => {
  //Delete a hotel that matches the hotel_ID sent by parameter
  try {
    const { hotel_ID } = req.params;
    const [hasReservation] = await db.query(
      "SELECT hotel_ID FROM reservations WHERE hotel_ID = ?",
      hotel_ID
    );
    if (hasReservation.length > 0)
      for (let i = 0; i < hasReservation.length; i++) {
        await db.query("DELETE FROM reservations WHERE hotel_ID = ?", hasReservation[i].hotel_ID);
      }
    const [deleteHotelImages] = await db.query("DELETE FROM images WHERE hotel_ID = ?", hotel_ID);
    if (deleteHotelImages.affectedRows === 0) console.log({ message: "Hotel hasn´t images" });
    const [deleteHotel] = await db.query("DELETE FROM hotels WHERE hotel_ID = ?", hotel_ID);
    if (deleteHotel.affectedRows === 0)
      return res.status(404).json({ message: "Hotel doesn´t exists" });
    await redisClient.del(CACHE_KEY);
    res.status(204).json({
      message: `Hotel ${hotel_ID} deleted with its images`,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete Hotel" });
  }
};
