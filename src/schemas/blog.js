import * as z from "zod";

export const getBlogPostSchema = (t) => z.object({
    title: z.string().min(5, "Title too short"),
    location: z.string().optional(),
    content: z.string().min(20, "Story too short"),
});
