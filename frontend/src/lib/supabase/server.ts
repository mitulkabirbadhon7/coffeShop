import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import { env } from "@/lib/env";

export async function createClient() {
  let cookieStore: {
    get: (name: string) => { value: string } | undefined;
    set: (options: { name: string; value: string } & CookieOptions) => void;
  };

  try {
    cookieStore = cookies();
  } catch {
    // Graceful fallback for execution outside active Next.js request scope (e.g. test runner)
    const inMemory = new Map<string, string>();
    cookieStore = {
      get: (name: string) => {
        const val = inMemory.get(name);
        return val !== undefined ? { value: val } : undefined;
      },
      set: ({ name, value }) => {
        inMemory.set(name, value);
      },
    };
  }

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignored if called from Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Ignored if called from Server Component
          }
        },
      },
    }
  );
}
