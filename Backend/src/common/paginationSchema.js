import { z } from "zod";

export const pagination = z.object({
  limit: z
    .number({ message: "Limit should be a number" })
    .positive({ message: "Limit should be positive" }),
  page: z
    .number({ message: "Page should be a number" })
    .positive({ message: "Page should be positive" }),
});
