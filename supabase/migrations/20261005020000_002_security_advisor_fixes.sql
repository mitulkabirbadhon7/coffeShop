-- Migration: 002_security_advisor_fixes.sql
-- Purpose: Resolve 10 Supabase Security Advisor warnings:
--   1. Enforce SET search_path = '' on all SECURITY DEFINER functions with fully-qualified object names.
--   2. Revoke PUBLIC execute on trigger-only functions (set_updated_at, handle_new_user, handle_profile_role_update).
--   3. Revoke anon execute on sensitive RPCs (is_admin, place_order).
--   4. Grant authenticated and service_role execute on (is_admin, place_order).
--   5. Update handle_profile_role_update with first-admin bootstrap logic.

BEGIN;

-- 1. Utility function: set_updated_at
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

-- 2. Auth trigger: handle_new_user
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

-- 3. Security helper: is_admin
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

-- 4. Guard: handle_profile_role_update with first-admin bootstrap logic
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
        -- Check if any administrator currently exists in the system
        SELECT EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE role = 'ADMIN'
        ) INTO v_admin_exists;

        -- If an admin exists, caller must be an administrator
        IF v_admin_exists THEN
            IF NOT (public.is_admin()) THEN
                RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
            END IF;
        END IF;
        -- If no admin exists yet (first-admin bootstrap), permit the role update
    END IF;
    RETURN NEW;
END;
$$;

-- 5. RPC: place_order with explicit search_path = ''
CREATE OR REPLACE FUNCTION public.place_order(
    items JSONB,
    notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_order_id UUID;
    v_subtotal INTEGER := 0;
    v_item RECORD;
    v_product RECORD;
    v_qty INTEGER;
    v_line_total INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to place an order.';
    END IF;

    IF items IS NULL OR jsonb_array_length(items) = 0 THEN
        RAISE EXCEPTION 'Order items cannot be empty.';
    END IF;

    -- Validate each item and calculate subtotal using current product prices
    FOR v_item IN SELECT * FROM jsonb_to_recordset(items) AS x(product_id UUID, quantity INTEGER)
    LOOP
        v_qty := v_item.quantity;
        IF v_qty IS NULL OR v_qty < 1 OR v_qty > 20 THEN
            RAISE EXCEPTION 'Item quantity must be between 1 and 20.';
        END IF;

        SELECT id, name, price_minor, is_available, deleted_at
        INTO v_product
        FROM public.products
        WHERE id = v_item.product_id;

        IF NOT FOUND OR v_product.deleted_at IS NOT NULL OR NOT v_product.is_available THEN
            RAISE EXCEPTION 'Product % is unavailable.', v_item.product_id;
        END IF;

        v_line_total := v_product.price_minor * v_qty;
        v_subtotal := v_subtotal + v_line_total;
    END LOOP;

    -- Insert Order
    INSERT INTO public.orders (user_id, status, currency, subtotal_minor, total_minor, notes)
    VALUES (v_user_id, 'PENDING', 'BDT', v_subtotal, v_subtotal, notes)
    RETURNING id INTO v_order_id;

    -- Insert Order Items with Snapshot
    FOR v_item IN SELECT * FROM jsonb_to_recordset(items) AS x(product_id UUID, quantity INTEGER)
    LOOP
        SELECT id, name, price_minor
        INTO v_product
        FROM public.products
        WHERE id = v_item.product_id;

        v_qty := v_item.quantity;
        v_line_total := v_product.price_minor * v_qty;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name_snapshot,
            unit_price_minor,
            quantity,
            line_total_minor
        )
        VALUES (
            v_order_id,
            v_product.id,
            v_product.name,
            v_product.price_minor,
            v_qty,
            v_line_total
        );
    END LOOP;

    RETURN v_order_id;
END;
$$;

-- 6. Revoke PUBLIC execute on trigger-only functions
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_profile_role_update() FROM PUBLIC, anon, authenticated;

-- 7. Revoke anon execute on sensitive functions / RPCs
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.place_order(jsonb, text) FROM anon, PUBLIC;

-- 8. Grant authenticated and service_role execute
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, text) TO authenticated, service_role;

-- 9. Separate public/anon and authenticated read policies to avoid anon invoking is_admin()
DROP POLICY IF EXISTS "products_public_select_available" ON public.products;
DROP POLICY IF EXISTS "products_authenticated_select" ON public.products;
CREATE POLICY "products_public_select_available" ON public.products
    FOR SELECT TO anon
    USING (deleted_at IS NULL AND is_available = true);
CREATE POLICY "products_authenticated_select" ON public.products
    FOR SELECT TO authenticated
    USING ((deleted_at IS NULL AND is_available = true) OR public.is_admin());

DROP POLICY IF EXISTS "site_content_select_published" ON public.site_content;
DROP POLICY IF EXISTS "site_content_public_select" ON public.site_content;
DROP POLICY IF EXISTS "site_content_authenticated_select" ON public.site_content;
CREATE POLICY "site_content_select_published" ON public.site_content
    FOR SELECT TO anon
    USING (published = true);
CREATE POLICY "site_content_authenticated_select" ON public.site_content
    FOR SELECT TO authenticated
    USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_all" ON public.site_content;
CREATE POLICY "site_content_admin_all" ON public.site_content
    FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "testimonials_select_published" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_public_select" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_authenticated_select" ON public.testimonials;
CREATE POLICY "testimonials_select_published" ON public.testimonials
    FOR SELECT TO anon
    USING (is_published = true);
CREATE POLICY "testimonials_authenticated_select" ON public.testimonials
    FOR SELECT TO authenticated
    USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "testimonials_admin_all" ON public.testimonials;
CREATE POLICY "testimonials_admin_all" ON public.testimonials
    FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

COMMIT;

