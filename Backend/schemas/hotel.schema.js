import { z } from "zod";

export const hotel = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(20, { message: "Name must be no more than 25 characters" }),
  price_per_night: z
    .string({ required_error: "Price per night is required" })
    .min(1, { message: "Price per night is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" }),
  services: z
    .string({ required_error: "Services are required" })
    .min(1, { message: "Services are required" })
    .min(10, { message: "Services must be at least 10 characters" }),
  location: z
    .string({ required_error: "Location is required" })
    .min(1, { message: "Location is required" }),
  phone: z
    .string({ required_error: "Phone is required" })
    .min(1, { message: "Phone is required" })
    .min(10, { message: "Phone must be at least 10 characters" })
    .max(11, { message: "Phone must be no more than 11 characterss" }),
});
