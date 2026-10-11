import { describe, it, expect, vi, beforeEach } from "vitest";
import { newsletterSchema } from "@/lib/validation/newsletter.schema";
import { subscribeNewsletterAction } from "@/lib/newsletter/actions";

// Mock Supabase client
const mockInsert = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}));

describe("Phase 4: Newsletter Validation & Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("newsletterSchema", () => {
    it("accepts a valid standard email address", () => {
      const result = newsletterSchema.safeParse({ email: "guest@example.com" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("guest@example.com");
      }
    });

    it("rejects invalid or empty email addresses", () => {
      const emptyResult = newsletterSchema.safeParse({ email: "" });
      expect(emptyResult.success).toBe(false);

      const invalidResult = newsletterSchema.safeParse({ email: "not-an-email" });
      expect(invalidResult.success).toBe(false);
    });

    it("rejects when honeypot field is filled with characters (bot attack)", () => {
      const result = newsletterSchema.safeParse({
        email: "bot@spammer.com",
        hp_field: "i-am-a-spambot",
      });
      expect(result.success).toBe(false);
    });

    it("accepts when honeypot field is empty", () => {
      const result = newsletterSchema.safeParse({
        email: "human@example.com",
        hp_field: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("subscribeNewsletterAction", () => {
    it("successfully subscribes a new valid subscriber", async () => {
      mockInsert.mockResolvedValueOnce({ error: null });

      const result = await subscribeNewsletterAction({
        email: "patron@chocobliss.coffee",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Welcome to the Chocobliss Roaster Dispatch");
      expect(mockInsert).toHaveBeenCalledWith({ email: "patron@chocobliss.coffee" });
    });

    it("handles duplicate subscriptions gracefully (Postgres code 23505)", async () => {
      mockInsert.mockResolvedValueOnce({
        error: { code: "23505", message: "unique violation" },
      });

      const result = await subscribeNewsletterAction({
        email: "existing@chocobliss.coffee",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("already subscribed");
    });

    it("silently traps bot submissions without inserting into database", async () => {
      const result = await subscribeNewsletterAction({
        email: "bot@domain.com",
        hp_field: "spam-payload",
      });

      // Zod fails or honeypot intercepts
      expect(result.success).toBe(false);
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });
});
