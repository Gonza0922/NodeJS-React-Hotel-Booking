import { z } from "zod";

export const hotel = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(20, { message: "Name must be no more than 25 characters" }),
  price_per_night: z
    .number({ required_error: "Price per night is required" })
    .positive({ message: "Price per night should be positive" }),
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
    .number({ required_error: "Phone is required" })
    .positive({ message: "Phone should be positive" })
    .gt(1000000000, { message: "Phone must be at least than 10 characters" })
    .lt(99999999999, { message: "Phone must be no more 11 characters" }),
});
