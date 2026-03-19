import { RotateCcw } from 'lucide-react';

export default function IadePage() {
    return (
        <div className="min-h-screen bg-surface-50 py-12">
            <div className="container-main max-w-4xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RotateCcw size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-surface-800" style={{ fontFamily: 'var(--font-display)' }}>
                            İade ve Değişim
                        </h1>
                        <p className="text-surface-500 mt-2">Kumaş Vitrini iade ve değişim koşulları</p>
                    </div>

                    <div className="space-y-6 text-surface-600 leading-relaxed text-sm">
                        <section>
                            <h2 className="text-lg font-bold text-surface-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                                Önemli Bilgilendirme (Kesilmiş Kumaşlar)
                            </h2>
                            <p>
                                Tüketici Kanununun cayma hakkı istisnaları kapsamında; "Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda <strong>hazırlanan</strong> veya özel olarak ölçülendirilip/kesilen mallar" mesafeli sözleşmelerde iade hakkı dışındadır.
                                Siparişinize istinaden top kumaşlardan size özel ölçüde kesilen kumaşlarda, <strong>kumaşta üretim veya dokuma hatası bulunmadığı sürece</strong> maalesef iade ve değişim yapılamamaktadır.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-surface-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                                Hatalı / Ayıplı Ürünler
                            </h2>
                            <p>
                                Tarafınıza ulaşan kumaşta leke, yırtık, defo veya siparişinizden farklı bir ürün gönderimi gibi durumlarda, sipariş teslim tarihinden itibaren 14 gün içerisinde iade veya değişim talebinde bulunabilirsiniz. Bu durumlarda kargo ücretleri firmamıza aittir.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
