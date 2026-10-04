import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "@/lib/validation/auth.schema";

describe("Phase 3: Authentication Schemas Security Tests", () => {
  describe("loginSchema", () => {
    it("accepts valid email and password >= 10 chars", () => {
      const result = loginSchema.safeParse({
        email: "connoisseur@chocobliss.com",
        password: "SecretCoffee123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects password shorter than 10 characters", () => {
      const result = loginSchema.safeParse({
        email: "user@domain.com",
        password: "Short1!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("at least 10 characters");
      }
    });

    it("rejects password longer than 72 characters", () => {
      const result = loginSchema.safeParse({
        email: "user@domain.com",
        password: "a".repeat(73),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("maximum length of 72 characters");
      }
    });

    it("rejects invalid email addresses", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email-address",
        password: "SecretCoffee123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("valid email");
      }
    });
  });

  describe("signupSchema", () => {
    it("accepts valid registration with name, email, and complex password", () => {
      const result = signupSchema.safeParse({
        name: "Nusrat Jahan",
        email: "nusrat@chocobliss.com",
        password: "ArtisanalRoast2026",
      });
      expect(result.success).toBe(true);
    });

    it("requires at least one uppercase letter in password", () => {
      const result = signupSchema.safeParse({
        name: "Nusrat Jahan",
        email: "nusrat@chocobliss.com",
        password: "lowercasepassword123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("uppercase letter");
      }
    });

    it("requires at least one number in password", () => {
      const result = signupSchema.safeParse({
        name: "Nusrat Jahan",
        email: "nusrat@chocobliss.com",
        password: "NoNumbersInThisPassword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("at least one number");
      }
    });

    it("rejects name shorter than 2 characters", () => {
      const result = signupSchema.safeParse({
        name: "A",
        email: "valid@domain.com",
        password: "ValidPassword123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("at least 2 characters");
      }
    });
  });

  describe("updatePasswordSchema", () => {
    it("accepts matching complex passwords", () => {
      const result = updatePasswordSchema.safeParse({
        password: "NewSecretRoast2026",
        confirmPassword: "NewSecretRoast2026",
      });
      expect(result.success).toBe(true);
    });

    it("rejects non-matching confirmation password", () => {
      const result = updatePasswordSchema.safeParse({
        password: "NewSecretRoast2026",
        confirmPassword: "DifferentSecretRoast2026",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain("Passwords do not match");
      }
    });
  });
});
