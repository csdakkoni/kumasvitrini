import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import AdminDashboard from './AdminDashboard';
import { getProducts, getCategories, getOrders } from '@/lib/services/api';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const isAuthenticated = await isAdminAuthenticated();
    
    if (!isAuthenticated) {
        redirect('/admin/giris');
    }

    const [products, categories, orders] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
    ]);

    return <AdminDashboard initialProducts={products} initialCategories={categories} initialOrders={orders} />;
}
