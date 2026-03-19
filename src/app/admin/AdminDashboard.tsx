'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Package, Tag, TrendingUp, AlertTriangle, Edit, Eye, Plus, BarChart3, LogOut, ShoppingBag, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';
import { Product, Category, Order, OrderStatus } from '@/lib/types';
import { updateOrderStatus } from '@/lib/services/api';

interface AdminDashboardProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialOrders: Order[];
}

export default function AdminDashboard({ initialProducts: products, initialCategories: categories, initialOrders }: AdminDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories'>('dashboard');
    const [loggingOut, setLoggingOut] = useState(false);
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const totalProducts = products.filter(p => p.is_active).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock_meters, 0);
    const avgPrice = products.reduce((sum, p) => sum + p.price_per_meter, 0) / products.length;
    const lowStockProducts = products.filter(p => p.stock_meters < 100);

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/giris');
        router.refresh();
    };

    const handleStatusChage = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            router.refresh();
        } catch (error) {
            alert('Durum güncellenirken hata oluştu');
        }
    };

    const generateUpsLabel = async (order: Order) => {
        try {
            const res = await fetch('/api/admin/shipping/ups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            const data = await res.json();
            if (data.success && data.labelBase64) {
                // Update local UI
                setOrders(prev => prev.map(o => o.id === order.id ? { ...o, tracking_number: data.trackingNumber, status: 'shipped' } : o));
                
                // Show label in new tab
                const blob = new Blob([Uint8Array.from(atob(data.labelBase64), c => c.charCodeAt(0))], { type: 'image/gif' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                alert(`UPS Hatası: ${data.error}`);
            }
        } catch (err) {
            alert('Bağlantı hatası.');
        }
    };

    return (
        <div className="min-h-screen bg-surface-100">
            {/* Admin Header */}
            <div className="bg-white border-b border-surface-200">
                <div className="container-main flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-surface-400 hover:text-primary-600 transition-colors">
                            ← Siteye Dön
                        </Link>
                        <h1 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            Admin Panel
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        <LogOut size={16} />
                        {loggingOut ? 'Çıkılıyor...' : 'Çıkış Yap'}
                    </button>
                </div>
            </div>

            <div className="container-main py-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-8 w-fit">
                    {[
                        { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
                        { id: 'orders' as const, label: 'Siparişler', icon: ShoppingBag },
                        { id: 'products' as const, label: 'Ürünler', icon: Package },
                        { id: 'categories' as const, label: 'Kategoriler', icon: Tag },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-primary-500 text-white shadow-sm'
                                : 'text-surface-600 hover:text-surface-800 hover:bg-surface-50'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon={Package} label="Aktif Ürün" value={totalProducts.toString()} color="primary" />
                            <StatCard icon={Tag} label="Kategori" value={categories.length.toString()} color="orange" />
                            <StatCard icon={TrendingUp} label="Ort. Fiyat/m" value={formatPrice(avgPrice)} color="green" />
                            <StatCard icon={AlertTriangle} label="Düşük Stok" value={lowStockProducts.length.toString()} color="red" />
                        </div>

                        {/* Low Stock Warning */}
                        {lowStockProducts.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-amber-500" />
                                    Düşük Stok Uyarısı
                                </h3>
                                <div className="space-y-2">
                                    {lowStockProducts.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                                            <span className="text-sm text-surface-700">{p.name}</span>
                                            <span className="text-sm font-semibold text-amber-600">{p.stock_meters}m kaldı</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-surface-800 mb-4">Toplam Stok</h3>
                            <div className="text-3xl font-bold text-primary-600">
                                {totalStock.toLocaleString('tr-TR')} metre
                            </div>
                            <p className="text-sm text-surface-400 mt-1">Tüm ürünlerin toplam stok miktarı</p>
                        </div>
                    </div>
                )}

                {/* Products */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-surface-800">{products.length} Ürün</h2>
                            <Link href="/admin/urunler/yeni" className="btn btn-primary btn-sm">
                                <Plus size={16} />
                                Ürün Ekle
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-surface-100">
                                            <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Ürün</th>
                                            <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Kategori</th>
                                            <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Fiyat/m</th>
                                            <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Stok</th>
                                            <th className="text-center text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Durum</th>
                                            <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => {
                                            const cat = categories.find(c => c.id === product.category_id);
                                            return (
                                                <tr key={product.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex-shrink-0"
                                                                style={{
                                                                    background: `linear-gradient(135deg, ${product.colors[0]?.hex || '#e5e5e5'}33, ${product.colors[0]?.hex || '#e5e5e5'}66)`,
                                                                }}
                                                            />
                                                            <div>
                                                                <div className="text-sm font-medium text-surface-800">{product.name}</div>
                                                                <div className="text-xs text-surface-400">{product.composition}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-surface-600">{cat?.name || '-'}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-surface-800 text-right">
                                                        {formatPrice(product.price_per_meter)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`text-sm font-medium ${product.stock_meters < 100 ? 'text-amber-600' : 'text-surface-700'}`}>
                                                            {product.stock_meters}m
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`badge ${product.is_active ? 'badge-stock' : 'bg-surface-200 text-surface-600'}`}>
                                                            {product.is_active ? 'Aktif' : 'Pasif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Link
                                                                href={`/urun/${product.slug}`}
                                                                className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                                title="Görüntüle"
                                                            >
                                                                <Eye size={16} />
                                                            </Link>
                                                            <button
                                                                className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                                title="Düzenle (Yakında)"
                                                                disabled
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-surface-800">{orders.length} Sipariş</h2>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-surface-100">
                                            <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Sipariş ID</th>
                                            <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Müşteri</th>
                                            <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Tarih</th>
                                            <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Tutar</th>
                                            <th className="text-center text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">Durum</th>
                                            <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-surface-800">
                                                    #{order.id.split('-')[0].toUpperCase()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-surface-800">{order.customer_name}</div>
                                                    <div className="text-xs text-surface-400">{order.customer_phone}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-surface-600">
                                                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold text-primary-600 text-right">
                                                    {formatPrice(order.total_amount)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChage(order.id, e.target.value as OrderStatus)}
                                                        className={`text-xs font-semibold rounded-lg px-2 py-1 outline-none border cursor-pointer
                                                            ${order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            order.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            order.status === 'preparing' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                            order.status === 'shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                            order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                                        }`}
                                                    >
                                                        <option value="pending">Bekliyor</option>
                                                        <option value="confirmed">Onaylandı</option>
                                                        <option value="preparing">Hazırlanıyor</option>
                                                        <option value="shipped">Kargoya Verildi</option>
                                                        <option value="delivered">Teslim Edildi</option>
                                                        <option value="cancelled">İptal Edildi</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {order.tracking_number ? (
                                                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium" title="Kargo Takip No">
                                                                {order.tracking_number}
                                                            </span>
                                                        ) : order.shipping_method?.toLowerCase().includes('ups') ? (
                                                            <button
                                                                className="text-xs flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-1 rounded-md font-medium transition-colors border border-amber-200"
                                                                onClick={() => generateUpsLabel(order)}
                                                                title="UPS Barkodu Oluştur"
                                                            >
                                                                <Truck size={14} />
                                                                UPS Barkod
                                                            </button>
                                                        ) : null}

                                                        <button
                                                            className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                            title="Sipariş Detayı"
                                                            onClick={() => alert(`Detay:\n\nKargo: ${order.shipping_method}\nAdres: ${order.shipping_address.city}/${order.shipping_address.district}\nKalemler: ${order.items?.length || 0} ürün\nNot: ${order.notes || 'Yok'}`)}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-surface-400">
                                                    Henüz sipariş bulunmuyor.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories */}
                {activeTab === 'categories' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((cat) => {
                            const productCount = products.filter(p => p.category_id === cat.id && p.is_active).length;
                            return (
                                <div key={cat.id} className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-surface-800">{cat.name}</h3>
                                        <span className="badge bg-primary-100 text-primary-700">{productCount} ürün</span>
                                    </div>
                                    <p className="text-sm text-surface-500 mb-4 line-clamp-2">{cat.description}</p>
                                    <Link
                                        href={`/kategori/${cat.slug}`}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Ürünleri Gör →
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ComponentType<{ size: number; className?: string }>;
    label: string;
    value: string;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        primary: 'bg-primary-100 text-primary-600',
        orange: 'bg-amber-100 text-amber-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                    <Icon size={20} />
                </div>
                <span className="text-sm text-surface-500">{label}</span>
            </div>
            <div className="text-2xl font-bold text-surface-800">{value}</div>
        </div>
    );
}
