import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("invalidEmail"),
  password: z.string().min(1, "passwordRequired"),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "nameTooShort"),
  username: z.string().min(3, "usernameTooShort").max(20, "usernameTooLong"),
  email: z.string().email("invalidEmail"),
  password: z.string().min(8, "passwordTooShort"),
  repeatPassword: z.string().min(1, "passwordRequired"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "passwordsDontMatch",
  path: ["repeatPassword"],
});