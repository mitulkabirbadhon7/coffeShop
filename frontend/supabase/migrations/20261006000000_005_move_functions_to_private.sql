BEGIN;

-- 1. Create private schema
CREATE SCHEMA IF NOT EXISTS private;

-- 2. Grant usage to appropriate roles
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

-- 3. Recreate is_admin in private schema
CREATE OR REPLACE FUNCTION private.is_admin(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND role = 'ADMIN'
  );
$$;

-- 4. Recreate place_order in private schema
CREATE OR REPLACE FUNCTION private.place_order(
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

    INSERT INTO public.orders (user_id, status, currency, subtotal_minor, total_minor, notes)
    VALUES (v_user_id, 'PENDING', 'BDT', v_subtotal, v_subtotal, notes)
    RETURNING id INTO v_order_id;

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

-- 5. Drop ALL policies that depend on public.is_admin() before dropping the function
DROP POLICY IF EXISTS "categories_admin_insert" ON public.product_categories;
DROP POLICY IF EXISTS "categories_admin_update" ON public.product_categories;
DROP POLICY IF EXISTS "categories_admin_delete" ON public.product_categories;
DROP POLICY IF EXISTS "products_admin_insert" ON public.products;
DROP POLICY IF EXISTS "products_admin_update" ON public.products;
DROP POLICY IF EXISTS "products_admin_delete" ON public.products;
DROP POLICY IF EXISTS "products_authenticated_select" ON public.products;
DROP POLICY IF EXISTS "orders_update_admin_only" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_admin_only" ON public.orders;
DROP POLICY IF EXISTS "orders_select_owner_or_admin" ON public.orders;
DROP POLICY IF EXISTS "audit_logs_admin_select" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
DROP POLICY IF EXISTS "site_content_authenticated_select" ON public.site_content;
DROP POLICY IF EXISTS "site_content_admin_insert" ON public.site_content;
DROP POLICY IF EXISTS "site_content_admin_update" ON public.site_content;
DROP POLICY IF EXISTS "site_content_admin_delete" ON public.site_content;
DROP POLICY IF EXISTS "testimonials_authenticated_select" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_admin_insert" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_admin_update" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_admin_delete" ON public.testimonials;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_admin_only" ON public.profiles;
DROP POLICY IF EXISTS "addresses_select_owner_or_admin" ON public.addresses;
DROP POLICY IF EXISTS "addresses_delete_owner_or_admin" ON public.addresses;
DROP POLICY IF EXISTS "order_items_select_owner_or_admin" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_owner_or_admin" ON public.order_items;
DROP POLICY IF EXISTS "order_items_admin_update" ON public.order_items;
DROP POLICY IF EXISTS "order_items_admin_delete" ON public.order_items;
DROP POLICY IF EXISTS "newsletter_admin_select" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_admin_update" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_admin_delete" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "contact_admin_select" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_admin_update" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_admin_delete" ON public.contact_messages;

-- 5b. Drop old functions from public
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.place_order(jsonb, text);

-- 6. Add public wrapper for place_order so that JS client continues to work out-of-the-box
CREATE OR REPLACE FUNCTION public.place_order(items JSONB, notes TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE sql
AS $$
  SELECT private.place_order(items, notes);
$$;

-- 7. Revoke public execute on new functions
REVOKE EXECUTE ON FUNCTION private.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION private.place_order(jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.place_order(jsonb, text) TO authenticated;

-- Also update the wrapper permissions
REVOKE EXECUTE ON FUNCTION public.place_order(jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, text) TO authenticated;

-- 8. Recreate ALL policies to use private.is_admin()
-- From 001/002
CREATE POLICY "categories_admin_insert" ON public.product_categories FOR INSERT WITH CHECK (private.is_admin());
CREATE POLICY "categories_admin_update" ON public.product_categories FOR UPDATE USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "categories_admin_delete" ON public.product_categories FOR DELETE USING (private.is_admin());

CREATE POLICY "products_admin_insert" ON public.products FOR INSERT WITH CHECK (private.is_admin());
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE USING (private.is_admin());

CREATE POLICY "orders_update_admin_only" ON public.orders FOR UPDATE USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "orders_delete_admin_only" ON public.orders FOR DELETE USING (private.is_admin());
CREATE POLICY "audit_logs_admin_select" ON public.audit_logs FOR SELECT USING (private.is_admin());

CREATE POLICY "products_authenticated_select" ON public.products
    FOR SELECT TO authenticated
    USING ((deleted_at IS NULL AND is_available = true) OR private.is_admin());

CREATE POLICY "site_content_authenticated_select" ON public.site_content
    FOR SELECT TO authenticated
    USING (published = true OR private.is_admin());

CREATE POLICY "testimonials_authenticated_select" ON public.testimonials
    FOR SELECT TO authenticated
    USING (is_published = true OR private.is_admin());

-- From 004
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT USING (id = (select auth.uid()) OR private.is_admin());

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
    FOR UPDATE USING (id = (select auth.uid()) OR private.is_admin());

CREATE POLICY "profiles_insert_service_or_admin" ON public.profiles
    FOR INSERT WITH CHECK (id = (select auth.uid()) OR private.is_admin());

CREATE POLICY "profiles_delete_admin_only" ON public.profiles
    FOR DELETE USING (private.is_admin());

CREATE POLICY "addresses_select_owner_or_admin" ON public.addresses
    FOR SELECT USING (user_id = (select auth.uid()) OR private.is_admin());

CREATE POLICY "addresses_delete_owner_or_admin" ON public.addresses
    FOR DELETE USING (user_id = (select auth.uid()) OR private.is_admin());

CREATE POLICY "orders_select_owner_or_admin" ON public.orders
    FOR SELECT USING (user_id = (select auth.uid()) OR private.is_admin());

CREATE POLICY "order_items_select_owner_or_admin" ON public.order_items
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.user_id = (select auth.uid()) OR private.is_admin())));

