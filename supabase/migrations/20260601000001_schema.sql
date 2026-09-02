-- ============================================================================
-- Dr. Doaa Samy CMS — core schema
-- ============================================================================
-- Design notes:
--  * Every page-level "singleton" block of copy (Hero, a section's own
--    heading/description, Final CTA, etc.) lives in the generic
--    pages -> sections -> fields -> field_values chain, so adding a brand
--    new page or section later never requires a migration.
--  * Genuinely repeatable domain content (services, cases, reviews, videos,
--    articles, treatments, credentials, FAQ, journey steps, stats, nav,
--    social links) gets its own typed table — proper columns, not a JSON
--    blob — because the admin needs real add/remove/reorder controls and
--    these shapes are used identically across several pages.
--  * `content_placements` is the many-to-many join that says "this exact
--    row from that collection appears in this section of this page, in
--    this order, and is (or isn't) the featured pick" — it's what lets the
--    same 6 `cases` rows power Home's teaser grid, About's 3-up preview,
--    and Patients & Stories' full grid without duplicating a single case.
--  * Bilingual text: every translatable text column has a paired `ar_`
--    column on the same row (simple, fast to query, easy to build an admin
--    editor for — no join required to render either language). Structural
--    columns (images, hrefs, numbers, ratings, ordering, flags) are shared.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- updated_at trigger helper, reused by every table below
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin roster — who is allowed to write CMS content.
-- Bootstrap the first row manually from the Supabase SQL editor (or via the
-- service-role key) after creating your own auth user; RLS deliberately
-- cannot self-bootstrap this table for anyone but existing admins/service role.
-- ---------------------------------------------------------------------------
create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Media library (Supabase Storage-backed)
-- ---------------------------------------------------------------------------
create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  storage_path text not null,
  mime_type text,
  width int,
  height int,
  title text,
  description text,
  alt_text text not null default '',
  ar_alt_text text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

-- ---------------------------------------------------------------------------
-- Site-wide settings (single row — phone/whatsapp/email/address/brand copy)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id boolean primary key default true constraint site_settings_singleton check (id),
  site_name text not null default 'Dr. Doaa Samy',
  ar_site_name text not null default '',
  role_title text not null default 'Dermatologist',
  ar_role_title text not null default '',
  tagline text not null default 'Dermatology & Aesthetic Medicine',
  ar_tagline text not null default '',
  phone_display text not null default '',
  phone_href text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  address text not null default '',
  ar_address text not null default '',
  footer_blurb text not null default '',
  ar_footer_blurb text not null default '',
  copyright_text text not null default '',
  ar_copyright_text text not null default '',
  updated_at timestamptz not null default now()
);
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Pages / Sections / Fields / Field values — the generic scalar-content chain
-- ---------------------------------------------------------------------------
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,           -- e.g. "home", "about", "services"
  name text not null,                  -- admin-facing label, e.g. "Home"
  route text not null,                 -- e.g. "/", "/about"
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger pages_set_updated_at before update on public.pages
  for each row execute function public.set_updated_at();

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  key text not null,                   -- e.g. "hero", "stats", "final_cta"
  name text not null,                  -- admin-facing label, e.g. "Hero"
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, key)
);
create trigger sections_set_updated_at before update on public.sections
  for each row execute function public.set_updated_at();

create table public.fields (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections (id) on delete cascade,
  key text not null,                   -- e.g. "heading", "eyebrow", "primary_cta_href"
  label text not null,                 -- admin-facing label
  field_type text not null check (field_type in
    ('text', 'textarea', 'richtext', 'image', 'url', 'number', 'boolean', 'list')),
  is_translatable boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (section_id, key)
);

