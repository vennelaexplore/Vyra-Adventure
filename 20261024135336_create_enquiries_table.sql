/*
# Create enquiries table for trek booking submissions

## Purpose
Vyra Adventure is a no-auth public website. Visitors fill out a booking
enquiry form for a specific trek. This migration creates a single table to
store those enquiries so the team can review them later.

## 1. New Tables

### enquiries
- `id` (uuid, primary key, auto-generated)
- `reference` (text, unique, NOT NULL) — short human-readable code like "VA-AB12CD", generated client-side
- `tour_id` (text, NOT NULL) — the trek identifier from the app's tour list (e.g. "kudremukh")
- `tour_name` (text, NOT NULL) — the trek display name at time of enquiry
- `departure` (text) — the proposed departure date/window string
- `meeting_city` (text) — the meeting city for the trek
- `travelers` (integer, NOT NULL, default 1) — number of trekkers
- `quoted_price` (integer, NOT NULL, default 0) — per-person price in INR (0 = "on request")
- `name` (text, NOT NULL) — visitor's full name
- `phone` (text, NOT NULL) — visitor's phone/WhatsApp number
- `email` (text) — optional email address
- `preferred_date` (text) — optional preferred travel date (free text)
- `notes` (text) — optional medical/fitness/diet notes
- `status` (text, NOT NULL, default 'new') — enquiry workflow state: new | contacted | confirmed | closed
- `created_at` (timestamptz, default now())

## 2. Indexes
- `idx_enquiries_created_at` — descending on created_at for "newest first" views
- `idx_enquiries_status` — for filtering by workflow state
- `idx_enquiries_tour_id` — for filtering by trek

## 3. Security
- This is a NO-AUTH public app. The frontend uses the anon key, so all
  policies target `anon, authenticated`.
- RLS enabled on `enquiries`.
- INSERT: anyone (anon, authenticated) can create an enquiry — this is the
  public booking form. The honeypot check happens client-side.
- SELECT / UPDATE / DELETE: NOT granted to anon or authenticated. Only the
  service_role (used server-side / by the team's admin tooling) can read or
  modify enquiries. This means visitors cannot read other people's enquiries
  or see who else has booked. This is the intended access model.
- `GRANT INSERT` on `enquiries` to `anon, authenticated` so the Data API can
  write new rows.
- `GRANT SELECT, UPDATE, DELETE` on `enquiries` to `service_role` for admin
  review.
- No `USING (true)` shortcut — the INSERT policy uses `WITH CHECK (true)`
  because inserts are intentionally public, and no SELECT policy exists for
  anon/authenticated at all, so visitors cannot read the table.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  tour_id text NOT NULL,
  tour_name text NOT NULL,
  departure text,
  meeting_city text,
  travelers integer NOT NULL DEFAULT 1 CHECK (travelers >= 1 AND travelers <= 999),
  quoted_price integer NOT NULL DEFAULT 0 CHECK (quoted_price >= 0),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  preferred_date text,
  notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_tour_id ON enquiries (tour_id);

-- The anon-key frontend can INSERT new enquiries (public booking form).
GRANT INSERT ON enquiries TO anon, authenticated;

-- Only the service_role (admin tooling, edge functions) can read or modify.
GRANT SELECT, UPDATE, DELETE ON enquiries TO service_role;

-- INSERT policy: public can submit enquiries. No SELECT/UPDATE/DELETE policy
-- for anon/authenticated means they cannot read or modify rows.
DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries"
ON enquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);
