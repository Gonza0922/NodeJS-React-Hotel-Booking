import * as yup from "yup";

export const profileSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$/, "Invalid Email"),
  first_name: yup
    .string()
    .required("First Name is required")
    .min(2, "First Name must be at least 2 characters")
    .max(20, "First Name must be no more than 20 characters"),
  last_name: yup
    .string()
    .required("Last Name is required")
    .min(2, "Last Name must be at least 2 characters")
    .max(20, "Last Name must be no more than 20 characters"),
  birthdate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("Birthdate is required")
    .max(new Date("2007-01-01"), "Invalid Date, you must be +18"),
  nacionality: yup
    .string()
    .required("Nacionality is required")
    .min(2, "Nacionality must be at least 2 characters")
    .max(20, "Nacionality must be no more than 20 characters"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Phone must be at least 10 characters")
    .max(11, "Phone must be no more than 11 characters"),
});
