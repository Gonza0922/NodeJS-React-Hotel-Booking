import { Resend } from "resend";
import { db } from "../tables.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (req, res) => {
  //Send Email
  const {
    reservation_ID,
    reservation_date,
    check_in,
    check_out,
    nights,
    guests,
    room_type,
    person_price,
    total_price,
    PIN,
    user_ID,
    hotel_ID,
  } = req.reservation;

  try {
    const [userEmail] = await db.query("SELECT email from users WHERE user_ID = ? ", [user_ID]);
    const [hotelName] = await db.query("SELECT name FROM hotels WHERE hotel_ID = ?", [hotel_ID]);
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [userEmail[0].email],
      subject: "Correctly booked hotel",
      html: `<div>
        <h4>Reservation ID: ${reservation_ID}</h4>
        <h4>Reservation Date: ${reservation_date.toString().substring(0, 24)}</h4>
        <h4>Check In: ${check_in}</h4>
        <h4>Check Out: ${check_out}</h4>
        <h4>Nights: ${nights}</h4>
        <h4>Guests: ${guests}</h4>
        <h4>Room Type: ${room_type}</h4>
        <h4>Person Price: $${person_price}</h4>
        <h4>Total Price: $${total_price}</h4>
        <h4>PIN: ${PIN}</h4>
        <h4>Hotel: ${hotelName[0].name}</h4>
      <div>`,
    });
    if (data.error) return res.status(201).json({ message: "The email wasn´t sent" });
    res.status(201).json({ message: "Reservation and email sent correctly" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to send Email" });
  }
};
