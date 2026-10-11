import { describe, it, expect, vi, beforeEach } from "vitest";
import { contactSchema } from "@/lib/validation/contact.schema";
import { sendContactMessageAction } from "@/lib/contact/actions";

// Mock Supabase client
const mockInsert = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: (table: string) => ({
      insert: (data: unknown) => {
        if (table === "contact_messages") {
          return mockInsert(data);
        }
        return Promise.resolve({ error: null });
      },
    }),
  }),
}));

describe("Phase 6: Contact Schema & Server Action Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("contactSchema Validation", () => {
    it("validates a well-formed contact submission", () => {
      const result = contactSchema.safeParse({
        name: "Maya Chowdhury",
        email: "maya@example.com",
        subject: "Private Tasting Reservation",
        message: "We would like to reserve a private cupping session for 4 people this Saturday.",
        hp_field: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Maya Chowdhury");
        expect(result.data.email).toBe("maya@example.com");
      }
    });

    it("rejects when required fields are missing or too short", () => {
      // Short name (<2 chars)
      expect(
        contactSchema.safeParse({
          name: "M",
          email: "valid@example.com",
          subject: "Inquiry",
          message: "A sufficiently long message here.",
        }).success
      ).toBe(false);

      // Invalid email
      expect(
        contactSchema.safeParse({
          name: "Valid Name",
          email: "not-an-email",
          subject: "Inquiry",
          message: "A sufficiently long message here.",
        }).success
      ).toBe(false);

      // Short message (<10 chars)
      expect(
        contactSchema.safeParse({
          name: "Valid Name",
          email: "valid@example.com",
          subject: "Inquiry",
          message: "Too short",
        }).success
      ).toBe(false);
    });

    it("rejects spam bot submissions when honeypot field is filled", () => {
      const result = contactSchema.safeParse({
        name: "Spam Bot",
        email: "spambot@spammer.com",
        subject: "Buy links",
        message: "Spam message promoting unsolicited products",
        hp_field: "i-am-a-bot-payload",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("sendContactMessageAction", () => {
    it("successfully inserts a valid message into contact_messages with UNREAD status", async () => {
      mockInsert.mockResolvedValueOnce({ error: null });

      const result = await sendContactMessageAction({
        name: "Tanvir Ahmed",
        email: "tanvir@example.com",
        subject: "Whole Bean Retail Inquiry",
        message: "Do you have fresh batches of Colombian Huila in 1kg whole bean bags?",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Your message has been received");
      expect(mockInsert).toHaveBeenCalledWith({
        name: "Tanvir Ahmed",
        email: "tanvir@example.com",
        subject: "Whole Bean Retail Inquiry",
        message: "Do you have fresh batches of Colombian Huila in 1kg whole bean bags?",
        status: "UNREAD",
      });
    });

    it("silently traps bot submissions without inserting into database", async () => {
      const result = await sendContactMessageAction({
        name: "Crawler Bot",
        email: "crawler@spam.com",
        subject: "SEO Services",
        message: "Offer SEO optimization for your website immediately",
        hp_field: "bot-detected",
      });

      // Zod rejects or honeypot intercepts
      expect(result.success).toBe(false);
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("handles database insertion errors gracefully", async () => {
      mockInsert.mockResolvedValueOnce({
        error: { message: "Database connection timed out" },
      });

      const result = await sendContactMessageAction({
        name: "Sarah Rahman",
        email: "sarah@example.com",
        subject: "Event Catering",
        message: "Inquiring about coffee bar catering for our corporate summit next month.",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Unable to deliver your message");
    });
  });
});
