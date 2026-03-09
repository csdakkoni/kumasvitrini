'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Truck, Shield, RotateCcw, Headphones, ArrowRight, Scissors } from 'lucide-react';
import { categories, getFeaturedProducts } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

export default function HomePage() {
    const featuredProducts = getFeaturedProducts();

    return (
        <>
            {/* ===== HERO ===== */}
            <section className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-surface-800 to-primary-950 text-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="container-main relative z-10 py-20 sm:py-28 lg:py-36">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                                <Scissors size={16} className="text-primary-400" />
                                <span>Premium Kalite Kumaşlar</span>
                            </div>
                            <h1
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Hayalinizdeki Kumaş,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                                    Metre Metre
                                </span>{' '}
                                Kapınızda
                            </h1>
                            <p className="text-lg sm:text-xl text-surface-300 leading-relaxed mb-8 max-w-xl">
                                Kadife, saten, pamuklu ve daha fazlası. İstediğiniz miktarı seçin,
                                güvenle sipariş verin. Türkiye&apos;nin her yerine hızlı kargo.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/kategori" className="btn btn-primary btn-lg">
                                    Kumaşlara Göz At
                                    <ArrowRight size={18} />
                                </Link>
                                <Link href="/iletisim" className="btn btn-secondary btn-lg !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                                    İletişime Geç
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
                        <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="var(--color-warm-50)" />
                    </svg>
                </div>
            </section>

            {/* ===== TRUST BAR ===== */}
            <section className="py-8 border-b border-surface-200 bg-white">
                <div className="container-main">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Truck, title: 'Ücretsiz Kargo', desc: `${formatPrice(FREE_SHIPPING_THRESHOLD)} üzeri siparişlerde` },
                            { icon: Shield, title: 'Güvenli Ödeme', desc: '256-bit SSL şifreleme' },
                            { icon: RotateCcw, title: 'Kolay İade', desc: '14 gün iade garantisi' },
                            { icon: Headphones, title: 'Destek', desc: 'WhatsApp ile 7/24' },
                        ].map((item, i) => (
                            <div key={i} className="trust-item">
                                <div className="trust-icon">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-surface-800">{item.title}</div>
                                    <div className="text-xs text-surface-400">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CATEGORIES ===== */}
            <section className="py-16 sm:py-20">
                <div className="container-main">
                    <div className="text-center mb-10">
                        <h2 className="section-title">Kategorilere Göz Atın</h2>
                        <p className="section-subtitle">İhtiyacınıza uygun kumaşı kolayca bulun</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                            >
                                <Link href={`/kategori/${cat.slug}`} className="category-card block group">
                                    <img src={`/images/categories/${cat.slug}.png`} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
                                        <h3 className="text-white font-bold text-lg sm:text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                                            {cat.name}
                                        </h3>
                                        <p className="text-white/70 text-sm mt-1 line-clamp-2 hidden sm:block">{cat.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED PRODUCTS ===== */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="container-main">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="section-title">Öne Çıkan Kumaşlar</h2>
                            <p className="section-subtitle">En çok tercih edilen ürünlerimiz</p>
                        </div>
                        <Link
                            href="/kategori"
                            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Tümünü Gör <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                        {featuredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link href="/kategori" className="btn btn-secondary">
                            Tüm Ürünleri Gör <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="py-16 sm:py-20">
                <div className="container-main">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                                Toptan Sipariş mi Veriyorsunuz?
                            </h2>
                            <p className="text-white/80 mb-6 max-w-lg mx-auto">
                                50 metre üzeri siparişlerde özel fiyat teklifi alın. WhatsApp üzerinden hemen iletişime geçin.
                            </p>
                            <a
                                href="https://wa.me/905XXXXXXXXX?text=Merhaba%2C%20toptan%20sipari%C5%9F%20vermek%20istiyorum."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp btn-lg"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp ile İletişim
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
