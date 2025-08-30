// Supabase setup (replace placeholders before deploying)
//

// const STORAGE_BUCKET = 'product-images'; // optional
// const CURRENT_USER_ID = 'user_demo_123'; // replace with real auth.user.id
//
// Suggested DB schema for reference:
//
// create table if not exists products (
//   id uuid primary key default gen_random_uuid(),
//   owner_id text not null,
//   name text not null,
//   variety text,
//   description text,
//   price_per_unit numeric not null,
//   unit text not null check (unit in ('kg','ton','crate')),
//   quantity numeric not null default 0,
//   location text not null,
//   status text not null check (status in ('active','paused','sold_out')) default 'active',
//   image_url text,
//   created_at timestamp with time zone default now(),
//   updated_at timestamp with time zone default now()
// );
//
// alter table products enable row level security;
// create policy "products_select_own" on products for select using (auth.uid()::text = owner_id);
// create policy "products_insert_own" on products for insert with check (auth.uid()::text = owner_id);
// create policy "products_update_own" on products for update using (auth.uid()::text = owner_id);
// create policy "products_delete_own" on products for delete using (auth.uid()::text = owner_id);
//
// Storage bucket (optional): product-images

// Export a Supabase client and constants. Assumes the CDN script is loaded on the page.
const SUPABASE_URL = "https://moozvhfbkhbepmjadijj.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vb3p2aGZia2hiZXBtamFkaWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4OTM3ODksImV4cCI6MjA3MDQ2OTc4OX0.ddOMSI8ypunP-h-_P0B11jWyj-X8cC3O8BJMqeH5Uj4";
const STORAGE_BUCKET = "product-images";
const CURRENT_USER_ID = "user_demo_123";

if (!window.supabase) {
    console.warn(
        "Supabase CDN not loaded yet. Ensure the CDN script tag is included before this module."
    );
}

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { CURRENT_USER_ID, STORAGE_BUCKET, supabase };
