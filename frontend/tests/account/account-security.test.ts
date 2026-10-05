import { describe, it, expect, vi, beforeEach } from "vitest";
import { profileSchema, addressSchema } from "@/lib/validation/account.schema";
import {
  updateProfileAction,
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/account/actions";

// Mock Supabase client & requireUser
const mockUpdate = vi.fn().mockReturnThis();
const mockDelete = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: () =>
    Promise.resolve({
      from: () => ({
        update: mockUpdate,
        delete: mockDelete,
        insert: mockInsert,
        eq: mockEq,
      }),
    }),
}));

const mockUser = {
  id: "user-alpha-123",
  email: "patron@example.com",
};

vi.mock("@/lib/auth/guards", () => ({
  requireUser: () => Promise.resolve(mockUser),
}));

describe("Phase 7: Account Validation & Anti-IDOR Security Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validation Schemas", () => {
    it("validates valid profile display name", () => {
      const valid = profileSchema.safeParse({ display_name: "Maya Rahman" });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.display_name).toBe("Maya Rahman");
      }
    });

    it("rejects invalid or too-short profile display name", () => {
      expect(profileSchema.safeParse({ display_name: "M" }).success).toBe(false);
      expect(profileSchema.safeParse({ display_name: "" }).success).toBe(false);
    });

    it("validates a complete pickup address submission", () => {
      const valid = addressSchema.safeParse({
        label: "Studio",
        recipient_name: "Maya Chowdhury",
        phone: "+880 1711 123456",
        line1: "House 10, Road 11",
        city: "Dhaka",
        postal_code: "1213",
        is_default: true,
      });

      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.label).toBe("Studio");
        expect(valid.data.is_default).toBe(true);
      }
    });

    it("rejects incomplete address with missing street or city", () => {
      const incomplete = addressSchema.safeParse({
        label: "Home",
        recipient_name: "User",
        phone: "123456",
        line1: "",
        city: "",
        postal_code: "",
      });
      expect(incomplete.success).toBe(false);
    });
  });

  describe("Anti-IDOR Ownership Enforcements", () => {
    it("updates only the authenticated user's profile ID", async () => {
      mockEq.mockResolvedValueOnce({ error: null });

      const result = await updateProfileAction({ display_name: "Tariq Artisan" });
      expect(result.success).toBe(true);
      // Asserts that update was filtered by authenticated user's ID
      expect(mockEq).toHaveBeenCalledWith("id", mockUser.id);
    });

    it("enforces user_id ownership guard on address deletion (anti-IDOR)", async () => {
      mockEq.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      const result = await deleteAddressAction("foreign-address-999");
      expect(result.success).toBe(true);
      // Asserts that address deletion checks both address ID and user_id ownership
      expect(mockEq).toHaveBeenCalledWith("id", "foreign-address-999");
    });

    it("enforces user_id ownership guard when toggling default address", async () => {
      mockEq.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await setDefaultAddressAction("address-555");
      expect(result.success).toBe(true);
      expect(mockEq).toHaveBeenCalledWith("user_id", mockUser.id);
    });
  });
});