create table public.field_values (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references public.fields (id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  value jsonb not null default 'null'::jsonb,
  updated_at timestamptz not null default now(),
  unique (field_id, locale)
);
create trigger field_values_set_updated_at before update on public.field_values
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Navigation & social links
-- ---------------------------------------------------------------------------
create table public.nav_items (
  id uuid primary key default gen_random_uuid(),
  location text not null check (location in ('header', 'footer')),
  label text not null,
  ar_label text not null default '',
  href text not null,
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  icon_key text not null,              -- matches SOCIAL_GLYPHS key: instagram/facebook/tiktok/youtube
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Collections
-- ---------------------------------------------------------------------------
create table public.stats (
  id uuid primary key default gen_random_uuid(),
  value int not null,
  suffix text default '',
  ar_suffix text default '',
  label text not null,
  ar_label text not null default '',
  emphasis text,                       -- 'hero' or null
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  ar_name text not null default '',
  short_label text not null default '',
  ar_short_label text not null default '',
  image_id uuid references public.media (id),
  summary text default '',
  ar_summary text default '',
  description text not null default '',
  ar_description text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  ar_benefits jsonb not null default '[]'::jsonb,
  suitable_for jsonb not null default '[]'::jsonb,
  ar_suitable_for jsonb not null default '[]'::jsonb,
  session_info text default '',
  ar_session_info text default '',
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.treatment_categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,            -- anchor slug, e.g. "hair"
  title text not null,
  ar_title text not null default '',
  card_label text not null default '',
  ar_card_label text not null default '',
  description text not null default '',
  ar_description text not null default '',
  image_id uuid references public.media (id),
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.treatments (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.treatment_categories (id) on delete cascade,
  slug text not null unique,
  name text not null,
  ar_name text not null default '',
  short_description text default '',
  ar_short_description text default '',
  image_id uuid references public.media (id),
  what_is_it text not null default '',
  ar_what_is_it text not null default '',
  common_concerns jsonb not null default '[]'::jsonb,
  ar_common_concerns jsonb not null default '[]'::jsonb,
  approach text not null default '',
  ar_approach text not null default '',
  treatment_options jsonb not null default '[]'::jsonb,
  ar_treatment_options jsonb not null default '[]'::jsonb,
  journey text not null default '',
  ar_journey text not null default '',
  notes text not null default '',
  ar_notes text not null default '',
  booking_label text not null default 'Book an Appointment',
  ar_booking_label text not null default '',
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ar_title text not null default '',
  concern text default '',
  ar_concern text default '',
  treatment text default '',
  ar_treatment text default '',
  result text default '',
  ar_result text default '',
  story text default '',
  ar_story text default '',
  before_image_id uuid references public.media (id),
  after_image_id uuid references public.media (id),
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.why_points (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ar_title text not null default '',
  description text default '',
  ar_description text default '',
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.journey_steps (
  id uuid primary key default gen_random_uuid(),
  index_label text not null,           -- "01", "02", ...
  title text not null,
  ar_title text not null default '',
  description text default '',
  ar_description text default '',
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ar_name text not null default '',
  initials text not null default '',
  rating int not null default 5 check (rating between 1 and 5),
  quote text not null default '',
  ar_quote text not null default '',
  treatment text,
  ar_treatment text,
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ar_title text not null default '',
  category text not null default '',
  ar_category text not null default '',
  thumbnail_id uuid references public.media (id),
  duration_label text,
  description text,
  ar_description text,
  video_url text,
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  ar_question text not null default '',
  answer text not null default '',
  ar_answer text not null default '',
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Education', 'Certification', 'Experience')),
  period text default '',
  ar_period text default '',
  title text not null,
  ar_title text not null default '',
  institution text default '',
  ar_institution text default '',
  description text default '',
  ar_description text default '',
  is_enabled boolean not null default true,
  sort_order int not null default 0
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  ar_title text not null default '',
  excerpt text not null default '',
  ar_excerpt text not null default '',
  content jsonb not null default '[]'::jsonb,      -- array of paragraph strings
  ar_content jsonb not null default '[]'::jsonb,
  image_id uuid references public.media (id),
  category text not null default '',
  ar_category text not null default '',
  published_date date not null default current_date,
  reading_time text default '',
  ar_reading_time text default '',
  author text not null default 'Dr. Doaa Samy',
  ar_author text not null default '',
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger articles_set_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

create table public.legal_page_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  heading text not null,
  ar_heading text not null default '',
  body text not null default '',
  ar_body text not null default '',
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- Content placements — which collection row appears in which page/section,
-- in what order, and whether it's the "featured" pick there.
-- ---------------------------------------------------------------------------
create table public.content_placements (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  section_id uuid not null references public.sections (id) on delete cascade,
  item_type text not null check (item_type in
    ('services', 'treatments', 'cases', 'reviews', 'videos', 'faq_items',
     'credentials', 'why_points', 'journey_steps', 'stats', 'articles')),
  item_id uuid not null,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (section_id, item_type, item_id)
);

-- ---------------------------------------------------------------------------
-- SEO — one row per page per locale
-- ---------------------------------------------------------------------------
create table public.seo_meta (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  locale text not null check (locale in ('en', 'ar')),
  seo_title text,
  meta_description text,
  canonical_url text,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  og_title text,
  og_description text,
  og_image_id uuid references public.media (id),
  twitter_title text,
  twitter_description text,
  twitter_image_id uuid references public.media (id),
  keywords jsonb not null default '[]'::jsonb,
  json_ld jsonb,
  updated_at timestamptz not null default now(),
  unique (page_id, locale)
);
create trigger seo_meta_set_updated_at before update on public.seo_meta
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------------------------
create index on public.sections (page_id);
create index on public.fields (section_id);
create index on public.field_values (field_id);
create index on public.content_placements (page_id, section_id);
create index on public.content_placements (item_type, item_id);
create index on public.treatments (category_id);
create index on public.seo_meta (page_id);
create index on public.articles (slug);
create index on public.articles (is_published, is_featured);
