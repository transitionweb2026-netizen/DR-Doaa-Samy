import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { SITE } from "@/lib/constants/site";

const LEGACY_HOSTNAME = "dr-doaa-samy.vercel.app";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];
  if (host === LEGACY_HOSTNAME) {
    const target = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, SITE.url);
    return NextResponse.redirect(target, 308);
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every request except static assets — cheap, and needed so the
     * auth cookie stays fresh across the whole site, not just /admin.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
