import { z } from "zod";

export const register = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  first_name: z
    .string({ required_error: "First Name is required" })
    .min(1, { message: "First Name is required" })
    .min(2, { message: "First Name must be at least 2 characters" })
    .max(20, { message: "First Name must be no more than 20 characters" }),
  last_name: z
    .string({ required_error: "Last Name is required" })
    .min(1, { message: "Last Name is required" })
    .min(2, { message: "Last Name must be at least 2 characters" })
    .max(20, { message: "Last Name must be no more than 20 characters" }),
  birthdate: z
    .string({ required_error: "Check In is required" })
    .min(1, { message: "Check In is required" }),
  nacionality: z
    .string({ required_error: "Nacionality is required" })
    .min(1, { message: "Nacionality is required" })
    .min(2, { message: "Nacionality must be at least 2 characters" })
    .max(20, { message: "Nacionality must be no more than 20 characters" }),
  phone: z
    .number({ required_error: "Phone is required" })
    .positive({ message: "Phone should be positive" })
    .gt(1000000000, { message: "Phone must be at least than 10 characters" })
    .lt(99999999999, { message: "Phone must be no more 11 characters" }),
});

export const login = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const update = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email is not valid" }),
  first_name: z
    .string({ required_error: "First Name is required" })
    .min(1, { message: "First Name is required" })
    .min(2, { message: "First Name must be at least 2 characters" })
    .max(20, { message: "First Name must be no more than 20 characters" }),
  last_name: z
    .string({ required_error: "Last Name is required" })
    .min(1, { message: "Last Name is required" })
    .min(2, { message: "Last Name must be at least 2 characters" })
    .max(20, { message: "Last Name must be no more than 20 characters" }),
  birthdate: z
    .string({ required_error: "Check In is required" })
    .min(1, { message: "Check In is required" }),
  nacionality: z
    .string({ required_error: "Nacionality is required" })
    .min(1, { message: "Nacionality is required" })
    .min(2, { message: "Nacionality must be at least 2 characters" })
    .max(20, { message: "Nacionality must be no more than 20 characters" }),
  phone: z
    .number({ required_error: "Phone is required" })
    .positive({ message: "Phone should be positive" })
    .gt(1000000000, { message: "Phone must be at least than 10 characters" })
    .lt(99999999999, { message: "Phone must be no more 11 characters" }),
});
