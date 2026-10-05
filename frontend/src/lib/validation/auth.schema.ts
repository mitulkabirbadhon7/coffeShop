import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address." })
    .max(255, { message: "Email address exceeds maximum length of 255 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(72, { message: "Password exceeds maximum length of 72 characters." }),
});

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name exceeds maximum length of 100 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address." })
    .max(255, { message: "Email address exceeds maximum length of 255 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(72, { message: "Password exceeds maximum length of 72 characters." }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  }),
  marketingAccepted: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address." })
    .max(255, { message: "Email address exceeds maximum length of 255 characters." }),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(72, { message: "Password exceeds maximum length of 72 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
