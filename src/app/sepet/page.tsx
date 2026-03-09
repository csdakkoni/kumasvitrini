'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice, calculateShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

export default function CartPage() {
    const { items, isLoaded, removeItem, updateMeters, clearCart, totalPrice } = useCart();

    const shippingCost = calculateShipping(totalPrice);
    const grandTotal = totalPrice + shippingCost;

    if (!isLoaded) {
        return (
            <div className="py-20 text-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="container-main max-w-md mx-auto">
                    <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={32} className="text-surface-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-surface-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        Sepetiniz Boş
                    </h1>
                    <p className="text-surface-500 mb-8">
                        Henüz sepetinize ürün eklemediniz. Kumaşlarımıza göz atın!
                    </p>
                    <Link href="/kategori" className="btn btn-primary btn-lg">
                        Alışverişe Başla
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    const whatsappItems = items.map(item =>
        `• ${item.product.name}${item.selectedColor ? ` (${item.selectedColor})` : ''} - ${item.meters}m x ${formatPrice(item.product.price_per_meter)} = ${formatPrice(item.meters * item.product.price_per_meter)}`
    );
    const whatsappMessage = encodeURIComponent(
        `Merhaba! Aşağıdaki ürünleri sipariş vermek istiyorum:\n\n${whatsappItems.join('\n')}\n\nAra Toplam: ${formatPrice(totalPrice)}\nKargo: ${shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}\nGenel Toplam: ${formatPrice(grandTotal)}\n\nTeşekkürler!`
    );

    return (
        <div className="py-8 sm:py-12">
            <div className="container-main">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-surface-700 font-medium">Sepet</span>
                </nav>

                <h1 className="section-title mb-8">
                    Sepetim <span className="text-surface-400 font-normal text-lg">({items.length} ürün)</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={`${item.product.id}-${item.selectedColor}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-surface-100"
                                >
                                    <div className="flex gap-4">
                                        {/* Product image placeholder */}
                                        <div
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-surface-100 flex-shrink-0"
                                            style={{
                                                background: `linear-gradient(135deg, ${item.product.colors[0]?.hex || '#e5e5e5'}22, ${item.product.colors[0]?.hex || '#e5e5e5'}44)`,
                                            }}
                                        />

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <Link
                                                        href={`/urun/${item.product.slug}`}
                                                        className="text-sm sm:text-base font-semibold text-surface-800 hover:text-primary-600 transition-colors line-clamp-1"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    {item.selectedColor && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span
                                                                className="w-3 h-3 rounded-full border border-surface-200"
                                                                style={{
                                                                    backgroundColor:
                                                                        item.product.colors.find((c) => c.name === item.selectedColor)?.hex || '#ccc',
                                                                }}
                                                            />
                                                            <span className="text-xs text-surface-400">{item.selectedColor}</span>
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-surface-400 mt-1">
                                                        {formatPrice(item.product.price_per_meter)}/metre
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.product.id, item.selectedColor)}
                                                    className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                    aria-label="Kaldır"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Meter control & price */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateMeters(item.product.id, item.meters - 0.5, item.selectedColor)}
                                                        className="p-1.5 hover:bg-surface-100 transition-colors"
                                                        disabled={item.meters <= item.product.min_order_meters}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 text-sm font-semibold min-w-[3rem] text-center">
                                                        {item.meters}m
                                                    </span>
                                                    <button
                                                        onClick={() => updateMeters(item.product.id, item.meters + 0.5, item.selectedColor)}
                                                        className="p-1.5 hover:bg-surface-100 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <span className="text-base sm:text-lg font-bold text-surface-900">
                                                    {formatPrice(item.meters * item.product.price_per_meter)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4">
                            <Link href="/kategori" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                                <ArrowLeft size={14} />
                                Alışverişe Devam Et
                            </Link>
                            <button
                                onClick={clearCart}
                                className="text-sm text-surface-400 hover:text-red-500 transition-colors"
                            >
                                Sepeti Temizle
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100 sticky top-28">
                            <h2 className="text-lg font-bold text-surface-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                                Sipariş Özeti
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Ara Toplam</span>
                                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-surface-500">Kargo</span>
                                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                        {shippingCost === 0 ? 'Ücretsiz ✓' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                {shippingCost > 0 && (
                                    <div className="bg-primary-50 rounded-lg p-3 text-xs text-primary-700">
                                        {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} daha ekleyin, kargo ücretsiz olsun!
                                    </div>
                                )}
                                <div className="border-t border-surface-100 pt-3 flex justify-between">
                                    <span className="font-semibold text-surface-800">Genel Toplam</span>
                                    <span className="text-xl font-bold text-surface-900">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            {/* WhatsApp Order */}
                            <a
                                href={`https://wa.me/905XXXXXXXXX?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp w-full mt-6"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp ile Sipariş Ver
                            </a>

                            <p className="text-xs text-center text-surface-400 mt-3">
                                Online ödeme sistemi yakında aktif olacaktır
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
