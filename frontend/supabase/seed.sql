-- Seed Data for Chocobliss Coffee Roastery
-- Categories, Products (22 items), Site Content, Testimonials

BEGIN;

-- 1. Insert Categories
INSERT INTO public.product_categories (id, name, slug, description, sort_order)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Espresso Classics', 'espresso-classics', 'Rich, concentrated coffee extractions crafted with our house roast.', 1),
    ('a0000000-0000-0000-0000-000000000002', 'Artisan Brews', 'artisan-brews', 'Single origin pour-over, Aeropress, and slow-drip craft coffee.', 2),
    ('a0000000-0000-0000-0000-000000000003', 'Chilled & Iced', 'chilled-iced', 'Cold brew, iced lattes, and refreshing coffee elixirs.', 3),
    ('a0000000-0000-0000-0000-000000000004', 'Bakery & Treats', 'bakery-treats', 'Freshly baked croissants, brownies, and decadent cocoa pastries.', 4),
    ('a0000000-0000-0000-0000-000000000005', 'Whole Bean Retail', 'whole-bean-retail', 'Freshly roasted whole beans sourced directly from ethical farms.', 5)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- 2. Insert Products (22 items with BDT prices in minor units, e.g. 22000 = 220 BDT)
INSERT INTO public.products (id, category_id, name, slug, description, price_minor, currency, ingredients, is_available, is_featured)
VALUES
    -- Espresso Classics
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Signature Double Espresso', 'signature-double-espresso', 'Intense, velvety double shot with notes of dark cacao and caramelized hazelnut.', 18000, 'BDT', ARRAY['House Blend Espresso'], true, true),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Velvet Cortado', 'velvet-cortado', 'Equal parts rich espresso and silky steamed whole milk for the balanced purist.', 24000, 'BDT', ARRAY['Espresso', 'Steamed Whole Milk'], true, false),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Golden Cappuccino', 'golden-cappuccino', 'Double shot espresso beneath dense microfoam finished with golden dusting.', 28000, 'BDT', ARRAY['Espresso', 'Microfoam Milk', 'Cocoa Dust'], true, true),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Chocobliss Mocha Luxe', 'chocobliss-mocha-luxe', 'Single-origin espresso blended with 72% Belgian dark chocolate ganache and warm milk.', 35000, 'BDT', ARRAY['Espresso', '72% Belgian Chocolate', 'Steamed Milk', 'Vanilla Bean'], true, true),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Classic Flat White', 'classic-flat-white', 'Ristretto espresso shots poured with fine micro-foam, velvety texture.', 29000, 'BDT', ARRAY['Ristretto Espresso', 'Textured Milk'], true, false),

    -- Artisan Brews
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Ethiopian Yirgacheffe V60', 'ethiopian-yirgacheffe-v60', 'Floral jasmine aroma with bergamot and delicate peach finish.', 38000, 'BDT', ARRAY['Washed Ethiopian Heirloom Coffee'], true, true),
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Colombian Geisha Pour-Over', 'colombian-geisha-pour-over', 'Exquisite rare lot featuring tropical papaya notes and honeyed lemongrass acidity.', 55000, 'BDT', ARRAY['Colombian Geisha Arabica'], true, true),
    ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Guatemalan Huehuetenango Aeropress', 'guatemalan-aeropress', 'Full-bodied cup brimming with milk chocolate, toasted pecan, and crisp red apple.', 34000, 'BDT', ARRAY['Guatemalan Bourbon/Caturra'], true, false),
    ('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002', 'Kyoto Slow Drip Reserve', 'kyoto-slow-drip-reserve', 'Extracted drop by drop over 12 hours. Silky mouthfeel with cognac-like depth.', 42000, 'BDT', ARRAY['Single Origin Arabica', 'Cold Filtered Water'], true, false),

    -- Chilled & Iced
    ('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000003', 'Nitro Cold Brew Silk', 'nitro-cold-brew-silk', 'Steeped for 20 hours and infused with pure nitrogen for a creamy, stout-like head.', 36000, 'BDT', ARRAY['House Cold Brew', 'Nitrogen'], true, true),
    ('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000003', 'Iced Spanish Latte', 'iced-spanish-latte', 'Chilled espresso over sweet condensed milk and cold fresh milk over artisanal ice.', 32000, 'BDT', ARRAY['Espresso', 'Condensed Milk', 'Fresh Milk', 'Ice'], true, false),
    ('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000003', 'Cascara Sparkling Tonic', 'cascara-sparkling-tonic', 'Fizzy infusion of brewed coffee cherry husk, citrus zest, and botanical tonic.', 30000, 'BDT', ARRAY['Organic Cascara', 'Tonic Water', 'Fresh Orange Slice'], true, false),
    ('b0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000003', 'Iced Oat Caramel Macchiato', 'iced-oat-caramel-macchiato', 'Creamy oat milk poured over homemade salted butterscotch caramel and espresso.', 38000, 'BDT', ARRAY['Espresso', 'Oat Milk', 'House Salted Caramel'], true, false),

    -- Bakery & Treats
    ('b0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000004', 'Double Butter French Croissant', 'double-butter-french-croissant', 'Flaky, 72-layer golden lamination made with Normandy butter.', 22000, 'BDT', ARRAY['French Flour', 'Normandy Butter', 'Sea Salt'], true, false),
    ('b0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000004', 'Dark Chocolate Pain au Chocolat', 'dark-chocolate-pain-au-chocolat', 'Filled with two batons of bittersweet 64% Valrhona chocolate.', 26000, 'BDT', ARRAY['Laminated Dough', '64% Valrhona Dark Chocolate'], true, true),
    ('b0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000004', 'Espresso Salted Caramel Brownie', 'espresso-salted-caramel-brownie', 'Fudgy chocolate brownie swirled with concentrated espresso and Maldon salt.', 25000, 'BDT', ARRAY['Dark Cocoa', 'Espresso', 'Caramel', 'Maldon Flakes'], true, false),
    ('b0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000004', 'Almond Frangipane Tart', 'almond-frangipane-tart', 'Crisp butter pastry crust topped with velvety almond cream and toasted slices.', 28000, 'BDT', ARRAY['Almond Meal', 'Sweet Pastry Crust', 'Vanilla'], true, false),
    ('b0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000004', 'Cinnamon Cardamom Brioche Bun', 'cinnamon-cardamom-brioche-bun', 'Warm spiced Swedish-style brioche knot rolled in coarse pearl sugar.', 20000, 'BDT', ARRAY['Enriched Brioche', 'Ceylon Cinnamon', 'Green Cardamom'], true, false),

    -- Whole Bean Retail
    ('b0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000005', 'Chocobliss Signature Roast (250g)', 'chocobliss-signature-roast-250g', 'Our flagship espresso blend. Notes of dark chocolate truffle, praline, and cherry.', 110000, 'BDT', ARRAY['100% Arabica Specialty Beans'], true, true),
    ('b0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000005', 'Ethiopia Sidamo Natural (250g)', 'ethiopia-sidamo-natural-250g', 'Sun-dried natural process. Intense blueberry, lavender florals, and honey sweetness.', 135000, 'BDT', ARRAY['Single Origin Natural Ethiopian Arabica'], true, false),
    ('b0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000005', 'Costa Rica Tarrazu Honey Process (250g)', 'costa-rica-tarrazu-250g', 'Red honey processed lot with juicy mandarin orange and golden syrup finish.', 140000, 'BDT', ARRAY['Costa Rican Caturra/Catuai'], true, false),
    ('b0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000005', 'Swiss Water Decaf Reserve (250g)', 'swiss-water-decaf-reserve-250g', '100% chemical-free decaffeination preserving rich milk chocolate and roasted almond notes.', 120000, 'BDT', ARRAY['Swiss Water Decaffeinated Arabica'], true, false)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_minor = EXCLUDED.price_minor,
    currency = EXCLUDED.currency,
    ingredients = EXCLUDED.ingredients,
    is_available = EXCLUDED.is_available,
    is_featured = EXCLUDED.is_featured;

