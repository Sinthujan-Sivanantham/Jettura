import * as z from "zod";

export const registerSchema = z.object({
    fullName: z.string({ required_error: "nameTooShort" }).min(3, "nameTooShort"),
    username: z.string({ required_error: "usernameTooShort" }).min(3, "usernameTooShort").max(20, "usernameTooLong"),
    email: z.string({ required_error: "invalidEmail" }).email("invalidEmail"),
    password: z.string({ required_error: "passwordTooShort" }).min(8, "passwordTooShort"),
    repeatPassword: z.string({ required_error: "passwordRequired" }).min(1, "passwordRequired"),
}).refine((data) => data.password === data.repeatPassword, {
    message: "passwordsDontMatch",
    path: ["repeatPassword"],
});

export const loginSchema = z.object({
    email: z.string({ required_error: "invalidEmail" }).email("invalidEmail"),
    password: z.string({ required_error: "passwordRequired" }).min(1, "passwordRequired"),
});