CREATE POLICY "order_items_insert_owner_or_admin" ON public.order_items
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.user_id = (select auth.uid()) OR private.is_admin())));

CREATE POLICY "order_items_admin_update" ON public.order_items
    FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "order_items_admin_delete" ON public.order_items
    FOR DELETE TO authenticated USING (private.is_admin());

CREATE POLICY "site_content_admin_insert" ON public.site_content
    FOR INSERT TO authenticated WITH CHECK (private.is_admin());

CREATE POLICY "site_content_admin_update" ON public.site_content
    FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "site_content_admin_delete" ON public.site_content
    FOR DELETE TO authenticated USING (private.is_admin());

CREATE POLICY "testimonials_admin_insert" ON public.testimonials
    FOR INSERT TO authenticated WITH CHECK (private.is_admin());

CREATE POLICY "testimonials_admin_update" ON public.testimonials
    FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "testimonials_admin_delete" ON public.testimonials
    FOR DELETE TO authenticated USING (private.is_admin());

CREATE POLICY "newsletter_admin_select" ON public.newsletter_subscribers
    FOR SELECT TO authenticated USING (private.is_admin());

CREATE POLICY "newsletter_admin_update" ON public.newsletter_subscribers
    FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "newsletter_admin_delete" ON public.newsletter_subscribers
    FOR DELETE TO authenticated USING (private.is_admin());

CREATE POLICY "contact_admin_select" ON public.contact_messages
    FOR SELECT TO authenticated USING (private.is_admin());

CREATE POLICY "contact_admin_update" ON public.contact_messages
    FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

CREATE POLICY "contact_admin_delete" ON public.contact_messages
    FOR DELETE TO authenticated USING (private.is_admin());

CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
    FOR INSERT WITH CHECK (actor_id = (select auth.uid()) OR private.is_admin());

-- Also update trigger function from 003
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
            IF NOT (private.is_admin()) THEN
                RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

COMMIT;
