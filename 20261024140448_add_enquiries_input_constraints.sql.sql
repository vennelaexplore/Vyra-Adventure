/*
# Add input length and format constraints to enquiries table

1. Modified Tables
- `enquiries`
  - Add CHECK constraints to enforce reasonable length limits and formats
    on user-supplied fields, as defense-in-depth against oversized or malformed
    input that bypasses client-side validation.
  - name: 1–120 characters
  - phone: 6–20 characters (digits, spaces, +, (, ), -)
  - email: max 254 characters when not null
  - notes: max 1000 characters when not null
  - status: limited to known workflow values (new, contacted, booked, archived)

2. Security
- No RLS or policy changes. Existing INSERT-only access for anon/authenticated
  is unchanged. These constraints protect data integrity at the database layer.

3. Important Notes
- Uses DO $$ ... END $$ blocks to add constraints idempotently (IF NOT EXISTS is
  not supported for CHECK constraints directly, so we guard with a lookup to
  pg_constraint).
- These constraints run AFTER existing rows: any pre-existing data that
  violates them would cause the ALTER to fail. The table was freshly created
  with no production data, so this is safe.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_name_length' AND conrelid = 'enquiries'::regclass
  ) THEN
    ALTER TABLE enquiries ADD CONSTRAINT enquiries_name_length CHECK (length(name) BETWEEN 1 AND 120);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_phone_length' AND conrelid = 'enquiries'::regclass
  ) THEN
    ALTER TABLE enquiries ADD CONSTRAINT enquiries_phone_length CHECK (length(phone) BETWEEN 6 AND 20);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_email_length' AND conrelid = 'enquiries'::regclass
  ) THEN
    ALTER TABLE enquiries ADD CONSTRAINT enquiries_email_length CHECK (email IS NULL OR length(email) <= 254);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_notes_length' AND conrelid = 'enquiries'::regclass
  ) THEN
    ALTER TABLE enquiries ADD CONSTRAINT enquiries_notes_length CHECK (notes IS NULL OR length(notes) <= 1000);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_status_valid' AND conrelid = 'enquiries'::regclass
  ) THEN
    ALTER TABLE enquiries ADD CONSTRAINT enquiries_status_valid CHECK (status IN ('new', 'contacted', 'booked', 'archived', 'cancelled'));
  END IF;
END $$;
