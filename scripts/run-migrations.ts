/**
 * Applies every SQL file in supabase/migrations/, in order, directly against
 * the project's Postgres database — a stand-in for `supabase db push` for
 * this environment, where the CLI's own auth (`supabase login`, which needs
 * a browser) isn't available. Connects with the DB password only (never
 * committed).
 *
 * This sandbox has no outbound IPv6, and Supabase's direct `db.<ref>.supabase.co`
 * host is IPv6-only, so this needs the IPv4-compatible connection pooler
 * host instead (Dashboard → Project Settings → Database → Connection
 * pooling). Pass it as a full connection string via DATABASE_URL, or fall
 * back to PGPASSWORD + the direct host for environments that do have IPv6.
 *
 * Usage: DATABASE_URL=postgresql://... tsx scripts/run-migrations.ts
 *    or: PGPASSWORD=... tsx scripts/run-migrations.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

const PROJECT_REF = "fdcysnxwitxjhxuypowq";
const password = process.env.PGPASSWORD;
// Discrete host/user/port avoid ever having to URL-encode a password with
// special characters into a connection string.
const host = process.env.PGHOST ?? `db.${PROJECT_REF}.supabase.co`;
const port = Number(process.env.PGPORT ?? 5432);
const user = process.env.PGUSER ?? "postgres";

if (!password) {
  console.error("Set PGPASSWORD (and, for the pooler, PGHOST/PGUSER/PGPORT) before running this script.");
  process.exit(1);
}

const migrationsDir = join(__dirname, "..", "supabase", "migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

async function main() {
  const client = new Client({
    host,
    port,
    user,
    password,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  console.log(`Connecting to ${host}:${port} as ${user}...`);
  await client.connect();
  console.log("Connected.\n");

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`Applying ${file} ... `);
    try {
      await client.query(sql);
      console.log("done");
    } catch (err) {
      console.log("FAILED");
      throw err;
    }
  }

  await client.end();
  console.log("\nAll migrations applied.");
}

main().catch((err) => {
  console.error("\nMigration failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
