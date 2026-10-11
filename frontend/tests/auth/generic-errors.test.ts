import { describe, it, expect } from "vitest";
import { signInAction, resetPasswordAction } from "@/lib/auth/actions";

describe("Phase 3: Anti-Enumeration & Generic Error Responses", () => {
  it("returns identical generic error for invalid credentials", async () => {
    // Attempt sign in with fake user
    const result1 = await signInAction({
      email: "nonexistent-user-123@domain.com",
      password: "WrongPassword123!",
    });

    expect(result1.error).toBeDefined();
    expect(result1.error).toBe(
      "Invalid email or password. Please verify your credentials and try again."
    );
  });

  it("returns consistent generic confirmation for password reset", async () => {
    const result = await resetPasswordAction({
      email: "maybe-exists@chocobliss.com",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe(
      "If a registered account matches that email, a password reset link has been dispatched."
    );
  });
});
