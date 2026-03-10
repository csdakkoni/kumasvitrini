'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories, getProductCategory } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import { Package, Tag, TrendingUp, AlertTriangle, Edit, Eye, Plus, BarChart3 } from 'lucide-react';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories'>('dashboard');

    const totalProducts = products.filter(p => p.is_active).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock_meters, 0);
    const avgPrice = products.reduce((sum, p) => sum + p.price_per_meter, 0) / products.length;
    const lowStockProducts = products.filter(p => p.stock_meters < 100);

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
                </div>
            </div>

            <div className="container-main py-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-8 w-fit">
                    {[
                        { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
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
                                            const cat = getProductCategory(product);
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
