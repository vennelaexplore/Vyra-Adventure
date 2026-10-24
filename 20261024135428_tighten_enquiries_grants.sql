/*
# Tighten enquiries table grants (least privilege)

## Purpose
The initial migration only explicitly granted INSERT to anon/authenticated
and SELECT/UPDATE/DELETE to service_role. However, Supabase's default table
grants still give anon and authenticated table-level SELECT, UPDATE, and
DELETE privileges. While RLS policies block those operations (only an INSERT
policy exists), the table-level grants should also be removed to follow
the principle of least privilege.

## Changes
1. REVOKE SELECT, UPDATE, DELETE from anon and authenticated on enquiries.
2. Re-grant INSERT only to anon and authenticated (preserves the public
   booking form's ability to submit enquiries).
3. service_role retains SELECT, UPDATE, DELETE (unchanged, not revoked).
4. No RLS policy changes — the INSERT policy is unchanged.
*/

REVOKE SELECT, UPDATE, DELETE ON enquiries FROM anon, authenticated;
GRANT INSERT ON enquiries TO anon, authenticated;
