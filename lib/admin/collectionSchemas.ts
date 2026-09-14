/**
 * Declarative config for every repeatable collection table, driving the
 * generic CollectionEditor (list + add/edit/delete/reorder form) so a new
 * collection only ever needs an entry here — never a bespoke component.
 */

export type ColumnType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "image"
  | "list"
  | "select"
  | "date"
  | "url";

export type CollectionColumn = {
  key: string; // db column, e.g. "title" (paired "ar_title" is implied when translatable)
  label: string;
  type: ColumnType;
  translatable?: boolean;
  options?: { value: string; label: string }[]; // for type "select"
  helpText?: string;
};

export type CollectionSchema = {
  table: string;
  itemType: string; // matches content_placements.item_type, when applicable
  displayName: string;
  titleColumn: string; // which column's EN value to show as the row label in the list
  enabledColumn: "is_enabled" | "is_published";
  usesPlacements: boolean; // false = fetched directly (e.g. treatments by category), not via content_placements
  columns: CollectionColumn[];
  /**
   * When set, each row in the list gets a link to `${manageHrefBase}/${row.id}`
   * (e.g. "manage the treatments inside this category"). A base path string
   * rather than a function — CollectionSchema objects are passed from server
   * components straight into the client CollectionEditor, and a function
   * property there isn't serializable across that boundary.
   */
  manageHrefBase?: string;
  manageLabel?: string;
};

export const STATS_SCHEMA: CollectionSchema = {
  table: "stats",
  itemType: "stats",
  displayName: "Stat",
  titleColumn: "label",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "value", label: "Value", type: "number" },
    { key: "suffix", label: "Suffix (e.g. +, %)", type: "text", translatable: true },
    { key: "label", label: "Label", type: "text", translatable: true },
    {
      key: "emphasis",
      label: "Emphasis",
      type: "select",
      options: [
        { value: "", label: "None" },
        { value: "hero", label: "Hero (larger display)" },
      ],
    },
  ],
};

export const SERVICES_SCHEMA: CollectionSchema = {
  table: "services",
  itemType: "services",
  displayName: "Service",
  titleColumn: "name",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "slug", label: "Slug", type: "text", helpText: "Used in URLs — lowercase, hyphenated." },
    { key: "name", label: "Name", type: "text", translatable: true },
    { key: "short_label", label: "Short label", type: "text", translatable: true },
    { key: "image_id", label: "Image", type: "image" },
    { key: "summary", label: "Summary", type: "textarea", translatable: true },
    { key: "description", label: "Description", type: "richtext", translatable: true },
    { key: "benefits", label: "Benefits", type: "list", translatable: true },
    { key: "suitable_for", label: "Suitable for", type: "list", translatable: true },
    { key: "session_info", label: "Session info", type: "text", translatable: true },
  ],
};

export const TREATMENT_CATEGORIES_SCHEMA: CollectionSchema = {
  table: "treatment_categories",
  itemType: "treatment_categories",
  displayName: "Treatment category",
  titleColumn: "title",
  enabledColumn: "is_enabled",
  usesPlacements: false,
  columns: [
    { key: "key", label: "Anchor key", type: "text", helpText: "e.g. \"hair\" — used for #hair navigation." },
    { key: "title", label: "Title", type: "text", translatable: true },
    { key: "card_label", label: "Card label", type: "text", translatable: true },
    { key: "description", label: "Description", type: "textarea", translatable: true },
    { key: "image_id", label: "Image", type: "image" },
  ],
  manageHrefBase: "/admin/pages/services/treatments",
  manageLabel: "Manage treatments",
};

export const TREATMENTS_SCHEMA: CollectionSchema = {
  table: "treatments",
  itemType: "treatments",
  displayName: "Treatment",
  titleColumn: "name",
  enabledColumn: "is_enabled",
  usesPlacements: false,
  columns: [
    { key: "slug", label: "Slug", type: "text" },
    { key: "name", label: "Name", type: "text", translatable: true },
    { key: "short_description", label: "Short description", type: "textarea", translatable: true },
    { key: "image_id", label: "Image", type: "image" },
    { key: "what_is_it", label: "What is it", type: "richtext", translatable: true },
    { key: "common_concerns", label: "Common concerns", type: "list", translatable: true },
    { key: "approach", label: "Approach", type: "richtext", translatable: true },
    { key: "treatment_options", label: "Treatment options", type: "list", translatable: true },
    { key: "journey", label: "Journey", type: "richtext", translatable: true },
    { key: "notes", label: "Notes", type: "textarea", translatable: true },
    { key: "booking_label", label: "Booking button label", type: "text", translatable: true },
  ],
};

