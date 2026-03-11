import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
    const isAuthenticated = await isAdminAuthenticated();
    
    if (!isAuthenticated) {
        redirect('/admin/giris');
    }

    return <AdminDashboard />;
}
