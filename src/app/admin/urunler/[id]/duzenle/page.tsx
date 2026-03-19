import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import AdminProductEdit from './AdminProductEdit';
import { Product } from '@/lib/types';

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
    const isAuthenticated = await isAdminAuthenticated();
    
    if (!isAuthenticated) {
        redirect('/admin/giris');
    }

    // Fetch the product to edit
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !product) {
        return (
            <div className="min-h-screen bg-surface-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-surface-800 mb-2">Ürün Bulunamadı</h1>
                    <p className="text-surface-500 mb-4">Düzenlemeye çalıştığınız ürün sistemde mevcut değil.</p>
                    <a href="/admin" className="btn btn-primary">Admin Paneline Dön</a>
                </div>
            </div>
        );
    }

    return <AdminProductEdit product={product as Product} />;
}
