-- Phase 16: Performance Optimization Indexes

-- 1. Products: used heavily on the menu page, filtering by available and active status.
CREATE INDEX IF NOT EXISTS idx_products_catalog 
  ON public.products (deleted_at, is_available, category_id)
  WHERE deleted_at IS NULL AND is_available = true;

-- 2. Products slug lookup (Product Details Page)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug 
  ON public.products (slug)
  WHERE deleted_at IS NULL;

-- 3. Products category lookup (Related products, filter by category)
CREATE INDEX IF NOT EXISTS idx_products_category 
  ON public.products (category_id);

-- 4. Featured products (Homepage)
CREATE INDEX IF NOT EXISTS idx_products_featured 
  ON public.products (is_featured, created_at DESC)
  WHERE deleted_at IS NULL AND is_available = true AND is_featured = true;

-- 5. Order history by user
CREATE INDEX IF NOT EXISTS idx_orders_user_created 
  ON public.orders (user_id, created_at DESC);

-- 6. Order items (Avoiding N+1 or slow fetch for order details)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
  ON public.order_items (order_id);

-- 7. Orders status filtering (Admin Dashboard)
CREATE INDEX IF NOT EXISTS idx_orders_status 
  ON public.orders (status, created_at DESC);
