-- ============================================================================
-- Row Level Security — public can read published content only; writes
-- (insert/update/delete) require the caller to be in admin_users.
-- `is_admin()` is SECURITY DEFINER (see 20260601000001_schema.sql), so it
-- can read admin_users regardless of the caller's own RLS grants.
-- ============================================================================

alter table public.admin_users enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.sections enable row level security;
alter table public.fields enable row level security;
alter table public.field_values enable row level security;
alter table public.nav_items enable row level security;
alter table public.social_links enable row level security;
alter table public.stats enable row level security;
alter table public.services enable row level security;
alter table public.treatment_categories enable row level security;
alter table public.treatments enable row level security;
alter table public.cases enable row level security;
alter table public.why_points enable row level security;
alter table public.journey_steps enable row level security;
alter table public.reviews enable row level security;
alter table public.videos enable row level security;
alter table public.faq_items enable row level security;
alter table public.credentials enable row level security;
alter table public.articles enable row level security;
alter table public.legal_page_blocks enable row level security;
alter table public.content_placements enable row level security;
alter table public.seo_meta enable row level security;

-- admin_users: only admins can see/manage the roster itself.
create policy "admin_users: admins can read" on public.admin_users
  for select using (public.is_admin());
create policy "admin_users: admins can manage" on public.admin_users
  for all using (public.is_admin()) with check (public.is_admin());

-- media: public read (it's just marketing assets), admin write.
create policy "media: public read" on public.media
  for select using (true);
create policy "media: admins write" on public.media
  for all using (public.is_admin()) with check (public.is_admin());

-- site_settings: public read, admin write.
create policy "site_settings: public read" on public.site_settings
  for select using (true);
create policy "site_settings: admins write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- pages: public read of published pages; admins see/manage everything.
create policy "pages: public read published" on public.pages
  for select using (is_published or public.is_admin());
create policy "pages: admins write" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

-- sections: public read of enabled sections belonging to a published page.
create policy "sections: public read enabled" on public.sections
  for select using (
    public.is_admin()
    or (is_enabled and exists (
      select 1 from public.pages p where p.id = sections.page_id and p.is_published
    ))
  );
create policy "sections: admins write" on public.sections
  for all using (public.is_admin()) with check (public.is_admin());

-- fields: structural metadata, readable alongside its section.
create policy "fields: public read" on public.fields
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.sections s
      join public.pages p on p.id = s.page_id
      where s.id = fields.section_id and s.is_enabled and p.is_published
    )
  );
create policy "fields: admins write" on public.fields
  for all using (public.is_admin()) with check (public.is_admin());

-- field_values: same visibility as their field.
create policy "field_values: public read" on public.field_values
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.fields f
      join public.sections s on s.id = f.section_id
      join public.pages p on p.id = s.page_id
      where f.id = field_values.field_id and s.is_enabled and p.is_published
    )
  );
create policy "field_values: admins write" on public.field_values
  for all using (public.is_admin()) with check (public.is_admin());

-- Generic pattern for every collection table below: public reads enabled
-- rows, admins can read/write everything.
create policy "nav_items: public read enabled" on public.nav_items
  for select using (is_enabled or public.is_admin());
create policy "nav_items: admins write" on public.nav_items
  for all using (public.is_admin()) with check (public.is_admin());

create policy "social_links: public read enabled" on public.social_links
  for select using (is_enabled or public.is_admin());
create policy "social_links: admins write" on public.social_links
  for all using (public.is_admin()) with check (public.is_admin());

create policy "stats: public read enabled" on public.stats
  for select using (is_enabled or public.is_admin());
create policy "stats: admins write" on public.stats
  for all using (public.is_admin()) with check (public.is_admin());

create policy "services: public read enabled" on public.services
  for select using (is_enabled or public.is_admin());
create policy "services: admins write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "treatment_categories: public read enabled" on public.treatment_categories
  for select using (is_enabled or public.is_admin());
create policy "treatment_categories: admins write" on public.treatment_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "treatments: public read enabled" on public.treatments
  for select using (is_enabled or public.is_admin());
create policy "treatments: admins write" on public.treatments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "cases: public read enabled" on public.cases
  for select using (is_enabled or public.is_admin());
create policy "cases: admins write" on public.cases
  for all using (public.is_admin()) with check (public.is_admin());

create policy "why_points: public read enabled" on public.why_points
  for select using (is_enabled or public.is_admin());
create policy "why_points: admins write" on public.why_points
  for all using (public.is_admin()) with check (public.is_admin());

create policy "journey_steps: public read enabled" on public.journey_steps
  for select using (is_enabled or public.is_admin());
create policy "journey_steps: admins write" on public.journey_steps
  for all using (public.is_admin()) with check (public.is_admin());

create policy "reviews: public read enabled" on public.reviews
  for select using (is_enabled or public.is_admin());
create policy "reviews: admins write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

create policy "videos: public read enabled" on public.videos
  for select using (is_enabled or public.is_admin());
create policy "videos: admins write" on public.videos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "faq_items: public read enabled" on public.faq_items
  for select using (is_enabled or public.is_admin());
create policy "faq_items: admins write" on public.faq_items
  for all using (public.is_admin()) with check (public.is_admin());

create policy "credentials: public read enabled" on public.credentials
  for select using (is_enabled or public.is_admin());
create policy "credentials: admins write" on public.credentials
  for all using (public.is_admin()) with check (public.is_admin());

create policy "articles: public read published" on public.articles
  for select using (is_published or public.is_admin());
create policy "articles: admins write" on public.articles
  for all using (public.is_admin()) with check (public.is_admin());

create policy "legal_page_blocks: public read" on public.legal_page_blocks
  for select using (
    public.is_admin()
    or exists (select 1 from public.pages p where p.id = legal_page_blocks.page_id and p.is_published)
  );
create policy "legal_page_blocks: admins write" on public.legal_page_blocks
  for all using (public.is_admin()) with check (public.is_admin());

create policy "content_placements: public read" on public.content_placements
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.sections s join public.pages p on p.id = s.page_id
      where s.id = content_placements.section_id and s.is_enabled and p.is_published
    )
  );
create policy "content_placements: admins write" on public.content_placements
  for all using (public.is_admin()) with check (public.is_admin());

create policy "seo_meta: public read" on public.seo_meta
  for select using (
    public.is_admin()
    or exists (select 1 from public.pages p where p.id = seo_meta.page_id and p.is_published)
  );
create policy "seo_meta: admins write" on public.seo_meta
  for all using (public.is_admin()) with check (public.is_admin());
