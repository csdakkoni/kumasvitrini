'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Truck, Shield, RotateCcw, Ruler, Weight, Layers } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { formatPrice, getDiscountPercent, FREE_SHIPPING_THRESHOLD, calculateShipping } from '@/lib/utils';
import { MeterSelector } from '@/components/product/MeterSelector';
import { useCart } from '@/hooks/useCart';

interface ProductDetailProps {
    product: Product;
    category?: Category;
}

export function ProductDetail({ product, category }: ProductDetailProps) {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
    const [meters, setMeters] = useState(product.min_order_meters);
    const [isAdded, setIsAdded] = useState(false);
    const { addItem } = useCart();

    const hasDiscount = product.original_price && product.original_price > product.price_per_meter;
    const discountPercent = hasDiscount
        ? getDiscountPercent(product.original_price!, product.price_per_meter)
        : 0;

    const totalPrice = meters * product.price_per_meter;
    const shippingCost = calculateShipping(totalPrice);

    const handleAddToCart = () => {
        addItem(product, meters, selectedColor);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const whatsappMessage = encodeURIComponent(
        `Merhaba! "${product.name}" ürününden ${meters} metre sipariş vermek istiyorum.\n\nRenk: ${selectedColor}\nToplam: ${formatPrice(totalPrice)}`
    );

    return (
        <div className="py-8 sm:py-12">
            <div className="container-main">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8 flex-wrap">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <Link href="/kategori" className="hover:text-primary-600 transition-colors">Kumaşlar</Link>
                    {category && (
                        <>
                            <span>/</span>
                            <Link href={`/kategori/${category.slug}`} className="hover:text-primary-600 transition-colors">
                                {category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-surface-700 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="aspect-square rounded-2xl overflow-hidden bg-surface-100 relative">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                {hasDiscount && (
                                    <span className="badge badge-sale text-sm">%{discountPercent} İndirim</span>
                                )}
                                {product.stock_meters < 100 && (
                                    <span className="badge bg-amber-500 text-white text-sm">Son Stok</span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col"
                    >
                        {/* Category */}
                        {category && (
                            <Link
                                href={`/kategori/${category.slug}`}
                                className="text-sm font-semibold text-primary-500 uppercase tracking-wider hover:text-primary-600 transition-colors mb-2"
                            >
                                {category.name}
                            </Link>
                        )}

                        {/* Title & Price */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-bold text-surface-900">
                                {formatPrice(product.price_per_meter)}
                            </span>
                            <span className="text-base text-surface-400">/metre</span>
                            {hasDiscount && (
                                <span className="text-lg text-surface-400 line-through">
                                    {formatPrice(product.original_price!)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-surface-600 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        {/* Specs */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-surface-50 rounded-xl p-3 text-center">
                                <Ruler size={18} className="mx-auto text-primary-500 mb-1" />
                                <div className="text-xs text-surface-400">En</div>
                                <div className="text-sm font-semibold text-surface-800">{product.width_cm} cm</div>
                            </div>
                            <div className="bg-surface-50 rounded-xl p-3 text-center">
                                <Weight size={18} className="mx-auto text-primary-500 mb-1" />
                                <div className="text-xs text-surface-400">Ağırlık</div>
                                <div className="text-sm font-semibold text-surface-800">{product.weight_gsm} g/m²</div>
                            </div>
                            <div className="bg-surface-50 rounded-xl p-3 text-center">
                                <Layers size={18} className="mx-auto text-primary-500 mb-1" />
                                <div className="text-xs text-surface-400">Karışım</div>
                                <div className="text-sm font-semibold text-surface-800 text-xs">{product.composition}</div>
                            </div>
                        </div>

                        {/* Color selector */}
                        <div className="mb-6">
                            <label className="text-sm font-semibold text-surface-700 mb-3 block">
                                Renk: <span className="text-primary-600">{selectedColor}</span>
                            </label>
                            <div className="flex gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name
                                            ? 'border-primary-500 ring-2 ring-primary-200 scale-110'
                                            : 'border-surface-200 hover:border-surface-300'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                        aria-label={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Meter selector */}
                        <div className="mb-6">
                            <MeterSelector
                                minMeters={product.min_order_meters}
                                maxMeters={product.stock_meters}
                                value={meters}
                                onChange={setMeters}
                                pricePerMeter={product.price_per_meter}
                            />
                        </div>

                        {/* Add to cart button */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={handleAddToCart}
                                className={`btn flex-1 btn-lg ${isAdded ? 'bg-green-500 hover:bg-green-600 text-white' : 'btn-primary'}`}
                                disabled={isAdded}
                            >
                                {isAdded ? (
                                    <>
                                        <Check size={20} />
                                        Sepete Eklendi!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={20} />
                                        Sepete Ekle
                                    </>
                                )}
                            </button>
                        </div>

                        {/* WhatsApp order */}
                        <a
                            href={`https://wa.me/905XXXXXXXXX?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp btn-lg w-full mb-6"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp ile Sipariş Ver
                        </a>

                        {/* Shipping info */}
                        <div className="bg-surface-50 rounded-xl p-4 space-y-2.5">
                            <div className="flex items-center gap-3 text-sm">
                                <Truck size={16} className="text-primary-500 flex-shrink-0" />
                                <span>
                                    {shippingCost === 0 ? (
                                        <span className="text-green-600 font-semibold">Ücretsiz Kargo ✓</span>
                                    ) : (
                                        <>Kargo: {formatPrice(shippingCost)} <span className="text-surface-400">({formatPrice(FREE_SHIPPING_THRESHOLD)} üzeri ücretsiz)</span></>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-surface-600">
                                <Shield size={16} className="text-primary-500 flex-shrink-0" />
                                <span>Güvenli ödeme garantisi</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-surface-600">
                                <RotateCcw size={16} className="text-primary-500 flex-shrink-0" />
                                <span>14 gün koşulsuz iade</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