export const CASES_SCHEMA: CollectionSchema = {
  table: "cases",
  itemType: "cases",
  displayName: "Case",
  titleColumn: "title",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "title", label: "Title", type: "text", translatable: true },
    { key: "concern", label: "Concern", type: "text", translatable: true },
    { key: "treatment", label: "Treatment", type: "text", translatable: true },
    { key: "result", label: "Result", type: "text", translatable: true },
    { key: "story", label: "Story", type: "textarea", translatable: true },
    { key: "before_image_id", label: "Before image", type: "image" },
    { key: "after_image_id", label: "After image", type: "image" },
  ],
};

export const WHY_POINTS_SCHEMA: CollectionSchema = {
  table: "why_points",
  itemType: "why_points",
  displayName: "Why-us point",
  titleColumn: "title",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "title", label: "Title", type: "text", translatable: true },
    { key: "description", label: "Description", type: "textarea", translatable: true },
  ],
};

export const JOURNEY_STEPS_SCHEMA: CollectionSchema = {
  table: "journey_steps",
  itemType: "journey_steps",
  displayName: "Journey step",
  titleColumn: "title",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "index_label", label: "Step number (e.g. 01)", type: "text" },
    { key: "title", label: "Title", type: "text", translatable: true },
    { key: "description", label: "Description", type: "textarea", translatable: true },
  ],
};

