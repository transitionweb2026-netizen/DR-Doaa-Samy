/**
 * Whether a real Supabase project is configured. Every data-fetching helper
 * in `lib/cms/*` checks this first and falls back to the local `data/*.ts`
 * modules when it's false — so the site renders identically whether or not
 * Supabase has been connected yet.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
