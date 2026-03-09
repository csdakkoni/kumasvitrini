'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { getProductCategory } from '@/lib/mock-data';

interface ProductCardProps {
    product: Product;
    index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
    const category = getProductCategory(product);
    const hasDiscount = product.original_price && product.original_price > product.price_per_meter;
    const discountPercent = hasDiscount
        ? getDiscountPercent(product.original_price!, product.price_per_meter)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link href={`/urun/${product.slug}`} className="block product-card group">
                {/* Image container */}
                <div className="relative aspect-[4/5] bg-surface-100 overflow-hidden">
                    {/* Product image */}
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Color swatch preview */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                        {product.colors.slice(0, 3).map((color) => (
                            <span
                                key={color.name}
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {hasDiscount && (
                            <span className="badge badge-sale">%{discountPercent} İndirim</span>
                        )}
                        {product.stock_meters < 100 && (
                            <span className="badge bg-amber-500 text-white">Son Stok</span>
                        )}
                    </div>

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm text-surface-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300"
                        >
                            İncele
                        </motion.span>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4">
                    {category && (
                        <span className="text-xs font-medium text-primary-500 uppercase tracking-wider">
                            {category.name}
                        </span>
                    )}
                    <h3 className="text-sm font-semibold text-surface-800 mt-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-surface-400">
                        <span>En: {product.width_cm}cm</span>
                        <span>•</span>
                        <span>{product.weight_gsm} g/m²</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-lg font-bold text-surface-900">
                            {formatPrice(product.price_per_meter)}
                        </span>
                        <span className="text-xs text-surface-400">/metre</span>
                        {hasDiscount && (
                            <span className="text-sm text-surface-400 line-through">
                                {formatPrice(product.original_price!)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
