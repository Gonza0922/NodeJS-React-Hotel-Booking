import { z } from "zod";

export const reservation = z.object({
  check_in: z
    .string({ required_error: "Check In is required" })
    .min(1, { message: "Check In is required" }),
  check_out: z
    .string({ required_error: "Check Out is required" })
    .min(1, { message: "Check Out is required" }),
  people: z
    .number({ required_error: "People is required" })
    .int({ message: "Number should be integer" })
    .positive({ message: "Number should be positive" })
    .gte(1, { message: "Minimun 1 people" })
    .lte(8, { message: "Maximum 10 people" }),
  room_type: z
    .string({ required_error: "Room Type is required" })
    .min(1, { message: "Room Type is required" }),
});
