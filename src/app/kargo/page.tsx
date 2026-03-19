import { Clock, Truck, ShieldCheck, MapPin } from 'lucide-react';

export default function KargoPage() {
    return (
        <div className="min-h-screen bg-surface-50 py-12">
            <div className="container-main max-w-4xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            Kargo ve Teslimat
                        </h1>
                        <p className="text-surface-500 mt-2">Siparişlerinizin size ulaşma süreci hakkında bilgiler</p>
                    </div>

                    <div className="space-y-8 text-surface-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-surface-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                                Teslimat Süreleri
                            </h2>
                            <p>
                                14:00&apos;a kadar verilen siparişleriniz aynı gün kargoya teslim edilmektedir. 
                                Türkiye içi standart teslimat süremiz 1-3 iş günüdür. Mobil bölgeler ve köyler için 
                                bu süre kargo firmalarının operasyonel süreçlerine bağlı olarak değişiklik gösterebilir.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                            <div className="bg-surface-50 p-6 rounded-xl">
                                <ShieldCheck size={24} className="text-primary-500 mb-3" />
                                <h3 className="font-bold text-surface-800 mb-2">Güvenli Gönderim</h3>
                                <p className="text-sm">Kumaşlarınız özel koruyucu kılıflarında ve katlama/rulo kurallarına uygun olarak özenle paketlenir.</p>
                            </div>
                            <div className="bg-surface-50 p-6 rounded-xl">
                                <Clock size={24} className="text-primary-500 mb-3" />
                                <h3 className="font-bold text-surface-800 mb-2">Aynı Gün Kargo</h3>
                                <p className="text-sm">Hafta içi 14:00&apos;a kadar onaylanan siparişleriniz, aynı gün İstanbul depomuzdan kargoya verilir.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
