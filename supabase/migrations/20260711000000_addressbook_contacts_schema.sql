-- ============================================================
-- Address Book: dedicated "contacts" schema for shared project
-- Auth: Clerk (third-party). auth.jwt()->>'sub' is the Clerk
-- user id (TEXT, e.g. 'user_2ab...'), never a UUID.
-- Everything is namespaced/idempotent — safe to run alongside
-- other apps' schemas in the same Supabase project.
-- ============================================================

-- Schema
CREATE SCHEMA IF NOT EXISTS contacts;

-- Expose to PostgREST roles. No anon grants: this app has no
-- unauthenticated data access.
GRANT USAGE ON SCHEMA contacts TO authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA contacts TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA contacts TO authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA contacts TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA contacts
  GRANT ALL ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA contacts
  GRANT ALL ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA contacts
  GRANT ALL ON ROUTINES TO authenticated, service_role;

-- Contacts table. Phone uniqueness is scoped per user (a phone
-- number can legitimately appear in two users' address books).
CREATE TABLE IF NOT EXISTS contacts.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Friend', 'Colleague', 'Mate')),
  url TEXT,
  user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
  CONSTRAINT contacts_user_phone_unique UNIQUE (user_id, phone)
);

CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts.contacts (user_id);

-- Keep updated_at honest on every UPDATE.
CREATE OR REPLACE FUNCTION contacts.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON contacts.contacts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON contacts.contacts
  FOR EACH ROW EXECUTE FUNCTION contacts.set_updated_at();

-- RLS: per-user isolation keyed on the Clerk user id. The Clerk
-- Supabase integration puts role="authenticated" in the token,
-- which maps to the authenticated Postgres role.
ALTER TABLE contacts.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "addressbook_select_own" ON contacts.contacts;
CREATE POLICY "addressbook_select_own" ON contacts.contacts
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()->>'sub') = user_id);

DROP POLICY IF EXISTS "addressbook_insert_own" ON contacts.contacts;
CREATE POLICY "addressbook_insert_own" ON contacts.contacts
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt()->>'sub') = user_id);

DROP POLICY IF EXISTS "addressbook_update_own" ON contacts.contacts;
CREATE POLICY "addressbook_update_own" ON contacts.contacts
  FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt()->>'sub') = user_id)
  WITH CHECK ((SELECT auth.jwt()->>'sub') = user_id);

DROP POLICY IF EXISTS "addressbook_delete_own" ON contacts.contacts;
CREATE POLICY "addressbook_delete_own" ON contacts.contacts
  FOR DELETE TO authenticated
  USING ((SELECT auth.jwt()->>'sub') = user_id);

-- Storage: app-prefixed bucket to avoid collisions in the shared
-- project. storage.objects policies are project-global, so every
-- policy filters on bucket_id and carries the app prefix.
INSERT INTO storage.buckets (id, name, public)
VALUES ('addressbook-contact-images', 'addressbook-contact-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "addressbook_images_insert" ON storage.objects;
CREATE POLICY "addressbook_images_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'addressbook-contact-images'
    AND (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
  );

DROP POLICY IF EXISTS "addressbook_images_read" ON storage.objects;
CREATE POLICY "addressbook_images_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'addressbook-contact-images');

DROP POLICY IF EXISTS "addressbook_images_delete" ON storage.objects;
CREATE POLICY "addressbook_images_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'addressbook-contact-images'
    AND (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
  );
