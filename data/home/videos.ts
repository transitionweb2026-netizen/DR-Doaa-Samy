import { videoCatalogue } from "@/data/videos/catalogue";

// Home's teaser shows the first three of the full catalogue — one source
// of truth, no content duplication between pages.
export const featuredVideos = videoCatalogue.slice(0, 3);
