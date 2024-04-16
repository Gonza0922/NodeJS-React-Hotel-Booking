import * as yup from "yup";

export const reservationSchema = yup.object().shape({
  check_in: yup
    .date()
    .required("Check In is required")
    .min(new Date(), "You can only book from tomorrow onwards")
    .max(new Date("2025-01-01"), "You cannot book on this date"),
  check_out: yup
    .date()
    .required("Check Out is required")
    .min(new Date(), "You can only book from tomorrow onwards")
    .max(new Date("2025-01-01"), "You cannot book on this date"),
  guests: yup
    .number()
    .required("Guests is required")
    .max(10, "Guests should not be more than 10"),
  room_type: yup.string().required("Room Type is required"),
});
