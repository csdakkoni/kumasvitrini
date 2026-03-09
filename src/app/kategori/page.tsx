import Link from 'next/link';
import { categories } from '@/lib/mock-data';
import { AllProductsGrid } from './AllProductsGrid';

export const metadata = {
    title: 'Tüm Kategoriler',
    description: 'Kadife, saten, pamuklu, şifon, keten ve polyester kumaş kategorilerimizi keşfedin.',
};

export default function KategoriPage() {
    return (
        <div className="py-8 sm:py-12">
            <div className="container-main">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-6">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-surface-700 font-medium">Kumaşlar</span>
                </nav>

                <h1 className="section-title mb-3">Kumaş Kategorileri</h1>
                <p className="section-subtitle mb-10">Aradığınız kumaşı kategorilere göre keşfedin</p>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-16">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/kategori/${cat.slug}`}
                            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-warm-200 to-warm-400"
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 z-10">
                                <h2 className="text-white font-bold text-lg sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                                    {cat.name}
                                </h2>
                                <p className="text-white/70 text-sm mt-1 line-clamp-2 hidden sm:block">{cat.description}</p>
                                <span className="inline-flex items-center text-white/80 text-sm mt-2 group-hover:text-white transition-colors">
                                    Ürünleri Gör →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* All Products */}
                <div className="border-t border-surface-200 pt-12">
                    <h2 className="section-title mb-3">Tüm Kumaşlar</h2>
                    <p className="section-subtitle mb-8">Tüm ürünlerimize göz atın</p>
                    <AllProductsGrid />
                </div>
            </div>
        </div>
    );
}
