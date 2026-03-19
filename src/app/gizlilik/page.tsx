import { Shield } from 'lucide-react';

export default function GizlilikPage() {
    return (
        <div className="min-h-screen bg-surface-50 py-12">
            <div className="container-main max-w-4xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            Gizlilik Politikası
                        </h1>
                        <p className="text-surface-500 mt-2">Kişisel verilerinizin korunması bizim için önemlidir.</p>
                    </div>

                    <div className="space-y-8 text-surface-600 leading-relaxed text-sm">
                        <section>
                            <h2 className="text-lg font-bold text-surface-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                                1. Veri Toplama
                            </h2>
                            <p>
                                Temel alışveriş işlemlerinizi gerçekleştirebilmek ve size daha iyi hizmet sunabilmek amacıyla isim, iletişim bilgileri ve teslimat adresiniz gibi temel bilgilerinizi topluyoruz. Ödeme bilgileriniz iyzico güvencesiyle işlenir ve sunucularımızda saklanmaz.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-surface-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                                2. Veri Kullanımı
                            </h2>
                            <p>
                                Toplanan verileriniz sadece sipariş süreçlerinin yönetimi, operasyonel iletişimler ve kargo teslimatının sağlanması amaçlarıyla kullanılır.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
