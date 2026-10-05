-- Migration: 003_fix_security_warnings.sql
-- Purpose: Harden all SECURITY DEFINER functions
--   1. SET search_path = '' on every SECURITY DEFINER function.
--   2. Fully-qualify all table/function references inside each body.
--   3. REVOKE PUBLIC execute on trigger-only functions.
--   4. REVOKE anon execute on user-facing RPCs.
--   5. GRANT authenticated (+ service_role) execute on user-facing RPCs.
--   6. First-admin bootstrap logic in handle_profile_role_update.

BEGIN;

-- ============================================================
-- 1. Utility trigger: set_updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$$;

-- ============================================================
-- 2. Auth trigger: handle_new_user
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url, role)
    VALUES (
        NEW.id,
        pg_catalog.coalesce(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            pg_catalog.split_part(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        'USER'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- ============================================================
-- 3. Guard trigger: handle_profile_role_update (first-admin bootstrap)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_profile_role_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_admin_exists boolean;
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        SELECT EXISTS (
            SELECT 1 FROM public.profiles WHERE role = 'ADMIN'
        ) INTO v_admin_exists;

        IF v_admin_exists THEN
            IF NOT (public.is_admin()) THEN
                RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
            END IF;
        END IF;
        -- No admin exists yet → permit (first-admin bootstrap)
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================
-- 4. Security helper: is_admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
$$;

-- ============================================================
-- 5. REVOKE trigger-only functions from every API role
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.set_updated_at()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()               FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_profile_role_update()    FROM PUBLIC, anon, authenticated;

-- ============================================================
-- 6. REVOKE anon on user-facing RPCs
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.is_admin()                      FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.place_order(jsonb, text)        FROM PUBLIC, anon;

-- ============================================================
-- 7. GRANT authenticated + service_role on user-facing RPCs
-- ============================================================
GRANT EXECUTE ON FUNCTION public.is_admin()                       TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, text)         TO authenticated, service_role;

COMMIT;
