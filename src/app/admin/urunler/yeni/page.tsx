import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import AdminProductNew from './AdminProductNew';

export default async function AdminProductNewPage() {
    const isAuthenticated = await isAdminAuthenticated();
    
    if (!isAuthenticated) {
        redirect('/admin/giris');
    }

    return <AdminProductNew />;
}
