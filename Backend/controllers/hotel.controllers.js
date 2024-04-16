import { db } from "../tables.js";

export const getAllHotels = async (req, res) => {
  //Selecciona todos los hoteles
  try {
    const [hotels] = await db.query("SELECT * FROM hotels");
    res.status(200).json(hotels);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Hotels" });
  }
};

export const getHotelId = async (req, res) => {
  //Selecciona el hotel que coincida con el hotel_ID enviado por parametro
  try {
    const id = req.params.hotel_ID;
    const [findHotel] = await db.query(
      "SELECT * FROM hotels WHERE hotel_ID = ?",
      id
    );
    if (findHotel.length === 0)
      return res.status(400).json({ message: "Hotel not found" });
    res.status(200).json(findHotel[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Hotel for Hotel" });
  }
};

export const getHotelPerPartner = async (req, res) => {
  //Selecciona el/los hoteles creados por el partner_ID, seleccionado al validar el PartnerToken
  try {
    const { partner_ID } = req.partner;
    const [hotels] = await db.query(
      "SELECT * FROM hotels WHERE partner_ID = ?",
      [partner_ID]
    );
    res.status(200).json(hotels);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Hotel for Partner" });
  }
};

export const postHotel = async (req, res) => {
  //Crea un hotel
  try {
    const { partner_ID } = req.partner;
    const q1 =
      "INSERT INTO hotels(name, price_per_night, description, services, location, phone, principalImg, partner_ID) VALUES (?)";
    const values1 = [
      req.body.name,
      req.body.price_per_night,
      req.body.description,
      req.body.services,
      req.body.location,
      req.body.phone,
      "none",
      partner_ID,
    ];
    const [findName] = await db.query(
      "SELECT name FROM hotels WHERE name = ?",
      [req.body.name]
    );
    if (findName.length > 0)
      return res.status(400).json({ message: "Hotel already exists" });
    const createHotel = await db.query(q1, [values1]);
    const getID = createHotel[0].insertId; //id del hotel
    const [hotel] = await db.query("SELECT * FROM hotels WHERE hotel_ID = ?", [
      getID,
    ]);
    res.status(201).json(hotel[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to register Hotel" });
  }
};

export const putHotel = async (req, res) => {
  //Actualiza un hotel que coincida con el hotel_ID enviado
  try {
    const id = req.params.hotel_ID;
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
    if (
      req.body.name === "" ||
      req.body.price_per_night === "" ||
      req.body.description === "" ||
      req.body.services === "" ||
      req.body.location === "" ||
      req.body.phone === ""
    ) {
      return res.status(400).json({ message: "Fields are required" });
    }
    const [findName] = await db.query(
      "SELECT name FROM hotels WHERE name = ?",
      [req.body.name]
    );
    const [findNamePerId] = await db.query(
      "SELECT name FROM hotels WHERE hotel_ID = ?",
      [id]
    );
    if (findName.length > 0 && findNamePerId[0].name !== req.body.name)
      return res.status(400).json({ message: "Hotel already exists" });
    await db.query(q, [...values, id]);
    res.status(200).json({ message: `Hotel ${id} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Hotel" });
  }
};

export const deleteHotel = async (req, res) => {
  //Elimina un hotel que coincida con el hotel_ID enviado
  try {
    const id = req.params.hotel_ID;
    const [hasReservation] = await db.query(
      "SELECT hotel_ID FROM reservations WHERE hotel_ID = ?",
      id
    );
    if (hasReservation.length > 0)
      for (let i = 0; i < hasReservation.length; i++) {
        await db.query(
          "DELETE FROM reservations WHERE hotel_ID = ?",
          hasReservation[i].hotel_ID
        );
      }
    const [deleteHotelImages] = await db.query(
      "DELETE FROM images WHERE hotel_ID = ?",
      id
    );
    if (deleteHotelImages.affectedRows === 0)
      console.log({ message: "Hotel hasn´t images" });
    const [deleteHotel] = await db.query(
      "DELETE FROM hotels WHERE hotel_ID = ?",
      id
    );
    if (deleteHotel.affectedRows === 0)
      return res.status(400).json({ message: "Hotel doesn´t exists" });
    res.status(200).json({ message: `Hotel ${id} deleted with images` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete Hotel" });
  }
};
