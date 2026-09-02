import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Service-role client — bypasses RLS entirely. `server-only` guarantees this
 * can never end up in a client bundle. Restricted to the seed script and
 * genuinely trusted server-side tooling; every normal request (including
 * admin dashboard mutations) should go through the RLS-respecting clients
 * in client.ts/server.ts instead, authenticated as the signed-in admin.
 */
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — required for service-role operations (e.g. seeding).");
  }
  return createSupabaseClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
