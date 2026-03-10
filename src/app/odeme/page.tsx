'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, User, Phone, Mail, ChevronRight, Lock, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice, calculateShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

type CheckoutStep = 'info' | 'shipping' | 'payment';

const SHIPPING_OPTIONS = [
    { id: 'yurtici', name: 'Yurtiçi Kargo', price: 49.90, days: '2-3 iş günü', logo: '📦' },
    { id: 'ups', name: 'UPS Kargo', price: 69.90, days: '1-2 iş günü', logo: '📬' },
    { id: 'aras', name: 'Aras Kargo', price: 44.90, days: '2-4 iş günü', logo: '🚚' },
];

export default function CheckoutPage() {
    const { items, isLoaded, totalPrice } = useCart();
    const [step, setStep] = useState<CheckoutStep>('info');
    const [selectedShipping, setSelectedShipping] = useState('yurtici');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        district: '',
        address: '',
        postalCode: '',
        notes: '',
    });

    if (!isLoaded) {
        return (
            <div className="py-20 text-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="py-20 text-center container-main">
                <p className="text-surface-500 mb-4">Sepetiniz boş</p>
                <Link href="/kategori" className="btn btn-primary">Alışverişe Başla</Link>
            </div>
        );
    }

    const shippingOption = SHIPPING_OPTIONS.find(s => s.id === selectedShipping)!;
    const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
    const shippingCost = isFreeShipping ? 0 : shippingOption.price;
    const grandTotal = totalPrice + shippingCost;

    const updateForm = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
        { id: 'info', label: 'Bilgiler', icon: User },
        { id: 'shipping', label: 'Kargo', icon: Truck },
        { id: 'payment', label: 'Ödeme', icon: CreditCard },
    ];

    return (
        <div className="py-8 sm:py-12">
            <div className="container-main max-w-4xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8">
                    <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
                    <span>/</span>
                    <Link href="/sepet" className="hover:text-primary-600">Sepet</Link>
                    <span>/</span>
                    <span className="text-surface-700 font-medium">Ödeme</span>
                </nav>

                {/* Steps indicator */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2">
                            <button
                                onClick={() => setStep(s.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${step === s.id
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-white text-surface-500 hover:text-surface-700'
                                    }`}
                            >
                                <s.icon size={16} />
                                {s.label}
                            </button>
                            {i < steps.length - 1 && <ChevronRight size={16} className="text-surface-300" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Area */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Contact & Address */}
                        {step === 'info' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-sm space-y-5"
                            >
                                <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                                    <User size={20} className="inline mr-2 text-primary-500" />
                                    Teslimat Bilgileri
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-surface-700 mb-1.5 block">Ad Soyad *</label>
                                        <input type="text" className="input" placeholder="Ad Soyad" value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-surface-700 mb-1.5 block">Telefon *</label>
                                        <input type="tel" className="input" placeholder="05XX XXX XX XX" value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)} required />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-surface-700 mb-1.5 block">E-posta</label>
                                    <input type="email" className="input" placeholder="ornek@email.com" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-surface-700 mb-1.5 block">İl *</label>
                                        <input type="text" className="input" placeholder="İstanbul" value={formData.city} onChange={(e) => updateForm('city', e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-surface-700 mb-1.5 block">İlçe *</label>
                                        <input type="text" className="input" placeholder="Kadıköy" value={formData.district} onChange={(e) => updateForm('district', e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-surface-700 mb-1.5 block">Posta Kodu</label>
                                        <input type="text" className="input" placeholder="34000" value={formData.postalCode} onChange={(e) => updateForm('postalCode', e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-surface-700 mb-1.5 block">Adres *</label>
                                    <textarea className="input min-h-[80px] resize-y" placeholder="Mahalle, sokak, bina no, daire no..." value={formData.address} onChange={(e) => updateForm('address', e.target.value)} required />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-surface-700 mb-1.5 block">Sipariş Notu</label>
                                    <textarea className="input min-h-[60px] resize-y" placeholder="Varsa eklemek istediğiniz not..." value={formData.notes} onChange={(e) => updateForm('notes', e.target.value)} />
                                </div>

                                <button onClick={() => setStep('shipping')} className="btn btn-primary w-full btn-lg">
                                    Kargo Seçimine Geç
                                    <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Shipping */}
                        {step === 'shipping' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-sm space-y-5"
                            >
                                <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                                    <Truck size={20} className="inline mr-2 text-primary-500" />
                                    Kargo Seçimi
                                </h2>

                                {isFreeShipping && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-medium">
                                        🎉 {formatPrice(FREE_SHIPPING_THRESHOLD)} üzeri siparişiniz olduğu için kargo ücretsiz!
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {SHIPPING_OPTIONS.map((option) => (
                                        <label
                                            key={option.id}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedShipping === option.id
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-surface-200 hover:border-surface-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={option.id}
                                                checked={selectedShipping === option.id}
                                                onChange={() => setSelectedShipping(option.id)}
                                                className="w-4 h-4 text-primary-500"
                                            />
                                            <span className="text-2xl">{option.logo}</span>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-surface-800">{option.name}</div>
                                                <div className="text-xs text-surface-400">{option.days}</div>
                                            </div>
                                            <div className="text-sm font-bold text-surface-800">
                                                {isFreeShipping ? (
                                                    <span className="text-green-600">Ücretsiz</span>
                                                ) : (
                                                    formatPrice(option.price)
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep('info')} className="btn btn-secondary flex-1">
                                        Geri
                                    </button>
                                    <button onClick={() => setStep('payment')} className="btn btn-primary flex-1 btn-lg">
                                        Ödemeye Geç
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 'payment' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-sm space-y-5"
                            >
                                <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                                    <CreditCard size={20} className="inline mr-2 text-primary-500" />
                                    Ödeme
                                </h2>

                                {/* iyzico placeholder */}
                                <div className="border-2 border-dashed border-surface-200 rounded-xl p-8 text-center">
                                    <Lock size={32} className="mx-auto text-surface-300 mb-3" />
                                    <p className="text-surface-500 font-medium mb-1">Güvenli Ödeme</p>
                                    <p className="text-sm text-surface-400 mb-4">
                                        iyzico altyapısı ile güvenli ödeme.<br />
                                        Kredi kartı, banka kartı ve sanal kart ile ödeme yapabilirsiniz.
                                    </p>
                                    <div className="bg-primary-50 rounded-lg p-4 text-sm text-primary-700 mb-4">
                                        ⚙️ iyzico entegrasyonu aktifleştirildiğinde burada ödeme formu görünecek.
                                    </div>
                                </div>

                                {/* WhatsApp fallback */}
                                <div className="border-t border-surface-100 pt-5">
                                    <p className="text-sm text-surface-500 text-center mb-3">
                                        veya WhatsApp ile sipariş verin
                                    </p>
                                    <a
                                        href={`https://wa.me/905XXXXXXXXX?text=${encodeURIComponent(
                                            `Sipariş vermek istiyorum:\n\n${items.map(i => `• ${i.product.name} - ${i.meters}m`).join('\n')}\n\nToplam: ${formatPrice(grandTotal)}\nKargo: ${shippingOption.name}\n\nTeslimat: ${formData.fullName}, ${formData.address}, ${formData.district}/${formData.city}`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-whatsapp w-full btn-lg"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        WhatsApp ile Sipariş Ver
                                    </a>
                                </div>

                                <button onClick={() => setStep('shipping')} className="btn btn-secondary w-full">
                                    Geri
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
                            <h3 className="text-lg font-bold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                <Package size={18} className="inline mr-2 text-primary-500" />
                                Sipariş Özeti
                            </h3>

                            <div className="space-y-3 mb-4">
                                {items.map((item) => (
                                    <div key={`${item.product.id}-${item.selectedColor}`} className="flex justify-between text-sm">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-surface-700 font-medium truncate">{item.product.name}</div>
                                            <div className="text-xs text-surface-400">{item.meters}m × {formatPrice(item.product.price_per_meter)}</div>
                                        </div>
                                        <span className="font-medium text-surface-800 ml-2">
                                            {formatPrice(item.meters * item.product.price_per_meter)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-surface-100 pt-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Ara Toplam</span>
                                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Kargo ({shippingOption.name})</span>
                                    <span className={`font-medium ${isFreeShipping ? 'text-green-600' : ''}`}>
                                        {isFreeShipping ? 'Ücretsiz' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                <div className="border-t border-surface-100 pt-2 flex justify-between">
                                    <span className="font-bold text-surface-800">Toplam</span>
                                    <span className="text-xl font-bold text-primary-600">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-surface-400">
                                <Lock size={12} />
                                <span>256-bit SSL ile güvenli alışveriş</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
