'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Plus, X, Eye } from 'lucide-react';

interface ProductForm {
    name: string;
    slug: string;
    category_id: string;
    description: string;
    price_per_meter: string;
    original_price: string;
    min_order_meters: string;
    stock_meters: string;
    width_cm: string;
    weight_gsm: string;
    composition: string;
    colors: { name: string; hex: string }[];
    images: string[];
    is_active: boolean;
    is_featured: boolean;
}

const emptyForm: ProductForm = {
    name: '',
    slug: '',
    category_id: '',
    description: '',
    price_per_meter: '',
    original_price: '',
    min_order_meters: '1',
    stock_meters: '',
    width_cm: '150',
    weight_gsm: '',
    composition: '',
    colors: [{ name: '', hex: '#000000' }],
    images: [],
    is_active: true,
    is_featured: false,
};

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function AdminProductNew() {
    const [form, setForm] = useState<ProductForm>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [saveResult, setSaveResult] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch('/api/admin/categories')
            .then(res => res.json())
            .then(data => {
                if (data.categories) setCategories(data.categories);
            })
            .catch(() => {});
    }, []);

    const updateField = (field: keyof ProductForm, value: string | boolean) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value };
            // Auto-generate slug from name
            if (field === 'name' && typeof value === 'string') {
                updated.slug = slugify(value);
            }
            return updated;
        });
    };

    const addColor = () => {
        setForm((prev) => ({
            ...prev,
            colors: [...prev.colors, { name: '', hex: '#000000' }],
        }));
    };

    const removeColor = (index: number) => {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index),
        }));
    };

    const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveResult(null);
        setErrorMessage('');

        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price_per_meter: parseFloat(form.price_per_meter),
                    original_price: form.original_price ? parseFloat(form.original_price) : null,
                    min_order_meters: parseFloat(form.min_order_meters),
                    stock_meters: parseFloat(form.stock_meters),
                    width_cm: parseInt(form.width_cm),
                    weight_gsm: parseInt(form.weight_gsm),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSaveResult('success');
                setForm(emptyForm);
            } else {
                setSaveResult('error');
                setErrorMessage(data.error || 'Bilinmeyen hata');
            }
        } catch (err) {
            setSaveResult('error');
            setErrorMessage(err instanceof Error ? err.message : 'Bağlantı hatası');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-100">
            {/* Header */}
            <div className="bg-white border-b border-surface-200">
                <div className="container-main flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-sm text-surface-400 hover:text-primary-600 transition-colors flex items-center gap-1">
                            <ArrowLeft size={16} />
                            Admin Panel
                        </Link>
                    </div>
                    <h1 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                        Yeni Ürün Ekle
                    </h1>
                    <div />
                </div>
            </div>

            <div className="container-main py-8 max-w-3xl">
                {saveResult === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 flex items-center gap-3">
                        ✅ Ürün başarıyla kaydedildi!
                        <Link href="/admin" className="ml-auto text-sm font-medium text-green-600 hover:underline">
                            Ürünlere Dön
                        </Link>
                    </div>
                )}
                {saveResult === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
                        ❌ {errorMessage || 'Hata oluştu.'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            Temel Bilgiler
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Ürün Adı *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ör: Royal Kadife - Bordo"
                                    value={form.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Slug (otomatik)</label>
                                <input
                                    type="text"
                                    className="input bg-surface-50"
                                    value={form.slug}
                                    onChange={(e) => updateField('slug', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-surface-700 mb-1.5 block">Kategori *</label>
                            <select
                                className="input"
                                value={form.category_id}
                                onChange={(e) => updateField('category_id', e.target.value)}
                                required
                            >
                                <option value="">Kategori Seçin</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-surface-700 mb-1.5 block">Açıklama</label>
                            <textarea
                                className="input min-h-[100px] resize-y"
                                placeholder="Ürün açıklaması..."
                                value={form.description}
                                onChange={(e) => updateField('description', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            Fiyat & Stok
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Fiyat/Metre (₺) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    placeholder="189.90"
                                    value={form.price_per_meter}
                                    onChange={(e) => updateField('price_per_meter', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Eski Fiyat (₺)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    placeholder="İndirim varsa"
                                    value={form.original_price}
                                    onChange={(e) => updateField('original_price', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Min. Sipariş (m)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    className="input"
                                    value={form.min_order_meters}
                                    onChange={(e) => updateField('min_order_meters', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Stok (m) *</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="250"
                                    value={form.stock_meters}
                                    onChange={(e) => updateField('stock_meters', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specs */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            Teknik Özellikler
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">En (cm)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={form.width_cm}
                                    onChange={(e) => updateField('width_cm', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Ağırlık (g/m²)</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="320"
                                    value={form.weight_gsm}
                                    onChange={(e) => updateField('weight_gsm', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Karışım</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="100% Pamuk"
                                    value={form.composition}
                                    onChange={(e) => updateField('composition', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                                Renkler
                            </h2>
                            <button type="button" onClick={addColor} className="btn btn-secondary btn-sm">
                                <Plus size={14} />
                                Renk Ekle
                            </button>
                        </div>

                        <div className="space-y-3">
                            {form.colors.map((color, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={color.hex}
                                        onChange={(e) => updateColor(i, 'hex', e.target.value)}
                                        className="w-10 h-10 rounded-lg border border-surface-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        className="input flex-1"
                                        placeholder="Renk adı (ör: Bordo)"
                                        value={color.name}
                                        onChange={(e) => updateColor(i, 'name', e.target.value)}
                                    />
                                    {form.colors.length > 1 && (
                                        <button type="button" onClick={() => removeColor(i)} className="p-2 text-surface-400 hover:text-red-500">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            Seçenekler
                        </h2>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => updateField('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-surface-700">Aktif (satışta)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => updateField('is_featured', e.target.checked)}
                                    className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-surface-700">Öne Çıkan</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn btn-primary btn-lg flex-1"
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Kaydediliyor...
                                </span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Ürünü Kaydet
                                </>
                            )}
                        </button>
                        <Link href="/admin" className="btn btn-secondary btn-lg">
                            İptal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
