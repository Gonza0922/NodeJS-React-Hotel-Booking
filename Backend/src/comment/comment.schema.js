import { z } from "zod";

export const PIN = z.object({
  reservation_ID: z
    .number({ required_error: "Enter your reservation number" })
    .positive({ message: "Reservation number should be positive" }),
  PIN: z
    .number({ required_error: "Enter your PIN" })
    .positive({ message: "PIN should be positive" }),
});

export const comment = z.object({
  content: z
    .string({ required_error: "Comment is required" })
    .min(1, { message: "Comment is required" })
    .min(5, { message: "Comment must be at least 5 characters" })
    .max(200, { message: "Comment must be no more than 200 characters" }),
});
