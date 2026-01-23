import * as z from "zod";

export const plannerSchema = z.object({
  origin: z.string().min(2, "Startpunkt fehlt"),
  destination: z.string().min(2, "Ziel fehlt"),
  date: z.string().min(1, "Datum fehlt"),
  days: z.coerce.number().min(1).max(30),
  passengers: z.coerce.number().min(1),
  travelClass: z.string(),
});