-- 3. Insert Site Content
INSERT INTO public.site_content (content_key, content, published)
VALUES
    ('hero_section', '{
        "title": "Where Artisanal Roast Meets Pure Chocolate Indulgence",
        "subtitle": "Immerse yourself in small-batch specialty coffee and handcrafted cocoa confections, meticulously brewed in the heart of Dhaka.",
        "cta_text": "Explore Menu",
        "cta_link": "/products",
        "secondary_cta_text": "Our Story",
        "secondary_cta_link": "/about"
    }'::jsonb, true),
    ('store_info', '{
        "hours": "Daily 8:00 AM – 10:00 PM",
        "address": "House 14, Road 7, Banani, Dhaka, Bangladesh",
        "phone": "+880 1700 000000",
        "email": "contact@chocoblisscoffee.com"
    }'::jsonb, true),
    ('story_section', '{
        "heading": "Crafted with Obsession",
        "subheading": "From single-origin harvest to velvety finish",
        "body": "Every cup of Chocobliss begins with direct-trade relationships with organic micro-lot growers. Roasted fresh in our dedicated atelier, our blends marry vibrant fruity acidity with luscious cacao depth."
    }'::jsonb, true)
ON CONFLICT (content_key) DO UPDATE SET
    content = EXCLUDED.content,
    published = EXCLUDED.published;

-- 4. Insert Testimonials
INSERT INTO public.testimonials (name, quote, role_or_context, is_published, sort_order)
VALUES
    ('Tahmidur Rahman', 'The Chocobliss Mocha Luxe redefined specialty coffee for me. The 72% Belgian ganache melts seamlessly with the espresso.', 'Architect & Coffee Enthusiast', true, 1),
    ('Nusrat Jahan', 'Easily the most sophisticated coffee shop atmosphere in the city. The Ethiopian V60 pour-over is unbeatably clear and aromatic.', 'Food & Culture Critic', true, 2),
    ('Fahim Al-Islam', 'Their whole bean roast is my everyday morning ritual now. Consistency, freshness, and unbeatable chocolate undertones.', 'Creative Director', true, 3)
ON CONFLICT DO NOTHING;

COMMIT;
