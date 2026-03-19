import { supabase } from '../supabase';
import { Category, Product } from '../types';

export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'product_count'>): Promise<Category> {
    const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();
        
    if (error) {
        console.error('Error creating category:', error);
        throw error;
    }
    
    return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching category:', error);
        return null;
    }
    return data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching category by id:', error);
        return null;
    }
    return data;
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
    return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching product by slug:', error);
        return null;
    }
    return data;
}

export async function createOrder(orderData: Omit<import('../types').Order, 'id' | 'created_at' | 'items'>, items: Omit<import('../types').OrderItem, 'id' | 'order_id'>[]): Promise<{ id: string } | null> {
    // 1. Insert Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            order_number: `KV-${Date.now()}`,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            customer_email: orderData.customer_email || null,
            status: orderData.status,
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shipping_cost,
            total_amount: orderData.total_amount,
            shipping_address: orderData.shipping_address,
            shipping_method: orderData.shipping_method,
            payment_status: orderData.payment_status,
            payment_method: orderData.payment_method || 'whatsapp',
            notes: orderData.notes || null,
        })
        .select()
        .single();

    if (orderError || !order) {
        console.error('Error creating order:', orderError);
        return null;
    }

    // 2. Insert Order Items
    const orderItemsToInsert = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.selected_color ? `${item.product_name} (${item.selected_color})` : item.product_name,
        meters: item.meters,
        unit_price: item.unit_price,
        total_price: item.total_price
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // We should ideally rollback or use an RPC function for transactions,
        // but for now, we just return the order ID and log the error.
    }

    return { id: order.id };
}

export async function getOrders(): Promise<import('../types').Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
    return data || [];
}

export async function updateOrderStatus(orderId: string, status: import('../types').OrderStatus) {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}
