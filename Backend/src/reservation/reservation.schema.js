import { z } from "zod";

export const reservation = z.object({
  check_in: z
    .string({ required_error: "Check In is required" })
    //.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "tiene que ser exactamente a yyyy-mm-dd" })
    .refine(
      (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        const maxDate = new Date("2025-01-01");

        return selectedDate >= today && selectedDate <= maxDate;
      },
      {
        message: "Check In must be from tomorrow until December 31, 2024",
      }
    ),
  check_out: z
    .string({ required_error: "Check Out is required" })
    //.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "tiene que ser exactamente a yyyy-mm-dd" })
    .refine(
      (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        const maxDate = new Date("2025-01-01");

        return selectedDate >= today && selectedDate <= maxDate;
      },
      {
        message: "Check Out must be from tomorrow until December 31, 2024",
      }
    ),
  guests: z
    .number({ required_error: "Guests is required" })
    .positive({ message: "Guests should be positive" })
    .lte(8, { message: "Maximum 8 guests" }),
  room_type: z
    .string({ required_error: "Room Type is required" })
    .min(1, { message: "Room Type is required" }),
});
