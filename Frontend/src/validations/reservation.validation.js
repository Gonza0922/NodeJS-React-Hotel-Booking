import * as yup from "yup";

export const reservationSchema = yup.object().shape({
  check_in: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("Check In is required")
    .min(new Date(), "You can only book from tomorrow onwards")
    .max(new Date("2026-01-01"), "You cannot book on this date"),

  check_out: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("Check Out is required")
    .min(new Date(), "You can only book from tomorrow onwards")
    .max(new Date("2026-01-01"), "You cannot book on this date"),
});
