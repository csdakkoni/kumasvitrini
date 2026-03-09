// ==========================================
// Kumaş E-Ticaret - TypeScript Types
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  sort_order: number;
  product_count?: number;
}

export interface Product {
  id: string;
  category_id: string;
  category?: Category;
  name: string;
  slug: string;
  description: string;
  price_per_meter: number; // TL/metre
  original_price?: number; // İndirimli ürünler için orijinal fiyat
  min_order_meters: number;
  stock_meters: number;
  width_cm: number;
  weight_gsm: number; // gram/m²
  composition: string; // "100% Pamuk", "%80 Polyester %20 Pamuk"
  colors: ProductColor[];
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image_url?: string;
}

export interface CartItem {
  product: Product;
  meters: number;
  selectedColor?: string;
}

export interface CartState {
  items: CartItem[];
  totalMeters: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  status: OrderStatus;
  total_amount: number;
  shipping_cost: number;
  shipping_address: ShippingAddress;
  shipping_method: string;
  tracking_number?: string;
  payment_status: PaymentStatus;
  payment_id?: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  meters: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district: string;
  postal_code: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

// Admin types
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
}
