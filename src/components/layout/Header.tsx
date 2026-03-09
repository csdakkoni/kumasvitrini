'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Search,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';
import { categories } from '@/lib/mock-data';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // Track scroll for header styling
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Listen for cart updates
    useEffect(() => {
        const updateCount = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('kumas-shop-cart') || '[]');
                setCartCount(cart.length);
            } catch {
                setCartCount(0);
            }
        };
        updateCount();
        window.addEventListener('cart-updated', updateCount);
        window.addEventListener('storage', updateCount);
        return () => {
            window.removeEventListener('cart-updated', updateCount);
            window.removeEventListener('storage', updateCount);
        };
    }, []);

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/90 backdrop-blur-xl shadow-md'
                        : 'bg-white'
                    }`}
            >
                {/* Top bar */}
                <div className="bg-surface-900 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
                    <span className="hidden sm:inline">🚚 500 TL üzeri siparişlerde </span>
                    <span className="font-bold text-primary-300">ÜCRETSİZ KARGO</span>
                    <span className="hidden sm:inline"> • Güvenli Ödeme • Hızlı Teslimat</span>
                </div>

                {/* Main header */}
                <div className="container-main">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 -ml-2 text-surface-700 hover:text-surface-900"
                            aria-label="Menü"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <span className="text-white font-bold text-lg sm:text-xl" style={{ fontFamily: 'var(--font-display)' }}>K</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-surface-900" style={{ fontFamily: 'var(--font-display)' }}>
                                    Kumaş
                                </span>
                                <span className="text-xl font-bold text-primary-500" style={{ fontFamily: 'var(--font-display)' }}>
                                    Dükkanı
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link
                                href="/"
                                className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                                Ana Sayfa
                            </Link>

                            {/* Categories dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsCategoryOpen(true)}
                                onMouseLeave={() => setIsCategoryOpen(false)}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    Kumaşlar
                                    <ChevronDown size={14} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isCategoryOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-elevated border border-surface-100 overflow-hidden"
                                        >
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/kategori/${cat.slug}`}
                                                    className="block px-4 py-3 text-sm text-surface-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                            <div className="border-t border-surface-100">
                                                <Link
                                                    href="/kategori"
                                                    className="block px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                                                >
                                                    Tümünü Gör →
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link
                                href="/hakkimizda"
                                className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                                Hakkımızda
                            </Link>
                            <Link
                                href="/iletisim"
                                className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                                İletişim
                            </Link>
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/arama"
                                className="p-2.5 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-xl transition-colors"
                                aria-label="Ara"
                            >
                                <Search size={20} />
                            </Link>

                            <Link href="/sepet" className="relative p-2.5 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-xl transition-colors">
                                <ShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>Menü</span>
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-surface-100 rounded-lg">
                                        <X size={20} />
                                    </button>
                                </div>

                                <nav className="space-y-1">
                                    <Link
                                        href="/"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-3 text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                                    >
                                        Ana Sayfa
                                    </Link>

                                    <div className="pt-2 pb-1 px-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                                        Kategoriler
                                    </div>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/kategori/${cat.slug}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-4 py-3 text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}

                                    <div className="border-t border-surface-100 my-4" />

                                    <Link
                                        href="/hakkimizda"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-3 text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                                    >
                                        Hakkımızda
                                    </Link>
                                    <Link
                                        href="/iletisim"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-3 text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                                    >
                                        İletişim
                                    </Link>
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
