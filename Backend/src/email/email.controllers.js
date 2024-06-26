import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (req, res) => {
  //Send Email
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "example123@gmail.com",
      subject: "Title",
      html: "<strong>message</strong>",
    });
    if (data.error) return res.status(400).json({ error: data.error });
    res.status(200).json({ message: "email sent correctly" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to send Email" });
  }
};
