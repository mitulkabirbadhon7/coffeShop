-- Migration: 004_fix_rls_performance.sql
-- Purpose: Resolve ALL Performance Advisor warnings:
--   A. auth_rls_initplan  (12 warnings)
--      Wrap every auth.uid() call inside RLS policies with (select auth.uid())
--      so PostgreSQL evaluates it once per query, not once per row.
--   B. multiple_permissive_policies  (26 warnings)
--      Replace every FOR ALL admin policy with per-action policies
--      (INSERT / UPDATE / DELETE) scoped TO authenticated, eliminating
--      overlapping permissive policies on the same role+action.

BEGIN;

-- ============================================================
-- 8.1  PROFILES  (fixes 3 auth_rls_initplan)
-- ============================================================
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT
    USING (id = (select auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
    FOR UPDATE
    USING (id = (select auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "profiles_insert_service_or_admin" ON public.profiles;
CREATE POLICY "profiles_insert_service_or_admin" ON public.profiles
    FOR INSERT
    WITH CHECK (id = (select auth.uid()) OR public.is_admin());

-- profiles_delete_admin_only: no auth.uid(), no initplan issue
-- (recreate for consistency)
DROP POLICY IF EXISTS "profiles_delete_admin_only" ON public.profiles;
CREATE POLICY "profiles_delete_admin_only" ON public.profiles
    FOR DELETE
    USING (public.is_admin());

-- ============================================================
-- 8.2  ADDRESSES  (fixes 4 auth_rls_initplan)
-- ============================================================
DROP POLICY IF EXISTS "addresses_select_owner_or_admin" ON public.addresses;
CREATE POLICY "addresses_select_owner_or_admin" ON public.addresses
    FOR SELECT
    USING (user_id = (select auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "addresses_insert_owner" ON public.addresses;
CREATE POLICY "addresses_insert_owner" ON public.addresses
    FOR INSERT
    WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "addresses_update_owner" ON public.addresses;
CREATE POLICY "addresses_update_owner" ON public.addresses
    FOR UPDATE
    USING (user_id = (select auth.uid()))
    WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "addresses_delete_owner_or_admin" ON public.addresses;
CREATE POLICY "addresses_delete_owner_or_admin" ON public.addresses
    FOR DELETE
    USING (user_id = (select auth.uid()) OR public.is_admin());

-- ============================================================
-- 8.3  PRODUCT CATEGORIES  (no auth.uid() calls — no changes needed)
-- ============================================================

-- ============================================================
-- 8.4  PRODUCTS  (no auth.uid() calls — no changes needed)
--      (anon/authenticated SELECT split already handled by migration 002)
-- ============================================================

-- ============================================================
-- 8.5  ORDERS  (fixes 2 auth_rls_initplan)
-- ============================================================
DROP POLICY IF EXISTS "orders_select_owner_or_admin" ON public.orders;
CREATE POLICY "orders_select_owner_or_admin" ON public.orders
    FOR SELECT
    USING (user_id = (select auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "orders_insert_owner" ON public.orders;
CREATE POLICY "orders_insert_owner" ON public.orders
    FOR INSERT
    WITH CHECK (user_id = (select auth.uid()));

-- orders_update_admin_only / orders_delete_admin_only:
-- no auth.uid(), no initplan issue — keep as-is

-- ============================================================
-- 8.6  ORDER ITEMS  (fixes 2 auth_rls_initplan + 12 multiple_permissive)
--      Replace FOR ALL with separate UPDATE / DELETE.
-- ============================================================
DROP POLICY IF EXISTS "order_items_select_owner_or_admin" ON public.order_items;
CREATE POLICY "order_items_select_owner_or_admin" ON public.order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.user_id = (select auth.uid()) OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "order_items_insert_owner_or_admin" ON public.order_items;
CREATE POLICY "order_items_insert_owner_or_admin" ON public.order_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.user_id = (select auth.uid()) OR public.is_admin())
        )
    );

-- Remove the broad FOR ALL policy and replace with per-action
DROP POLICY IF EXISTS "order_items_admin_modify" ON public.order_items;

DROP POLICY IF EXISTS "order_items_admin_update" ON public.order_items;
CREATE POLICY "order_items_admin_update" ON public.order_items
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "order_items_admin_delete" ON public.order_items;
CREATE POLICY "order_items_admin_delete" ON public.order_items
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- 8.7  SITE CONTENT  (fixes 1 multiple_permissive)
--      Split FOR ALL → INSERT / UPDATE / DELETE
--      so it doesn't overlap with the existing SELECT policies.
-- ============================================================
DROP POLICY IF EXISTS "site_content_admin_all" ON public.site_content;

DROP POLICY IF EXISTS "site_content_admin_insert" ON public.site_content;
CREATE POLICY "site_content_admin_insert" ON public.site_content
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_update" ON public.site_content;
CREATE POLICY "site_content_admin_update" ON public.site_content
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_delete" ON public.site_content;
CREATE POLICY "site_content_admin_delete" ON public.site_content
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- 8.8  TESTIMONIALS  (fixes 1 multiple_permissive)
--      Same pattern as site_content.
-- ============================================================
DROP POLICY IF EXISTS "testimonials_admin_all" ON public.testimonials;

DROP POLICY IF EXISTS "testimonials_admin_insert" ON public.testimonials;
CREATE POLICY "testimonials_admin_insert" ON public.testimonials
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "testimonials_admin_update" ON public.testimonials;
CREATE POLICY "testimonials_admin_update" ON public.testimonials
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "testimonials_admin_delete" ON public.testimonials;
CREATE POLICY "testimonials_admin_delete" ON public.testimonials
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- 8.9  NEWSLETTER SUBSCRIBERS  (fixes 6 multiple_permissive)
--      Replace FOR ALL with SELECT / UPDATE / DELETE (no INSERT
--      since newsletter_insert_public already covers public inserts).
-- ============================================================
DROP POLICY IF EXISTS "newsletter_admin_all" ON public.newsletter_subscribers;

DROP POLICY IF EXISTS "newsletter_admin_select" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_admin_select" ON public.newsletter_subscribers
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "newsletter_admin_update" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_admin_update" ON public.newsletter_subscribers
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "newsletter_admin_delete" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_admin_delete" ON public.newsletter_subscribers
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- 8.10 CONTACT MESSAGES  (fixes 6 multiple_permissive)
--      Same pattern as newsletter.
-- ============================================================
DROP POLICY IF EXISTS "contact_admin_all" ON public.contact_messages;

DROP POLICY IF EXISTS "contact_admin_select" ON public.contact_messages;
CREATE POLICY "contact_admin_select" ON public.contact_messages
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "contact_admin_update" ON public.contact_messages;
CREATE POLICY "contact_admin_update" ON public.contact_messages
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "contact_admin_delete" ON public.contact_messages;
CREATE POLICY "contact_admin_delete" ON public.contact_messages
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================================
-- 8.11 AUDIT LOGS  (fixes 1 auth_rls_initplan)
-- ============================================================
DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
    FOR INSERT
    WITH CHECK (actor_id = (select auth.uid()) OR public.is_admin());

-- audit_logs_admin_select: only uses is_admin(), no auth.uid() — keep as-is

COMMIT;
