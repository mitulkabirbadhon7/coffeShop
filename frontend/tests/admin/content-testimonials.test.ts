import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sanitizeText,
  sanitizeRichText,
  sanitizeJsonContent,
} from "@/lib/sanitizer";
import {
  siteContentSchema,
  testimonialSchema,
} from "@/lib/validation/content.schema";
import {
  upsertSiteContentAction,
  toggleSiteContentPublishAction,
} from "@/lib/content/admin-content-actions";
import {
  createTestimonialAction,
  updateTestimonialAction,
  toggleTestimonialPublishAction,
  deleteTestimonialAction,
} from "@/lib/testimonials/admin-testimonial-actions";

// Mock dependencies
vi.mock("@/lib/auth/guards", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/audit/log", () => ({
  logAdminAction: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Phase 12: Content & Testimonials Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("XSS Sanitization Engine (Requirement S8)", () => {
    it("strips harmful script tags and inline event handlers from plain text", () => {
      const malicious = '<script>alert("XSS")</script>Welcome to <img src=x onerror=alert(1)> Chocobliss';
      const clean = sanitizeText(malicious);
      expect(clean).toBe("Welcome to  Chocobliss");
      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("onerror");
      expect(clean).not.toContain("alert");
    });

    it("neutralizes javascript: URIs and dangerous tags in rich text", () => {
      const dangerousHtml = '<p>Check out our <a href="javascript:alert(\'hacked\')">Secret Blend</a></p><iframe src="https://evil.com"></iframe>';
      const clean = sanitizeRichText(dangerousHtml);
      expect(clean).not.toContain("javascript:");
      expect(clean).not.toContain("<iframe");
      expect(clean).toContain("Secret Blend");
    });

    it("recursively sanitizes nested JSON content structures", () => {
      const nestedPayload = {
        title: "Fresh Roasts <script>eval(1)</script>",
        features: [
          { name: "Single Origin <b onclick='hack()'>Beans</b>" },
        ],
        meta: {
          tagline: "<img src=x onerror=alert('nested')>Pure Velvet",
        },
      };

      const sanitized = sanitizeJsonContent(nestedPayload) as typeof nestedPayload;
      expect(sanitized.title).not.toContain("<script>");
      expect(sanitized.title).toContain("Fresh Roasts");
      expect(sanitized.features[0].name).not.toContain("onclick");
      expect(sanitized.meta.tagline).not.toContain("onerror");
      expect(sanitized.meta.tagline).toContain("Pure Velvet");
    });

    it("respects maxLength limits gracefully", () => {
      const longText = "A".repeat(200);
      const capped = sanitizeText(longText, 50);
      expect(capped.length).toBe(50);
    });
  });

  describe("Validation Schemas", () => {
    it("validates siteContentSchema with valid keys and blocks invalid characters", () => {
      const valid = siteContentSchema.safeParse({
        content_key: "hero_section_v2",
        content: { title: "Artisanal Coffee", cta: "/products" },
        published: true,
      });
      expect(valid.success).toBe(true);

      // Invalid uppercase or spaces
      const invalidKey = siteContentSchema.safeParse({
        content_key: "Hero Section!",
        content: {},
      });
      expect(invalidKey.success).toBe(false);
    });

    it("validates testimonialSchema and rejects short quotes or invalid sort orders", () => {
      const valid = testimonialSchema.safeParse({
        name: "Amina Begum",
        quote: "The single origin pour-over is simply divine every morning.",
        role_or_context: "Regular Patron",
        sort_order: 1,
        is_published: true,
      });
      expect(valid.success).toBe(true);

      // Quote too short (< 10 chars)
      const shortQuote = testimonialSchema.safeParse({
        name: "Test User",
        quote: "Good!",
      });
      expect(shortQuote.success).toBe(false);

      // Negative sort order
      const negativeOrder = testimonialSchema.safeParse({
        name: "Test User",
        quote: "A perfectly valid long quote here.",
        sort_order: -5,
      });
      expect(negativeOrder.success).toBe(false);
    });
  });

  describe("Admin Content Server Actions", () => {
    it("fails when caller is not an administrator", async () => {
      const { requireAdmin } = await import("@/lib/auth/guards");
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error("Unauthorized: Admin required"));

      const res = await upsertSiteContentAction({
        content_key: "hero_section",
        content: { title: "Test" },
        published: true,
      });

      expect("error" in res).toBe(true);
      if ("error" in res) {
        expect(res.error).toContain("Unauthorized");
      }
    });

    it("successfully upserts content and logs audit trail when authorized", async () => {
      const { requireAdmin } = await import("@/lib/auth/guards");
      const { createClient } = await import("@/lib/supabase/server");
      const { logAdminAction } = await import("@/lib/audit/log");

      vi.mocked(requireAdmin).mockResolvedValueOnce({
        user: { id: "admin-uuid-1", email: "admin@chocobliss.com" } as any,
        profile: { role: "ADMIN" } as any,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: "content-uuid-1" },
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockUpsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ upsert: mockUpsert });

      vi.mocked(createClient).mockResolvedValueOnce({
        from: mockFrom,
      } as any);

      const res = await upsertSiteContentAction({
        content_key: "announcement_bar",
        content: { message: "Holiday Hours: Open 8am-10pm" },
        published: true,
      });

      expect(res).toEqual({
        success: true,
        message: expect.stringContaining("saved successfully"),
        contentKey: "announcement_bar",
      });
      expect(logAdminAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "UPDATE_SITE_CONTENT",
          entityType: "site_content",
          entityId: "content-uuid-1",
          metadata: expect.objectContaining({ content_key: "announcement_bar", published: true }),
        })
      );
    });
  });

  describe("Admin Testimonials Server Actions", () => {
    it("fails to create testimonial when caller is not an administrator", async () => {
      const { requireAdmin } = await import("@/lib/auth/guards");
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error("Unauthorized: Admin required"));

      const res = await createTestimonialAction({
        name: "Guest",
        quote: "A wonderful cup of coffee indeed.",
      });

      expect("error" in res).toBe(true);
      if ("error" in res) {
        expect(res.error).toContain("Unauthorized");
      }
    });

    it("creates a testimonial with sanitized text and logs audit trail", async () => {
      const { requireAdmin } = await import("@/lib/auth/guards");
      const { createClient } = await import("@/lib/supabase/server");
      const { logAdminAction } = await import("@/lib/audit/log");

      vi.mocked(requireAdmin).mockResolvedValueOnce({
        user: { id: "admin-uuid-1", email: "admin@chocobliss.com" } as any,
        profile: { role: "ADMIN" } as any,
      });

      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: "testi-uuid-99" },
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(createClient).mockResolvedValueOnce({
        from: mockFrom,
      } as any);

      const res = await createTestimonialAction({
        name: "Safwan Chowdhury <script>alert(1)</script>",
        quote: "Exquisite Ethiopian brew with notes of floral jasmine.",
        role_or_context: "Coffee Critic",
        sort_order: 1,
        is_published: true,
      });

      expect(res).toEqual({
        success: true,
        message: expect.stringContaining("created successfully"),
        testimonialId: "testi-uuid-99",
      });

      // Verify the insert was called with sanitized name
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Safwan Chowdhury", // <script> tag was stripped!
          is_published: true,
        })
      );

      expect(logAdminAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "CREATE_TESTIMONIAL",
          entityType: "testimonials",
          entityId: "testi-uuid-99",
          metadata: expect.objectContaining({ name: "Safwan Chowdhury" }),
        })
      );
    });

    it("deletes a testimonial and records an audit log", async () => {
      const { requireAdmin } = await import("@/lib/auth/guards");
      const { createClient } = await import("@/lib/supabase/server");
      const { logAdminAction } = await import("@/lib/audit/log");

      vi.mocked(requireAdmin).mockResolvedValueOnce({
        user: { id: "admin-uuid-1", email: "admin@chocobliss.com" } as any,
        profile: { role: "ADMIN" } as any,
      });

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(createClient).mockResolvedValueOnce({
        from: mockFrom,
      } as any);

      const res = await deleteTestimonialAction("testi-uuid-99");
      expect(res).toEqual({
        success: true,
        message: expect.stringContaining("deleted successfully"),
        testimonialId: "testi-uuid-99",
      });

      expect(logAdminAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "DELETE_TESTIMONIAL",
          entityType: "testimonials",
          entityId: "testi-uuid-99",
          metadata: expect.objectContaining({ actor_email: "admin@chocobliss.com" }),
        })
      );
    });
  });
});
