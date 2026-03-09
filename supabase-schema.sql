-- =============================================
-- Kumaş E-Ticaret - Supabase Database Schema
-- =============================================
-- Bu SQL dosyasını Supabase SQL Editor'de çalıştırın.

-- 1. Kategoriler
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ürünler
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_per_meter NUMERIC(10,2) NOT NULL,        -- TL/metre
  original_price NUMERIC(10,2),                    -- İndirimli ürünlerde orijinal fiyat
  min_order_meters NUMERIC(6,2) DEFAULT 1,         -- Minimum sipariş miktarı (metre)
  stock_meters NUMERIC(10,2) DEFAULT 0,            -- Stok miktarı (metre)
  width_cm INTEGER,                                 -- Kumaş eni (cm)
  weight_gsm INTEGER,                               -- Ağırlık (g/m²)
  composition TEXT,                                  -- Karışım (ör: "100% Pamuk")
  colors JSONB DEFAULT '[]'::jsonb,                 -- [{name, hex, image_url?}]
  images JSONB DEFAULT '[]'::jsonb,                 -- [url1, url2, ...]
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Kullanıcı Profilleri (Supabase Auth ile entegre)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  district TEXT,
  postal_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Siparişler
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,                -- Sipariş no (ör: KD-20250310-001)
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  
  -- Müşteri bilgileri
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Fiyatlar
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  
  -- Kargo
  shipping_address JSONB NOT NULL,                  -- {full_name, phone, address_line1, address_line2, city, district, postal_code}
  shipping_method TEXT DEFAULT 'standard',           -- standard, express
  tracking_number TEXT,
  
  -- Ödeme
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,                               -- iyzico, bank_transfer, cash_on_delivery
  payment_id TEXT,                                   -- iyzico payment ID
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Sipariş Kalemleri
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,                        -- Sipariş anındaki isim (ürün silinse bile korunur)
  product_slug TEXT,
  selected_color TEXT,
  meters NUMERIC(6,2) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,                 -- Sipariş anındaki birim fiyat
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INDEX'ler
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Kategoriler: Herkes okuyabilir, sadece admin yazabilir
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- Ürünler: Herkes aktif olanları okuyabilir, sadece admin yazabilir
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = true);

-- Profiller: Kullanıcı kendi profilini okuyabilir/yazabilir
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_read" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Siparişler: Kullanıcı kendi siparişlerini okuyabilir
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own_read" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true); -- Herkes sipariş verebilir

-- Sipariş kalemleri: Siparişe ait okuma
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_read" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- =============================================
-- ADMIN ROLE (Service Role üzerinden veya ayrı bir role)
-- =============================================
-- Not: Admin işlemleri için Supabase service_role key kullanın
-- veya aşağıdaki gibi bir admin tablosu oluşturun:

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin'ler tüm tabloları okuyabilir/yazabilir
CREATE POLICY "admin_full_categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "admin_full_products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "admin_full_orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "admin_full_order_items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Sipariş numarası oluştur
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  today_count INTEGER;
  new_number TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO today_count
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  new_number := 'KD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(today_count::TEXT, 3, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- SEED DATA (Başlangıç verisi)
-- =============================================
-- Aşağıdaki seed data'yı isteğe bağlı çalıştırın.

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Kadife', 'kadife', 'Yumuşak dokulu, premium kadife kumaşlar. Koltuk, perde ve giyim için ideal.', 1),
  ('Saten', 'saten', 'Parlak ve zarif saten kumaşlar. Abiye, gelinlik ve dekorasyon için.', 2),
  ('Pamuklu', 'pamuklu', 'Doğal pamuklu kumaşlar. Günlük giyim, ev tekstili ve bebek ürünleri için.', 3),
  ('Şifon', 'sifon', 'Hafif ve akışkan şifon kumaşlar. Elbise, şal ve dekoratif kullanım için.', 4),
  ('Keten', 'keten', 'Nefes alan, doğal keten kumaşlar. Yaz giyim ve ev dekorasyonu için.', 5),
  ('Polyester', 'polyester', 'Dayanıklı ve bakımı kolay polyester kumaşlar. Spor giyim ve döşemelik.', 6)
ON CONFLICT (slug) DO NOTHING;
