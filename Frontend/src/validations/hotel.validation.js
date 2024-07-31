import * as yup from "yup";

export const createHotelSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name must be no more than 25 characters"),
  price_per_night: yup.string().required("Price Per Night is required"),
  location: yup
    .string()
    .required("Location is required")
    .min(5, "Location must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  services: yup
    .string()
    .required("Services are required")
    .min(10, "Services must be at least 10 characters"),
  phone: yup
    .string()
    .required("Number is required")
    .min(10, "Number must be at least 10 characters")
    .max(11, "Number must be no more than 11 characters"),
});

export const updateHotelSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name must be no more than 25 characters"),
  price_per_night: yup.string().required("Price Per Night is required"),
  location: yup
    .string()
    .required("Location is required")
    .min(5, "Location must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  services: yup
    .string()
    .required("Services are required")
    .min(10, "Services must be at least 10 characters"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Phone must be at least 10 characters")
    .max(11, "Phone must be no more than 11 characters"),
});