export const REVIEWS_SCHEMA: CollectionSchema = {
  table: "reviews",
  itemType: "reviews",
  displayName: "Review",
  titleColumn: "name",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "name", label: "Patient name", type: "text", translatable: true },
    { key: "initials", label: "Initials (avatar)", type: "text" },
    {
      key: "rating",
      label: "Rating",
      type: "select",
      options: [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} star${n === 1 ? "" : "s"}` })),
    },
    { key: "quote", label: "Quote", type: "textarea", translatable: true },
    { key: "treatment", label: "Treatment mentioned", type: "text", translatable: true },
  ],
};

export const VIDEOS_SCHEMA: CollectionSchema = {
  table: "videos",
  itemType: "videos",
  displayName: "Video",
  titleColumn: "title",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "title", label: "Title", type: "text", translatable: true },
    { key: "category", label: "Category", type: "text", translatable: true },
    { key: "thumbnail_id", label: "Thumbnail", type: "image" },
    { key: "duration_label", label: "Duration label (e.g. 2:14)", type: "text" },
    { key: "description", label: "Description", type: "textarea", translatable: true },
    { key: "video_url", label: "Video URL", type: "url" },
  ],
};

export const FAQ_SCHEMA: CollectionSchema = {
  table: "faq_items",
  itemType: "faq_items",
  displayName: "FAQ item",
  titleColumn: "question",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    { key: "question", label: "Question", type: "text", translatable: true },
    { key: "answer", label: "Answer", type: "textarea", translatable: true },
  ],
};

export const CREDENTIALS_SCHEMA: CollectionSchema = {
  table: "credentials",
  itemType: "credentials",
  displayName: "Credential",
  titleColumn: "title",
  enabledColumn: "is_enabled",
  usesPlacements: true,
  columns: [
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "Education", label: "Education" },
        { value: "Certification", label: "Certification" },
        { value: "Experience", label: "Experience" },
      ],
    },
    { key: "period", label: "Period (e.g. 2018–2021)", type: "text", translatable: true },
    { key: "title", label: "Title", type: "text", translatable: true },
    { key: "institution", label: "Institution", type: "text", translatable: true },
    { key: "description", label: "Description", type: "textarea", translatable: true },
  ],
};

export const ARTICLES_SCHEMA: CollectionSchema = {
  table: "articles",
  itemType: "articles",
  displayName: "Article",
  titleColumn: "title",
  enabledColumn: "is_published",
  usesPlacements: false,
  columns: [
    { key: "slug", label: "Slug", type: "text" },
    { key: "title", label: "Title", type: "text", translatable: true },
    { key: "excerpt", label: "Excerpt", type: "textarea", translatable: true },
    { key: "content", label: "Body paragraphs", type: "list", translatable: true },
    { key: "image_id", label: "Cover image", type: "image" },
    { key: "category", label: "Category", type: "text", translatable: true },
    { key: "published_date", label: "Published date", type: "date" },
    { key: "reading_time", label: "Reading time (e.g. 5 min read)", type: "text", translatable: true },
    { key: "author", label: "Author", type: "text", translatable: true },
    { key: "is_featured", label: "Featured", type: "boolean" },
  ],
};

export const LEGAL_BLOCKS_SCHEMA: CollectionSchema = {
  table: "legal_page_blocks",
  itemType: "legal_page_blocks",
  displayName: "Section",
  titleColumn: "heading",
  enabledColumn: "is_enabled",
  usesPlacements: false,
  columns: [
    { key: "heading", label: "Heading", type: "text", translatable: true },
    { key: "body", label: "Body", type: "richtext", translatable: true },
  ],
};

export const NAV_ITEMS_SCHEMA: CollectionSchema = {
  table: "nav_items",
  itemType: "nav_items",
  displayName: "Nav item",
  titleColumn: "label",
  enabledColumn: "is_enabled",
  usesPlacements: false,
  columns: [
    { key: "label", label: "Label", type: "text", translatable: true },
    { key: "href", label: "Link (URL or path, e.g. /about)", type: "text" },
  ],
};

export const SOCIAL_LINKS_SCHEMA: CollectionSchema = {
  table: "social_links",
  itemType: "social_links",
  displayName: "Social link",
  titleColumn: "label",
  enabledColumn: "is_enabled",
  usesPlacements: false,
  columns: [
    { key: "label", label: "Label", type: "text" },
    { key: "href", label: "URL", type: "url" },
    {
      key: "icon_key",
      label: "Icon",
      type: "select",
      options: [
        { value: "instagram", label: "Instagram" },
        { value: "facebook", label: "Facebook" },
        { value: "tiktok", label: "TikTok" },
        { value: "youtube", label: "YouTube" },
      ],
    },
  ],
};

export const COLLECTION_SCHEMAS: Record<string, CollectionSchema> = {
  stats: STATS_SCHEMA,
  services: SERVICES_SCHEMA,
  treatment_categories: TREATMENT_CATEGORIES_SCHEMA,
  treatments: TREATMENTS_SCHEMA,
  cases: CASES_SCHEMA,
  why_points: WHY_POINTS_SCHEMA,
  journey_steps: JOURNEY_STEPS_SCHEMA,
  reviews: REVIEWS_SCHEMA,
  videos: VIDEOS_SCHEMA,
  faq_items: FAQ_SCHEMA,
  credentials: CREDENTIALS_SCHEMA,
  articles: ARTICLES_SCHEMA,
  legal_page_blocks: LEGAL_BLOCKS_SCHEMA,
  nav_items: NAV_ITEMS_SCHEMA,
  social_links: SOCIAL_LINKS_SCHEMA,
};

/**
 * Maps a (page slug, section key) to the collection bound there via
 * content_placements — drives which sections show a CollectionEditor
 * beneath their scalar-field form. Sections not listed here are pure
 * scalar-field sections (Hero, Final CTA, etc.).
 */
export const SECTION_COLLECTIONS: Record<string, string> = {
  "home:stats": "stats",
  "home:featured_services": "services",
  "home:cases": "cases",
  "home:why_doctor": "why_points",
  "home:patient_journey": "journey_steps",
  "home:reviews": "reviews",
  "home:featured_videos": "videos",
  "home:faq": "faq_items",
  "about:credentials": "credentials",
  "about:key_areas": "services",
  "about:cases": "cases",
  "services:categories": "treatment_categories",
  "patients-reviews:cases": "cases",
  "patients-reviews:reviews": "reviews",
  "patients-reviews:faq": "faq_items",
  "videos:library": "videos",
  "articles:library": "articles",
  "privacy-policy:blocks": "legal_page_blocks",
  "terms-of-service:blocks": "legal_page_blocks",
  "medical-disclaimer:blocks": "legal_page_blocks",
};
