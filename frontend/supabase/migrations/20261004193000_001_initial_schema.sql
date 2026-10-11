-- Migration: 001_initial_schema.sql
-- Purpose: Create foundational schema, enums, tables, functions, triggers, and RLS policies for Chocobliss Coffee Shop.
-- Rollback:
--   DROP FUNCTION IF EXISTS public.place_order(jsonb, text);
--   DROP FUNCTION IF EXISTS public.is_admin();
--   DROP FUNCTION IF EXISTS public.handle_profile_role_update();
--   DROP FUNCTION IF EXISTS public.handle_new_user();
--   DROP FUNCTION IF EXISTS public.set_updated_at();
--   DROP TABLE IF EXISTS public.audit_logs CASCADE;
--   DROP TABLE IF EXISTS public.contact_messages CASCADE;
--   DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
--   DROP TABLE IF EXISTS public.testimonials CASCADE;
--   DROP TABLE IF EXISTS public.site_content CASCADE;
--   DROP TABLE IF EXISTS public.order_items CASCADE;
--   DROP TABLE IF EXISTS public.orders CASCADE;
--   DROP TABLE IF EXISTS public.products CASCADE;
--   DROP TABLE IF EXISTS public.product_categories CASCADE;
--   DROP TABLE IF EXISTS public.addresses CASCADE;
--   DROP TABLE IF EXISTS public.profiles CASCADE;
--   DROP TYPE IF EXISTS public.contact_status;
--   DROP TYPE IF EXISTS public.order_status;
--   DROP TYPE IF EXISTS public.user_role;

BEGIN;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM (
        'PENDING',
        'CONFIRMED',
        'PREPARING',
        'READY',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.contact_status AS ENUM ('UNREAD', 'READ', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 4. TABLES

-- 4.1 Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    role public.user_role NOT NULL DEFAULT 'USER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.2 Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Bangladesh',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.3 Product Categories
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.4 Products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price_minor INTEGER NOT NULL CHECK (price_minor >= 0),
    currency TEXT NOT NULL DEFAULT 'BDT',
    image_path TEXT,
    ingredients TEXT[] DEFAULT '{}',
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.5 Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    status public.order_status NOT NULL DEFAULT 'PENDING',
    currency TEXT NOT NULL DEFAULT 'BDT',
    subtotal_minor INTEGER NOT NULL CHECK (subtotal_minor >= 0),
    total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.6 Order Items (price & name snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name_snapshot TEXT NOT NULL,
    unit_price_minor INTEGER NOT NULL CHECK (unit_price_minor >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 20),
    line_total_minor INTEGER NOT NULL CHECK (line_total_minor >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.7 Site Content
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_key TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    published BOOLEAN NOT NULL DEFAULT false,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.8 Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    role_or_context TEXT,
    image_path TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.9 Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ
);

-- 4.10 Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status public.contact_status NOT NULL DEFAULT 'UNREAD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.11 Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. INDEXES FOR PERFORMANCE & INTEGRITY
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON public.products(deleted_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 6. TRIGGERS FOR updated_at
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. SECURITY FUNCTIONS & TRIGGERS

-- 7.1 Auto-create profile on auth.users insert
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
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'USER'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7.2 Helper: Check if current user is admin
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

-- 7.3 Guard: Prevent non-admins from changing role
CREATE OR REPLACE FUNCTION public.handle_profile_role_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        IF NOT (public.is_admin()) THEN
            RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_guard_profile_role ON public.profiles;
CREATE TRIGGER tr_guard_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_profile_role_update();

-- 7.4 RPC: Atomic order placement with server-side pricing
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

-- 8. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 8.1 Profiles Policies
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
    FOR UPDATE USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_insert_service_or_admin" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_delete_admin_only" ON public.profiles
    FOR DELETE USING (public.is_admin());

-- 8.2 Addresses Policies
CREATE POLICY "addresses_select_owner_or_admin" ON public.addresses
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "addresses_insert_owner" ON public.addresses
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses_update_owner" ON public.addresses
    FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses_delete_owner_or_admin" ON public.addresses
    FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- 8.3 Product Categories Policies
CREATE POLICY "categories_public_select" ON public.product_categories
    FOR SELECT USING (true);

CREATE POLICY "categories_admin_insert" ON public.product_categories
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "categories_admin_update" ON public.product_categories
    FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "categories_admin_delete" ON public.product_categories
    FOR DELETE USING (public.is_admin());

-- 8.4 Products Policies
CREATE POLICY "products_public_select_available" ON public.products
    FOR SELECT USING (
        (deleted_at IS NULL AND is_available = true) OR public.is_admin()
    );

CREATE POLICY "products_admin_insert" ON public.products
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_update" ON public.products
    FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_delete" ON public.products
    FOR DELETE USING (public.is_admin());

-- 8.5 Orders Policies
CREATE POLICY "orders_select_owner_or_admin" ON public.orders
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "orders_insert_owner" ON public.orders
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_update_admin_only" ON public.orders
    FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "orders_delete_admin_only" ON public.orders
    FOR DELETE USING (public.is_admin());

-- 8.6 Order Items Policies
CREATE POLICY "order_items_select_owner_or_admin" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "order_items_insert_owner_or_admin" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "order_items_admin_modify" ON public.order_items
    FOR ALL USING (public.is_admin());

-- 8.7 Site Content Policies
CREATE POLICY "site_content_select_published" ON public.site_content
    FOR SELECT USING (published = true OR public.is_admin());

CREATE POLICY "site_content_admin_all" ON public.site_content
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8.8 Testimonials Policies
CREATE POLICY "testimonials_select_published" ON public.testimonials
    FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "testimonials_admin_all" ON public.testimonials
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8.9 Newsletter Subscribers Policies
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (email IS NOT NULL AND length(email) > 3);

CREATE POLICY "newsletter_admin_all" ON public.newsletter_subscribers
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8.10 Contact Messages Policies
CREATE POLICY "contact_insert_public" ON public.contact_messages
    FOR INSERT WITH CHECK (
        length(name) > 0 AND length(email) > 3 AND length(message) > 0
    );

CREATE POLICY "contact_admin_all" ON public.contact_messages
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8.11 Audit Logs Policies
CREATE POLICY "audit_logs_admin_select" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
    FOR INSERT WITH CHECK (actor_id = auth.uid() OR public.is_admin());

COMMIT;
