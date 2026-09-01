import type { ContactFormPayload } from "@/lib/types/content";

export async function submitContactRequest(
  payload: ContactFormPayload,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!response.ok || !data.ok) {
      return { ok: false, error: data.error ?? "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — please check your connection and try again." };
  }
}
