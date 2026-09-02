import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AdminUser = { id: string; email: string; role: "admin" | "editor" };

/**
 * Defense-in-depth beyond proxy.ts's "is anyone signed in" check: this
 * confirms the signed-in user is actually in `admin_users` (RLS enforces
 * the same rule at the database layer regardless — this just gives the
 * dashboard a clean redirect instead of a wall of failed-write errors).
 */
export async function requireAdmin(): Promise<AdminUser> {
  if (!isSupabaseConfigured) {
    redirect("/admin/setup");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    redirect("/admin/login?error=not_authorized");
  }

  return adminRow as AdminUser;
}
