import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export const metadata = {
    title: 'İletişim',
    description: 'Kumaş Dükkanı ile iletişime geçin. WhatsApp, telefon veya e-posta ile bize ulaşabilirsiniz.',
};

export default function ContactPage() {
    return (
        <div className="py-8 sm:py-12">
            <div className="container-main max-w-4xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-surface-700 font-medium">İletişim</span>
                </nav>

                <h1 className="section-title mb-3">İletişim</h1>
                <p className="section-subtitle mb-10">
                    Sorularınız, toptan sipariş talepleriniz veya özel istekleriniz için bize dilediğiniz kanaldan ulaşabilirsiniz.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
                            <h2 className="text-lg font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                                Bize Ulaşın
                            </h2>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-surface-700">Telefon</div>
                                    <a href="tel:+905XXXXXXXXX" className="text-sm text-surface-500 hover:text-primary-600 transition-colors">
                                        0(5XX) XXX XX XX
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MessageCircle size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-surface-700">WhatsApp</div>
                                    <a
                                        href="https://wa.me/905XXXXXXXXX"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-surface-500 hover:text-green-600 transition-colors"
                                    >
                                        WhatsApp ile yazın →
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-surface-700">E-posta</div>
                                    <a href="mailto:info@kumasdukkani.com" className="text-sm text-surface-500 hover:text-blue-600 transition-colors">
                                        info@kumasdukkani.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-surface-700">Adres</div>
                                    <p className="text-sm text-surface-500">İstanbul, Türkiye</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-surface-700">Çalışma Saatleri</div>
                                    <p className="text-sm text-surface-500">Pazartesi - Cuma: 09:00 - 18:00</p>
                                    <p className="text-sm text-surface-500">Cumartesi: 10:00 - 15:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-surface-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                            Mesaj Gönderin
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Ad Soyad</label>
                                <input type="text" className="input" placeholder="Adınız Soyadınız" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">E-posta</label>
                                <input type="email" className="input" placeholder="ornek@email.com" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Telefon</label>
                                <input type="tel" className="input" placeholder="0(5XX) XXX XX XX" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Konu</label>
                                <select className="input">
                                    <option value="">Seçiniz</option>
                                    <option value="order">Sipariş Hakkında</option>
                                    <option value="wholesale">Toptan Sipariş</option>
                                    <option value="return">İade / Değişim</option>
                                    <option value="info">Ürün Bilgisi</option>
                                    <option value="other">Diğer</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-surface-700 mb-1.5 block">Mesaj</label>
                                <textarea className="input min-h-[120px] resize-y" placeholder="Mesajınızı yazın..." />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                Gönder
                            </button>
                            <p className="text-xs text-surface-400 text-center">
                                Hızlı yanıt için WhatsApp&apos;tan da ulaşabilirsiniz
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
