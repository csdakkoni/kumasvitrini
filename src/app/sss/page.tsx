import Link from 'next/link';

export const metadata = {
    title: 'Sıkça Sorulan Sorular',
    description: 'Kumaş Dükkanı hakkında sıkça sorulan sorular. Sipariş, kargo, iade ve ödeme bilgileri.',
};

const faqs = [
    {
        category: 'Sipariş',
        questions: [
            {
                q: 'Nasıl sipariş verebilirim?',
                a: 'Ürün detay sayfasından istediğiniz metre miktarını belirleyip sepete ekleyebilirsiniz. Sepet sayfasından WhatsApp ile sipariş butonuna tıklayarak siparişinizi tamamlayabilirsiniz. Online ödeme sistemi yakında aktif olacaktır.',
            },
            {
                q: 'Minimum sipariş miktarı nedir?',
                a: 'Her ürünün minimum sipariş miktarı ürün sayfasında belirtilmektedir. Genellikle minimum 1 metre, bazı ürünlerde 2 metredir.',
            },
            {
                q: 'Toptan sipariş verebilir miyim?',
                a: 'Evet! 50 metre üzeri siparişlerde özel fiyat teklifi alabilirsiniz. WhatsApp üzerinden bize ulaşmanız yeterlidir.',
            },
        ],
    },
    {
        category: 'Kargo & Teslimat',
        questions: [
            {
                q: 'Kargo ücreti ne kadar?',
                a: '500 TL ve üzeri siparişlerde kargo ücretsizdir. 500 TL altı siparişlerde sabit 49.90 TL kargo ücreti uygulanır.',
            },
            {
                q: 'Siparişim ne zaman gelir?',
                a: 'Siparişler 1-3 iş günü içinde kargoya verilir. Kargo süresi bulunduğunuz bölgeye göre 1-3 iş günü arasında değişir.',
            },
            {
                q: 'Hangi kargo firmasıyla çalışıyorsunuz?',
                a: 'Yurtiçi Kargo ve Aras Kargo ile çalışmaktayız. Siparişiniz hangi firmayla gönderilecekse kargo takip numaranız iletilir.',
            },
        ],
    },
    {
        category: 'İade & Değişim',
        questions: [
            {
                q: 'İade yapabilir miyim?',
                a: 'Evet, ürün teslim tarihinden itibaren 14 gün içinde iade edebilirsiniz. Ürünün kullanılmamış ve orijinal paketinde olması gerekmektedir.',
            },
            {
                q: 'Kesilmiş kumaş iade edilir mi?',
                a: 'Kesim hatalı olan veya tanımlanan özelliklerle uyuşmayan kumaşlar iade edilebilir. Normal alışverişlerde sipariş edilen metreye göre kesilmiş kumaşlar iade edilemez.',
            },
        ],
    },
    {
        category: 'Ödeme',
        questions: [
            {
                q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
                a: 'Şu anda WhatsApp üzerinden sipariş alıyoruz ve banka havalesi/EFT ile ödeme kabul ediyoruz. Kredi kartı ile online ödeme altyapısı (iyzico) yakında aktif olacaktır.',
            },
            {
                q: 'Kapıda ödeme var mı?',
                a: 'Şu anda kapıda ödeme seçeneği bulunmamaktadır. İleride eklenecektir.',
            },
        ],
    },
];

export default function SSS() {
    return (
        <div className="py-8 sm:py-12">
            <div className="container-main max-w-3xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-surface-700 font-medium">SSS</span>
                </nav>

                <h1 className="section-title mb-3">Sıkça Sorulan Sorular</h1>
                <p className="section-subtitle mb-10">
                    Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
                </p>

                <div className="space-y-8">
                    {faqs.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-lg font-bold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                {section.category}
                            </h2>
                            <div className="space-y-3">
                                {section.questions.map((faq, i) => (
                                    <details key={i} className="group bg-white rounded-xl shadow-sm overflow-hidden">
                                        <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-surface-800 hover:text-primary-600 transition-colors list-none">
                                            {faq.q}
                                            <span className="text-surface-400 group-open:rotate-45 transition-transform text-lg ml-4 flex-shrink-0">+</span>
                                        </summary>
                                        <div className="px-5 pb-5 text-sm text-surface-600 leading-relaxed border-t border-surface-100 pt-3">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions */}
                <div className="mt-12 bg-surface-100 rounded-2xl p-6 sm:p-8 text-center">
                    <h3 className="text-lg font-bold text-surface-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Başka sorunuz mu var?
                    </h3>
                    <p className="text-sm text-surface-500 mb-4">
                        Cevabını bulamadığınız sorular için bize ulaşın
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        <a
                            href="https://wa.me/905XXXXXXXXX"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp btn-sm"
                        >
                            WhatsApp
                        </a>
                        <Link href="/iletisim" className="btn btn-secondary btn-sm">
                            İletişim Formu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
