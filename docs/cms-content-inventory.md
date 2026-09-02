# CMS Content Inventory — Dr. Doaa Samy Website

Complete audit of every user-facing element on the site, used to derive the
Supabase schema and as the final completeness checklist. Legend: **F** =
scalar field (`fields`/`field_values`), **C** = collection row
(dedicated table), **M** = media reference.

## Global / site-wide

| Item | Type | Notes |
|---|---|---|
| Site name, role, tagline | F | `site_settings` |
| Phone display + `tel:` href | F | `site_settings` |
| WhatsApp number | F | `site_settings` |
| Email | F | `site_settings` |
| Address | F | `site_settings`, bilingual |
| Social links (Instagram/Facebook/TikTok/YouTube) | C | `social_links` |
| Header nav items (label + href, ordered) | C | `nav_items` (location=header) |
| Header logo glyph + name + role | F | reuses site_settings |
| Header "Book Appointment" button | F | label + href |
| Footer brand blurb | F | |
| Footer nav items | C | `nav_items` (location=footer) |
| Footer contact block | F | reuses site_settings |
| Footer copyright line | F | |
| Floating WhatsApp/Phone buttons | F | reuse site_settings, no separate content |
| Language switcher | — | UI-only, no content |

## Shared components (used across multiple pages)

| Component | Fields |
|---|---|
| **HeroSection** (per-page instance) | eyebrow, name, role, headline, description, primaryCta{label,href}, secondaryCta{label,href}, portrait{image,alt} |
| **HeroContactPanel** | reuses site_settings (phone/whatsapp/social) — no page content |
| **FinalCTASection** (per-page instance) | eyebrow, heading, description, whatsappLabel, contactLabel |
| **ServiceModal / TreatmentModal / CaseModal / VideoModal** | content comes from the owning collection row |

## 1. Home (`/`)

| Section | Fields / Collection |
|---|---|
| Hero | HeroContent (see above) |
| Stats | `stats` collection: value, suffix, label, emphasis — 4 rows |
| Doctor Intro | eyebrow, heading, paragraphs[], highlights[], video{image,durationLabel} |
| Featured Services | heading block (eyebrow/heading/description) + `services` collection (name, shortLabel, image, summary, description, benefits[], suitableFor[], sessionInfo) — 5 rows flagged `featured_on_home` |
| Cases | heading block + `cases` collection (title, concern, treatment, result, story, before image, after image) — 6 rows |
| Why Doctor | heading + `why_points` collection (title, description) — 5 rows + portrait image |
| Patient Journey | heading + `journey_steps` collection (index, title, description) — 5 rows |
| Reviews | heading + `reviews` collection (name, initials, rating, quote, treatment) — 6 rows |
| Featured Videos | heading + `videos` collection (title, category, thumbnail, durationLabel, description, videoUrl) — 3 flagged `featured_on_home` |
| FAQ | heading + `faq_items` collection (question, answer) — page-scoped |
| Final CTA | FinalCtaContent |

## 2. About (`/about`)

| Section | Fields |
|---|---|
| Hero | HeroContent (shared component, About-specific row) |
| Intro Video | eyebrow, heading, video{image,durationLabel} |
| Doctor Message | eyebrow, quote, paragraphs[], signatureName, signatureTitle |
| Experience & Certifications | heading + `credentials` collection (category, period, title, institution, description) |
| Key Areas | heading + `services` collection filtered to About page (8 rows, distinct from Home's 5) |
| Featured Cases | heading + `cases` collection scoped to About (3 rows) |
| Final CTA | FinalCtaContent (About-specific row) |

## 3. Services (`/services`)

| Section | Fields |
|---|---|
| Hero | shared with Home (same row, reused verbatim per the brief) |
| Category Selector | heading block + reads `treatment_categories` (title, cardLabel, description, image) — 5 rows |
| Treatment Category chapters (×5: Hair/Skin/Face & Features/Lips & Under-Eye/Advanced) | each category's heading/description + `treatments` collection scoped to that category (id, slug, name, shortDescription, image, whatIsIt, commonConcerns[], approach, treatmentOptions[], journey, notes, bookingLabel) — 16 rows total |
| Booking Prompt | heading, description, button label |
| Final CTA | FinalCtaContent (Services-specific row) |

## 4. Patients & Stories (`/patients-reviews`)

| Section | Fields |
|---|---|
| Hero | shared component, Patients-specific row |
| Before & After Cases | heading + `cases` scoped to Patients (reuses Home's 6) |
| Patient Reviews | heading + `reviews` (reuses Home's 6, no CTA shown) |
| FAQ | heading + `faq_items` scoped to Patients page (4 rows) |
| Final CTA | FinalCtaContent (Patients-specific row) |

## 5. Videos (`/videos`)

| Section | Fields |
|---|---|
| Hero | shared component, Videos-specific row |
| Featured Videos | heading + `videos` collection, full catalogue (9 rows) |
| Final CTA | FinalCtaContent (Videos-specific row) |

## 6. Articles (`/articles` + `/articles/[slug]`)

| Section | Fields |
|---|---|
| Hero | shared component, Articles-specific row |
| Featured Article | pulled from `articles` where `featured = true` |
| Related Articles | heading + `articles` collection (6 non-featured, published) |
| Final CTA | FinalCtaContent (Articles-specific row) |
| **Article detail page** | per `articles` row: title, excerpt, content[] (paragraphs), image, category, date, readingTime, author, seoTitle, seoDescription, published, featured — 7 rows |

## 7. Contact (`/contact`)

| Section | Fields |
|---|---|
| Hero | shared component, Contact-specific row |
| Contact intro | eyebrow, heading, description |
| Direct contact panel | reuses site_settings (WhatsApp/phone/email/address) |
| Contact form | field labels/placeholders (name, phone, email, service options from `treatment_categories`, message), submit button label, success/error copy |
| *(no Final CTA — page itself is the CTA)* | |

## 8–10. Legal pages — **new pages, not yet built on the frontend**

| Page | Route | Fields |
|---|---|---|
| Privacy Policy | `/privacy-policy` | title + body sections (heading+richtext repeater) |
| Terms of Service | `/terms-of-service` | title + body sections |
| Medical Disclaimer | `/medical-disclaimer` | title + body sections |

Each gets a minimal shared "legal page" template (title, intro, ordered
list of {heading, body} blocks) — same visual language (glass panel on the
warm canvas), no bespoke design per page.

## SEO (every page above, including the 3 legal pages)

Per page: seoTitle, metaDescription, slug, canonicalUrl, robotsIndex,
robotsFollow, ogTitle, ogDescription, ogImage, twitterTitle,
twitterDescription, twitterImage, keywords[], jsonLd (jsonb, optional).

## Media inventory

Every `image`/`thumbnail`/`before`/`after`/`portrait`/`video` field above is
a `media` row reference (storage path + alt text + title + description),
never a hardcoded local path, once CMS-driven.

## Bilingual (en/ar) surface

Every **F** text field and every text column inside a **C** collection row
carries an `ar_*` counterpart (or a `locale` row via `field_values`).
Structural fields that aren't language-dependent (image storage paths,
hrefs, numeric values, ratings, dates, ordering, enable flags) are shared
across locales, not duplicated.
