import Link from 'next/link';
import { Scissors, Truck, Shield, Award, Users } from 'lucide-react';

export const metadata = {
    title: 'Hakkımızda',
    description: 'Kumaş Dükkanı olarak kaliteli kumaşları uygun fiyatlarla kapınıza getiriyoruz.',
};

export default function AboutPage() {
    return (
        <div className="py-8 sm:py-12">
            <div className="container-main max-w-4xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-surface-700 font-medium">Hakkımızda</span>
                </nav>

                <h1 className="section-title mb-6">Hakkımızda</h1>

                {/* Story */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
                    <div className="prose prose-surface max-w-none">
                        <p className="text-lg text-surface-600 leading-relaxed mb-4">
                            <strong className="text-surface-800">Kumaş Dükkanı</strong>, Türkiye&apos;nin en kaliteli kumaşlarını
                            en uygun fiyatlarla müşterilerine ulaştırmak amacıyla kurulmuştur.
                        </p>
                        <p className="text-surface-600 leading-relaxed mb-4">
                            Kadife&apos;den saten&apos;e, pamuklu&apos;dan keten&apos;e geniş ürün yelpazemizle hem bireysel
                            müşterilerimize hem de toptan alıcılara hizmet vermekteyiz. Tüm kumaşlarımız güvenilir
                            tedarikçilerden temin edilmekte ve kalite kontrolden geçirilerek sizlere sunulmaktadır.
                        </p>
                        <p className="text-surface-600 leading-relaxed">
                            Metre bazında satış modelimiz sayesinde, ihtiyacınız kadar kumaş alabilir,
                            israfı minimuma indirebilirsiniz. Hızlı kargo ile siparişleriniz en kısa sürede kapınıza ulaşır.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            icon: Award,
                            title: 'Kalite',
                            desc: 'Tüm ürünlerimiz kalite kontrolden geçirilir',
                            color: 'bg-primary-100 text-primary-600',
                        },
                        {
                            icon: Truck,
                            title: 'Hızlı Kargo',
                            desc: 'Siparişleriniz 1-3 iş günü içinde kargoda',
                            color: 'bg-blue-100 text-blue-600',
                        },
                        {
                            icon: Shield,
                            title: 'Güvenli Alışveriş',
                            desc: 'Güvenli ödeme ve iade garantisi',
                            color: 'bg-green-100 text-green-600',
                        },
                        {
                            icon: Users,
                            title: 'Müşteri Memnuniyeti',
                            desc: 'Sorularınız için 7/24 WhatsApp destek',
                            color: 'bg-amber-100 text-amber-600',
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
                                <item.icon size={22} />
                            </div>
                            <h3 className="font-semibold text-surface-800 mb-1.5">{item.title}</h3>
                            <p className="text-sm text-surface-500">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Why us */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 sm:p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Scissors size={24} />
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                            Neden Kumaş Dükkanı?
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            'Geniş ürün yelpazesi — 6 kategoride onlarca kumaş',
                            'Metre bazında satış — istediğiniz kadar alın',
                            '500 TL üzeri siparişlerde ücretsiz kargo',
                            'Toptan siparişlerde özel fiyat teklifi',
                            'Hızlı kargo ile 1-3 iş günü teslimat',
                            'Kolay iade ve değişim imkânı',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-white/90">
                                <span className="text-primary-200 mt-0.5">✓</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
