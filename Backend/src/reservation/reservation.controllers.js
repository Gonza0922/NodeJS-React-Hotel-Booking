import { db } from "../tables.js";

export const getReservationPerUser = async (req, res) => {
  //Select the reservation that matches the user_ID, selected when validating the UserToken
  try {
    const { user_ID } = req.user;
    const [findReservation] = await db.query("SELECT * FROM reservations WHERE user_ID = ?", [
      user_ID,
    ]);
    res.status(200).json(findReservation);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Reservation for user_ID ${user_ID}`,
    });
  }
};

export const getReservationPerId = async (req, res) => {
  //Select the reservation that matches the reservation_ID sent by parameter
  try {
    const { reservation_ID } = req.params;
    const [findReservation] = await db.query(
      "SELECT * FROM reservations WHERE reservation_ID = ?",
      [reservation_ID]
    );
    if (findReservation.length === 0)
      return res.status(400).json({ message: "Reservation not found" });
    res.status(200).json(findReservation[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Reservation for reservation_ID ${reservation_ID}`,
    });
  }
};

export const getReservationPerHotel = async (req, res) => {
  //Select the reservation that matches the hotel_ID sent by parameter
  try {
    const { hotel_ID } = req.params;
    const [findReservation] = await db.query("SELECT * FROM reservations WHERE hotel_ID = ?", [
      hotel_ID,
    ]);
    if (!findReservation)
      return res.status(400).json({
        message: `In reservations the hotel with id ${hotel_ID} is not found`,
      });
    res.status(200).json(findReservation);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: `Failed to recover Reservation for hotel_ID ${hotel_ID}`,
    });
  }
};

export const postReservation = async (req, res) => {
  //Create a reservation
  try {
    const { user_ID } = req.user;
    const [calculateNights] = await db.query("SELECT DATEDIFF(?, ?) AS nights", [
      req.body.check_out,
      req.body.check_in,
    ]);
    const [calculatePersonPrice] = await db.query(
      "SELECT ((SELECT price_per_night from hotels WHERE hotel_ID = ?) * ?) AS person_price",
      [req.body.hotel_ID, calculateNights[0].nights]
    );
    const [calculateTotalPrice] = await db.query("SELECT (? * ?) AS total_price", [
      calculatePersonPrice[0].person_price,
      req.body.guests,
    ]);
    let PIN = Math.floor(Math.random() * 900000) + 100000;
    const [findPIN] = await db.query("SELECT PIN from reservations WHERE PIN = ? ", [PIN]);
    if (findPIN.length > 0) PIN = Math.floor(Math.random() * 900000) + 100000;
    const q =
      "INSERT INTO reservations(check_in, check_out, nights, guests, room_type, person_price, total_price, PIN, user_ID, hotel_ID) VALUES (?)";
    const values = [
      req.body.check_in.replace("T", " ").substring(0, 19),
      req.body.check_out.replace("T", " ").substring(0, 19),
      calculateNights[0].nights,
      req.body.guests,
      req.body.room_type,
      calculatePersonPrice[0].person_price,
      calculateTotalPrice[0].total_price,
      PIN,
      user_ID,
      req.body.hotel_ID,
    ];
    const [ItsReserved] = await db.query(
      "SELECT check_in, check_out FROM reservations WHERE check_in = ? AND check_out = ? AND room_type = ? AND hotel_ID = ?",
      [req.body.check_in, req.body.check_out, req.body.room_type, req.body.hotel_ID]
    );
    if (ItsReserved.length > 0)
      return res.status(400).json({
        message: "Sorry, the hotel is already booked for those dates",
      });
    const [iHaveReservation] = await db.query(
      "SELECT user_ID, hotel_ID FROM reservations WHERE user_ID = ? AND hotel_ID = ?",
      [user_ID, req.body.hotel_ID]
    );
    if (iHaveReservation.length > 0 && req.body.doIt === false)
      return res.status(400).json({
        message: "You have already made a reservation at that hotel",
      });
    const createReservation = await db.query(q, [values]);
    const reservation_ID = createReservation[0].insertId;
    const [reservation] = await db.query("SELECT * FROM reservations WHERE reservation_ID = ?", [
      reservation_ID,
    ]);
    res.status(201).json(reservation[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to create Reservation" });
  }
};

export const putReservation = async (req, res) => {
  //Update reservation
  try {
    const { user_ID } = req.user;
    const { reservation_ID } = req.params;
    const [calculateNights] = await db.query("SELECT DATEDIFF(?, ?) AS nights", [
      req.body.check_out,
      req.body.check_in,
    ]);
    const [calculatePersonPrice] = await db.query(
      "SELECT ((SELECT price_per_night from hotels WHERE hotel_ID = ?) * ?) AS person_price",
      [req.body.hotel_ID, calculateNights[0].nights]
    );
    const [calculateTotalPrice] = await db.query("SELECT (? * ?) AS total_price", [
      calculatePersonPrice[0].person_price,
      req.body.guests,
    ]);
    const q =
      "UPDATE reservations SET check_in = ?, check_out  = ?, nights  = ?, guests  = ?, room_type = ?, person_price  = ?, total_price  = ? WHERE reservation_ID = ?";
    const values = [
      req.body.check_in,
      req.body.check_out,
      calculateNights[0].nights,
      req.body.guests,
      req.body.room_type,
      calculatePersonPrice[0].person_price,
      calculateTotalPrice[0].total_price,
    ];
    const [ItsReserved] = await db.query(
      "SELECT user_ID, hotel_ID FROM reservations WHERE check_in = ? AND check_out = ? AND room_type = ? AND hotel_ID = ?",
      [req.body.check_in, req.body.check_out, req.body.room_type, req.body.hotel_ID]
    );
    if (
      ItsReserved.length > 0 &&
      user_ID !== ItsReserved[0].user_ID &&
      req.body.hotel_ID !== ItsReserved[0].hotel_ID
    )
      return res.status(400).json({
        message: ["Sorry, the hotel is already booked for those dates"],
      });
    await db.query(q, [...values, reservation_ID]);
    res.status(200).json({ message: `Reservation ${reservation_ID} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Reservation" });
  }
};

export const deleteReservation = async (req, res) => {
  //Delete a reservation
  try {
    const { reservation_ID } = req.params;
    const [deleteReservation] = await db.query(
      "DELETE FROM reservations WHERE reservation_ID = ?",
      reservation_ID
    );
    if (deleteReservation.affectedRows === 0)
      return res.status(400).json({ message: "Reservation doesn´t exists" });
    res.status(204).json({ message: `Reservation ${reservation_ID} deleted` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete Reservation" });
  }
};
