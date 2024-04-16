import { z } from "zod";

export const reservation = z.object({
  check_in: z
    .string({ required_error: "Check In is required" })
    .min(1, { message: "Check In is required" }),
  check_out: z
    .string({ required_error: "Check Out is required" })
    .min(1, { message: "Check Out is required" }),
  guests: z
    .number({ required_error: "guests is required" })
    .positive({ message: "Guests should be positive" })
    .lte(8, { message: "Maximum 8 guests" }),
  room_type: z
    .string({ required_error: "Room Type is required" })
    .min(1, { message: "Room Type is required" }),
});
