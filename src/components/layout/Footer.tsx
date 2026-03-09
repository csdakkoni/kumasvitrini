import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { categories } from '@/lib/mock-data';

export function Footer() {
    return (
        <footer className="bg-surface-900 text-surface-300 mt-auto">
            {/* Main footer */}
            <div className="container-main py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>K</span>
                            </div>
                            <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                Kumaş Dükkanı
                            </span>
                        </div>
                        <p className="text-sm text-surface-400 leading-relaxed mb-4">
                            Kaliteli kumaşları uygun fiyatlarla kapınıza getiriyoruz.
                            Kadife&apos;den saten&apos;e, pamuklu&apos;dan keten&apos;e geniş ürün yelpazemizle hizmetinizdeyiz.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-9 h-9 bg-surface-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 bg-surface-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Kategoriler</h3>
                        <ul className="space-y-2.5">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/kategori/${cat.slug}`}
                                        className="text-sm hover:text-primary-400 transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Bilgi</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link href="/hakkimizda" className="text-sm hover:text-primary-400 transition-colors">
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link href="/iletisim" className="text-sm hover:text-primary-400 transition-colors">
                                    İletişim
                                </Link>
                            </li>
                            <li>
                                <Link href="/kargo" className="text-sm hover:text-primary-400 transition-colors">
                                    Kargo ve Teslimat
                                </Link>
                            </li>
                            <li>
                                <Link href="/iade" className="text-sm hover:text-primary-400 transition-colors">
                                    İade ve Değişim
                                </Link>
                            </li>
                            <li>
                                <Link href="/gizlilik" className="text-sm hover:text-primary-400 transition-colors">
                                    Gizlilik Politikası
                                </Link>
                            </li>
                            <li>
                                <Link href="/sss" className="text-sm hover:text-primary-400 transition-colors">
                                    Sıkça Sorulan Sorular
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>İletişim</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm">
                                <Phone size={16} className="mt-0.5 text-primary-400 flex-shrink-0" />
                                <div>
                                    <a href="tel:+905XXXXXXXXX" className="hover:text-primary-400 transition-colors">
                                        0(5XX) XXX XX XX
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <Mail size={16} className="mt-0.5 text-primary-400 flex-shrink-0" />
                                <a href="mailto:info@kumasdukkani.com" className="hover:text-primary-400 transition-colors">
                                    info@kumasdukkani.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin size={16} className="mt-0.5 text-primary-400 flex-shrink-0" />
                                <span>İstanbul, Türkiye</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <Clock size={16} className="mt-0.5 text-primary-400 flex-shrink-0" />
                                <span>Pzt-Cum: 09:00 - 18:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-surface-800">
                <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-surface-500">
                        © {new Date().getFullYear()} Kumaş Dükkanı. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-4">
                        <img src="/images/payment/visa.svg" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
                        <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
                        <img src="/images/payment/troy.svg" alt="Troy" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
