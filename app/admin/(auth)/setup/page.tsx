export const metadata = { title: "Admin Setup", robots: { index: false, follow: false } };

const STEPS = [
  {
    title: "Create a Supabase project",
    body: "Free tier is fine. Grab the Project URL, anon/public key, and service_role key from Project Settings → API.",
  },
  {
    title: "Set your environment variables",
    body: "Copy .env.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
  },
  {
    title: "Run the migrations",
    body: "From the project root: npx supabase link --project-ref <your-ref>, then npx supabase db push. This creates every table, RLS policy, and the storage bucket.",
  },
  {
    title: "Create your first admin",
    body: "In the Supabase dashboard, go to Authentication → Users → Add user and create yourself an account. Then in the SQL editor, run: insert into public.admin_users (id, email) select id, email from auth.users where email = 'you@example.com';",
  },
  {
    title: "Seed starter content (optional)",
    body: "Run npm run cms:seed to copy all of the site's existing placeholder copy into Supabase, so the CMS starts pre-filled instead of empty.",
  },
  {
    title: "Restart the dev server",
    body: "Once the env vars are set, restart `next dev` and reload this page — you'll land on the sign-in screen instead.",
  },
];

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-[#f7f4f2] px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-serif text-2xl font-medium text-[#3a2420]">Admin CMS setup</p>
        <p className="mt-2 text-sm leading-relaxed text-[#6b4139]">
          The site is running without Supabase connected, so it&rsquo;s showing the built-in placeholder content and the
          admin dashboard is disabled. Connect Supabase to unlock content editing — the site itself keeps working
          normally either way.
        </p>

        <ol className="mt-8 space-y-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-xl border border-[#e7ddd8] bg-white p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d88880]/15 text-sm font-semibold text-[#c9685e]">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#3a2420]">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#6b4139]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
