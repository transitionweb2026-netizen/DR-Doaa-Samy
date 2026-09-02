import { createClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("id, bucket, storage_path, mime_type, title, description, alt_text, ar_alt_text, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-[#3a2420]">Media Library</h1>
      <p className="mt-1 text-sm text-[#6b4139]">
        Upload once, use anywhere — pick from here whenever a section asks for an image.
      </p>
      <div className="mt-6">
        <MediaLibrary initialItems={data ?? []} />
      </div>
    </div>
  );
}
