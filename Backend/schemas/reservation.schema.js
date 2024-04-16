import { z } from "zod";

export const reservation = z.object({
  check_in: z.string({ required_error: "Check In is required" }),
  check_out: z.string({ required_error: "Check Out is required" }),
  people: z
    .string({ required_error: "People is required" })
    .min(1, { message: "Minimun 1 people" })
    .max(10, { message: "Maximum 10 people" }),
  room_type: z.string({ required_error: "Room Type is required" }),
});
