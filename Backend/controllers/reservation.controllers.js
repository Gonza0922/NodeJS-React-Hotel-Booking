import { db } from "../tables.js";

export const getReservationPerUser = async (req, res) => {
  //Selecciona la reservacion que coincida con el user_ID, seleccionado al validar el UserToken
  try {
    const { user_ID } = req.user;
    const [reservations] = await db.query(
      "SELECT * FROM reservations WHERE user_ID = ?",
      [user_ID]
    );
    res.status(200).json(reservations);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Reservation for User" });
  }
};

export const getReservationId = async (req, res) => {
  //Selecciona la reservacion que coincida con el reservation_ID enviado por parametro
  try {
    const id = req.params.reservation_ID;
    const [findReservation] = await db.query(
      "SELECT * FROM reservations WHERE reservation_ID = ?",
      id
    );
    if (findReservation.length === 0)
      return res.status(400).json({ message: "Reservation not found" });
    res.status(200).json(findReservation[0]);
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to recover Reservation for Reservation" });
  }
};

export const getReservationPerHotel = async (req, res) => {
  //Selecciona la reservacion que coincida con el hotel_ID enviado por parametro
  try {
    const id = req.params.hotel_ID;
    const [prueba] = await db.query(
      "SELECT * FROM reservations WHERE hotel_ID = ?",
      id
    );
    if (!prueba)
      return res.status(400).json({
        message: `In reservations the hotel with id ${id} is not found`,
      });
    res.status(200).json(prueba);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to recover Reservation for Hotel" });
  }
};

export const postReservation = async (req, res) => {
  //Crea una reservacion
  try {
    const { user_ID } = req.user;
    const [calculateNights] = await db.query(
      "SELECT DATEDIFF(?, ?) AS nights",
      [req.body.check_out, req.body.check_in]
    );
    const query = `
      SELECT ((SELECT price_per_night from hotels
      WHERE hotel_ID = ?) * ?) AS total_price
    `;
    const [calculateTotalPrice] = await db.query(query, [
      req.body.hotel_ID,
      calculateNights[0].nights,
    ]);
    const q =
      "INSERT INTO reservations(check_in, check_out, nights, people, room_type, total_price, user_ID, hotel_ID) VALUES (?)";
    const values = [
      req.body.check_in,
      req.body.check_out,
      calculateNights[0].nights,
      req.body.people,
      req.body.room_type,
      calculateTotalPrice[0].total_price,
      user_ID,
      req.body.hotel_ID,
    ];
    const [createReservation] = await db.query(
      "SELECT user_ID, hotel_ID FROM reservations WHERE user_ID = ? AND hotel_ID = ?",
      [user_ID, req.body.hotel_ID]
    );
    if (createReservation.length > 0 && req.body.doIt === false)
      return res.status(400).json({
        message: "You have already made a reservation at that hotel",
      });
    const [ItsReserved] = await db.query(
      "SELECT check_in, check_out FROM reservations WHERE check_in = ? AND check_out = ? AND room_type = ? AND hotel_ID = ?",
      [
        req.body.check_in,
        req.body.check_out,
        req.body.room_type,
        req.body.hotel_ID,
      ]
    );
    if (ItsReserved.length > 0)
      return res.status(400).json({
        message: "Sorry, the hotel is already booked for those dates",
      });
    const create = await db.query(q, [values]);
    const getID = create[0].insertId;
    const [reservation] = await db.query(
      "SELECT * FROM reservations WHERE reservation_ID = ?",
      [getID]
    );
    res.status(201).json(reservation[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to create Reservation" });
  }
};

export const putReservation = async (req, res) => {
  //Actualiza una reservacion que coincida con el reservation_ID enviado
  try {
    const { user_ID } = req.user;
    const id = req.params.reservation_ID;
    const [calculateNights] = await db.query(
      "SELECT DATEDIFF(?, ?) AS nights",
      [req.body.check_out, req.body.check_in]
    );

    const query = `
      SELECT ((SELECT price_per_night from hotels
      WHERE hotel_ID = ?) * ?) AS total_price
    `;
    const [calculateTotalPrice] = await db.query(query, [
      req.body.hotel_ID,
      calculateNights[0].nights,
    ]);
    const q =
      "UPDATE reservations SET check_in = ?, check_out  = ?, nights  = ?, people  = ?, room_type = ?, total_price  = ?, user_ID = ?, hotel_ID = ? WHERE reservation_ID = ?";
    const values = [
      req.body.check_in,
      req.body.check_out,
      calculateNights[0].nights,
      req.body.people,
      req.body.room_type,
      calculateTotalPrice[0].total_price,
      user_ID,
      req.body.hotel_ID,
    ];
    if (
      req.body.check_in === "" ||
      req.body.check_out === "" ||
      req.body.people === "" ||
      req.body.room_type === ""
    ) {
      return res.status(400).json({ message: "Fields are required" });
    }
    const [updateReservation] = await db.query(
      "SELECT user_ID, hotel_ID FROM reservations WHERE check_in = ? AND check_out = ? AND room_type = ? AND hotel_ID = ?",
      [
        req.body.check_in,
        req.body.check_out,
        req.body.room_type,
        req.body.hotel_ID,
      ]
    );
    if (updateReservation.length > 0)
      return res.status(400).json({ message: "Reservation already exists" });
    await db.query(q, [...values, id]);
    res.status(200).json({ message: `Reservation ${id} updated` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update Reservation" });
  }
};

export const deleteReservation = async (req, res) => {
  //Elimina una reservacion que coincida con el reservation_ID enviado
  try {
    const id = req.params.reservation_ID;
    const [deleteReservation] = await db.query(
      "DELETE FROM reservations WHERE reservation_ID = ?",
      id
    );
    if (deleteReservation.affectedRows === 0)
      return res.status(400).json({ message: "Reservation doesn´t exists" });
    res.status(200).json({ message: `Reservation ${id} deleted` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to delete Reservation" });
  }
};
