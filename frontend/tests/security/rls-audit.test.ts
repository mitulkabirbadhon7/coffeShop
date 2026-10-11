import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import type { Database } from "@/types/database.types";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

describe("Phase 13: Comprehensive RLS Security Audit", () => {
  beforeAll(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase configuration in .env.local");
    }
  });

  const getAnonClient = () =>
    createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false },
    });

  it("blocks anonymous users from inserting directly into audit_logs", async () => {
    const anon = getAnonClient();
    const { error } = await anon.from("audit_logs").insert({
      actor_id: "00000000-0000-0000-0000-000000000000",
      action: "SECURITY_BREACH_ATTEMPT",
      entity_type: "SYSTEM",
    });

    expect(error).not.toBeNull();
  });

  it("blocks anonymous users from inserting products into the catalog", async () => {
    const anon = getAnonClient();
    const { error: insertError } = await anon.from("products").insert({
      name: "Illicit Roast",
      slug: "illicit-roast",
      category_id: "00000000-0000-0000-0000-000000000000",
      price_minor: 1000,
    });

    expect(insertError).not.toBeNull();
  });

  it("prevents anonymous users from mutating product catalog rows", async () => {
    const anon = getAnonClient();
    const { data } = await anon
      .from("products")
      .update({ price_minor: 100 })
      .neq("id", "00000000-0000-0000-0000-000000000000")
      .select();

    // RLS policy denies update to non-admins, resulting in 0 rows modified
    expect(data?.length ?? 0).toBe(0);
  });

  it("prevents anonymous users from modifying site_content or publishing drafts", async () => {
    const anon = getAnonClient();
    const { data } = await anon
      .from("site_content")
      .update({ published: true, heading: "Hacked Content" })
      .neq("key", "never_match")
      .select();

    expect(data?.length ?? 0).toBe(0);
  });

  it("prevents anonymous users from escalating roles or modifying user profiles", async () => {
    const anon = getAnonClient();
    const { data } = await anon
      .from("profiles")
      .update({ role: "ADMIN" })
      .neq("id", "00000000-0000-0000-0000-000000000000")
      .select();

    expect(data?.length ?? 0).toBe(0);
  });

  it("prevents anonymous users from tampering with order statuses or customer orders", async () => {
    const anon = getAnonClient();
    const { data } = await anon
      .from("orders")
      .update({ status: "COMPLETED" })
      .neq("id", "00000000-0000-0000-0000-000000000000")
      .select();

    expect(data?.length ?? 0).toBe(0);
  });
});
