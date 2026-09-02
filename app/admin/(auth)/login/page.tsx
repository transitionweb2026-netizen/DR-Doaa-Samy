import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signIn } from "@/app/admin/actions";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "That email or password isn't right. Try again.",
  missing_fields: "Enter both your email and password.",
  not_authorized: "That account isn't set up as a CMS admin yet. Ask an existing admin to add you.",
};

export const metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  if (!isSupabaseConfigured) {
    redirect("/admin/setup");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(next && next.startsWith("/admin") ? next : "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f4f2] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl font-medium text-[#3a2420]">Dr. Doaa Samy</p>
          <p className="mt-1 text-sm text-[#8a675e]">Content admin</p>
        </div>

        <form
          action={signIn}
          className="rounded-2xl border border-[#e7ddd8] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(58,36,32,0.18)]"
        >
          <input type="hidden" name="next" value={next ?? "/admin"} />

          {error ? (
            <p className="mb-5 rounded-lg border border-[#f2c9c9] bg-[#fdf1f1] px-3 py-2 text-sm text-[#a3403c]">
              {ERROR_MESSAGES[error] ?? "Something went wrong. Please try again."}
            </p>
          ) : null}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-[#3a2420]">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              autoFocus
              className="w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3.5 py-2.5 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-1.5 block text-sm font-medium text-[#3a2420]">Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3.5 py-2.5 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#d88880] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c9685e]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#ab8f83]">
          For clinic staff only. Contact your site administrator for access.
        </p>
      </div>
    </div>
  );
}
