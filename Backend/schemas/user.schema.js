import { z } from "zod";

export const register = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  first_name: z
    .string({ required_error: "First Name is required" })
    .min(2, { message: "First Name must be at least 2 characters" })
    .max(20, { message: "First Name must be no more than 20 characters" }),
  last_name: z
    .string({ required_error: "Last Name is required" })
    .min(2, { message: "Last Name must be at least 2 characters" })
    .max(20, { message: "Last Name must be no more than 20 characters" }),
  DNI: z
    .string({ required_error: "DNI is required" })
    .min(8, { message: "DNI must be 8 characters" })
    .max(8, { message: "DNI must be 8 characters" }),
  phone: z
    .string({ required_error: "Phone is required" })
    .min(10, { message: "Phone must be at least 10 characters" })
    .max(11, { message: "Phone must be no more than 11 characterss" }),
});

export const login = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});
