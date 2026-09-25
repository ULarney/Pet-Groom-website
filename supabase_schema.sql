-- ============================================================
-- Pet & Groom – Complete Supabase Schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- It is safe to re-run (uses IF NOT EXISTS + DROP IF EXISTS)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. PRODUCTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT          NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  stock       INTEGER       NOT NULL DEFAULT 0,
  image       TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 2. PROFILES  (one row per auth.users row)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id   UUID  REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT  DEFAULT 'client'   -- 'client' | 'admin'
);

-- ──────────────────────────────────────────────────────────────
-- 3. PETS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pets (
  id         BIGSERIAL   PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  type       TEXT        DEFAULT 'Unknown',
  breed      TEXT,
  age        INTEGER,
  age_unit   TEXT        DEFAULT 'years',
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 4. BOOKINGS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id         BIGSERIAL   PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id     BIGINT      REFERENCES public.pets(id) ON DELETE CASCADE,
  service    TEXT        NOT NULL,
  date       DATE        NOT NULL,
  time       TEXT        NOT NULL,
  notes      TEXT,
  status     TEXT        DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 5. ORDERS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id           BIGSERIAL    PRIMARY KEY,
  user_id      UUID         REFERENCES auth.users(id) ON DELETE CASCADE,
  items        JSONB        NOT NULL,
  total        NUMERIC(10,2) NOT NULL,
  instructions TEXT,
  status       TEXT         DEFAULT 'pending',
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 6. AUTO-CREATE PROFILE ON SIGNUP (trigger)
--    When a user registers (via our backend or any path),
--    a profile row is created automatically.
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Pet Parent'),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY (RLS)
--    Enable on every table so anonymous callers cannot bypass.
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders   ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- 8. RLS POLICIES
-- ──────────────────────────────────────────────────────────────

-- PRODUCTS ── public read, service-role write (admin backend)
DROP POLICY IF EXISTS "Public Read Products"         ON public.products;
DROP POLICY IF EXISTS "Service Role Manage Products" ON public.products;

CREATE POLICY "Public Read Products"
  ON public.products FOR SELECT USING (true);

-- The Express server uses the service-role key which bypasses RLS by default,
-- so no extra policy is needed for INSERT/UPDATE/DELETE from the backend.
-- If you ever use the anon key for admin writes, add a policy here.


-- PROFILES ── user reads/updates their own row; service-role can do all
DROP POLICY IF EXISTS "Users Read Own Profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users Update Own Profile" ON public.profiles;

CREATE POLICY "Users Read Own Profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users Update Own Profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- PETS ── user manages their own pets; service-role bypasses automatically
DROP POLICY IF EXISTS "Users Manage Own Pets" ON public.pets;

CREATE POLICY "Users Manage Own Pets"
  ON public.pets FOR ALL USING (auth.uid() = user_id);


-- BOOKINGS ── user manages their own bookings
DROP POLICY IF EXISTS "Users Manage Own Bookings" ON public.bookings;

CREATE POLICY "Users Manage Own Bookings"
  ON public.bookings FOR ALL USING (auth.uid() = user_id);


-- ORDERS ── user manages their own orders
DROP POLICY IF EXISTS "Users Manage Own Orders" ON public.orders;

CREATE POLICY "Users Manage Own Orders"
  ON public.orders FOR ALL USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────
-- Done!  All 5 tables are now created and secured.
-- The Express backend (service-role key) bypasses RLS automatically,
-- so it can read/write any row without needing special policies.
-- ──────────────────────────────────────────────────────────────
