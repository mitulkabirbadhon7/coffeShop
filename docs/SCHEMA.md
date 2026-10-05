# Chocobliss — Database Schema

## 1. Principles
- PostgreSQL via Supabase.
- UUID primary keys.
- `created_at` and `updated_at` where appropriate.
- RLS enabled on every application table.
- Foreign keys enforced.
- Monetary values use integer minor units or a documented numeric strategy; do not use floating-point currency.
- Product deletion is soft deletion.

## 2. Core Tables

### profiles
- `id uuid PK` — references `auth.users.id`
- `display_name text`
- `avatar_url text nullable`
- `role user_role NOT NULL DEFAULT 'USER'`
- `created_at timestamptz`
- `updated_at timestamptz`

### addresses
- `id uuid PK`
- `user_id uuid FK profiles.id`
- `label text`
- `recipient_name text`
- `phone text`
- `line1 text`
- `line2 text nullable`
- `city text`
- `postal_code text`
- `country text`
- `is_default boolean`
- timestamps

### product_categories
- `id uuid PK`
- `name text`
- `slug text UNIQUE`
- `description text nullable`
- `sort_order integer`
- `created_at`
- `updated_at`

### products
- `id uuid PK`
- `category_id uuid FK product_categories.id`
- `name text`
- `slug text UNIQUE`
- `description text`
- `price_minor integer`
- `currency text`
- `image_path text nullable`
- `ingredients text[] nullable`
- `is_available boolean`
- `is_featured boolean`
- `deleted_at timestamptz nullable`
- `created_at`
- `updated_at`

### orders
- `id uuid PK`
- `user_id uuid FK profiles.id`
- `status order_status`
- `currency text`
- `subtotal_minor integer`
- `total_minor integer`
- `notes text nullable`
- `created_at`
- `updated_at`

### order_items
- `id uuid PK`
- `order_id uuid FK orders.id`
- `product_id uuid FK products.id`
- `product_name_snapshot text`
- `unit_price_minor integer`
- `quantity integer`
- `line_total_minor integer`
- `created_at`

Snapshots are required so historical orders do not change when products are renamed or repriced.

### site_content
- `id uuid PK`
- `content_key text UNIQUE`
- `content jsonb`
- `published boolean`
- `updated_by uuid FK profiles.id nullable`
- timestamps

### testimonials
- `id uuid PK`
- `name text`
- `quote text`
- `role_or_context text nullable`
- `image_path text nullable`
- `is_published boolean`
- `sort_order integer`
- timestamps

### newsletter_subscribers
- `id uuid PK`
- `email text UNIQUE`
- `subscribed_at timestamptz`
- `unsubscribed_at timestamptz nullable`

### contact_messages
- `id uuid PK`
- `name text`
- `email text`
- `subject text`
- `message text`
- `status contact_status`
- `created_at`
- `updated_at`

### audit_logs
- `id uuid PK`
- `actor_id uuid FK profiles.id nullable`
- `action text`
- `entity_type text`
- `entity_id uuid nullable`
- `metadata jsonb nullable`
- `created_at timestamptz`

## 3. Enums

```text
user_role:
USER
ADMIN

order_status:
PENDING
CONFIRMED
PREPARING
READY
COMPLETED
CANCELLED

contact_status:
UNREAD
READ
RESOLVED
```

## 4. Order Transition Rules

Allowed:
- PENDING → CONFIRMED
- CONFIRMED → PREPARING
- PREPARING → READY
- READY → COMPLETED
- PENDING → CANCELLED
- CONFIRMED → CANCELLED

Invalid transitions must be rejected server-side.

## 5. RLS Summary

Profiles:
- user reads/updates own profile
- admins can read appropriate user records

Addresses:
- owner CRUD
- admins may read if required by business operations

Orders:
- owner SELECT
- authorized server/admin operations only for status changes
- cross-user access denied

Order items:
- accessible only through authorized order access

Products/categories:
- public SELECT only for active/published records
- admin mutations

Site content:
- public SELECT only for published content
- admin mutations

Testimonials:
- public SELECT published records
- admin mutations

Newsletter:
- public INSERT under rate limits
- no public SELECT

Contact messages:
- public INSERT under rate limits
- admin SELECT/UPDATE

Audit logs:
- admin SELECT
- server-side INSERT for authorized actions
- no public access

## 6. Indexing
Index:
- foreign keys
- unique slugs
- order `user_id`
- order `status`
- order `created_at`
- product `category_id`
- product `is_featured`
- product `deleted_at`
- contact `status`
- audit `actor_id`
- audit `created_at`

Exact indexes should be finalized after query patterns are implemented.
