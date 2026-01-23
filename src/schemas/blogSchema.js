import * as z from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(5, "Titel zu kurz"),
  content: z.string().min(20, "Inhalt zu kurz"),
});