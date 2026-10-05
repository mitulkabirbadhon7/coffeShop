-- Add variants and discount_percentage to products table
ALTER TABLE public.products
ADD COLUMN variants TEXT[] DEFAULT '{}',
ADD COLUMN discount_percentage NUMERIC DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Make sure to notify postgrest schema cache
NOTIFY pgrst, 'reload schema';
