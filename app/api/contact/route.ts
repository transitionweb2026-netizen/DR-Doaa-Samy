import { NextResponse } from "next/server";
import type { ContactFormPayload } from "@/lib/types/content";

/**
 * No email/CRM/Supabase integration is wired up yet, so this validates the
 * submission and logs it server-side rather than silently discarding it —
 * an honest interim step, not a pretend "sent to Dr. Doaa" response. Swap
 * the console.log below for real persistence/notification (a Supabase
 * insert, an email via Resend, etc.) when that's ready to connect.
 */
export async function POST(request: Request) {
  let payload: Partial<ContactFormPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, phone, email, message, service } = payload;

  if (!name?.trim() || !phone?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  // TODO: replace with real persistence/notification once configured.
  console.log("[contact] New submission received:", {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    service: service?.trim() || null,
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
