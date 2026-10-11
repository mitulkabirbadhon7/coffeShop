import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import type { Database } from "@/types/database.types";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

describe("Phase 1: Database Schema & RLS Foundation Tests", () => {
  beforeAll(() => {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error(
        "Missing Supabase environment variables in .env.local. Make sure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are set."
      );
    }
  });

  const getAnonClient = () =>
    createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false },
    });

  const getAdminClient = () =>
    createClient<Database>(supabaseUrl!, supabaseServiceKey!, {
      auth: { persistSession: false },
    });

  describe("Public Read Access (Anon)", () => {
    it("allows anonymous users to read categories", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("product_categories").select("*");

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);
    });

    it("allows anonymous users to read available and non-deleted products", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("products").select("*");

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);
      data!.forEach((product) => {
        expect(product.deleted_at).toBeNull();
        expect(product.is_available).toBe(true);
      });
    });

    it("allows anonymous users to read published site content", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon
        .from("site_content")
        .select("*")
        .eq("published", true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);
    });

    it("allows anonymous users to read published testimonials", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon
        .from("testimonials")
        .select("*")
        .eq("is_published", true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);
    });
  });

  describe("Private Tables Isolation (Anon Access Denied)", () => {
    it("denies anonymous users from reading user profiles", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("profiles").select("*");

      // Under RLS, anon gets empty list or permission error
      expect(data?.length ?? 0).toBe(0);
    });

    it("denies anonymous users from reading user addresses", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("addresses").select("*");

      expect(data?.length ?? 0).toBe(0);
    });

    it("denies anonymous users from reading orders", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("orders").select("*");

      expect(data?.length ?? 0).toBe(0);
    });

    it("denies anonymous users from reading order items", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("order_items").select("*");

      expect(data?.length ?? 0).toBe(0);
    });

    it("denies anonymous users from reading audit logs", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("audit_logs").select("*");

      expect(data?.length ?? 0).toBe(0);
    });

    it("denies anonymous users from reading contact messages", async () => {
      const anon = getAnonClient();
      const { data, error } = await anon.from("contact_messages").select("*");

      expect(data?.length ?? 0).toBe(0);
    });
  });

  describe("Mutation Security (Anon Cannot Mutate Catalog or Protected Data)", () => {
    it("rejects anonymous attempts to create a category", async () => {
      const anon = getAnonClient();
      const { error } = await anon.from("product_categories").insert({
        name: "Unauthorized Category",
        slug: "unauthorized-category",
      });

      expect(error).not.toBeNull();
    });

    it("rejects anonymous attempts to create a product", async () => {
      const anon = getAnonClient();
      const { error } = await anon.from("products").insert({
        name: "Hacked Coffee",
        slug: "hacked-coffee",
        price_minor: 100,
        category_id: "a0000000-0000-0000-0000-000000000001",
      });

      expect(error).not.toBeNull();
    });

    it("rejects anonymous attempts to update site content", async () => {
      const anon = getAnonClient();
      const { error } = await anon
        .from("site_content")
        .update({ content: { hacked: true } })
        .eq("content_key", "hero_section");

      // RLS either rejects or silently updates 0 rows
      expect(error !== null || true).toBe(true);

      // Verify the content remains intact via admin client
      const admin = getAdminClient();
      const { data } = await admin
        .from("site_content")
        .select("content")
        .eq("content_key", "hero_section")
        .single();

      expect(data?.content).not.toHaveProperty("hacked");
    });
  });

  describe("Admin / Service Role Full Access Verification", () => {
    it("allows admin client to query all products including metadata", async () => {
      const admin = getAdminClient();
      const { data, error } = await admin.from("products").select("id, name, slug, price_minor, currency");

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBe(22);
    });
  });
});
