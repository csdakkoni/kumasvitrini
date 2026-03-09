import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getProductsByCategory, getCategoryBySlug } from '@/lib/mock-data';
import { CategoryProductGrid } from './CategoryProductGrid';

export function generateStaticParams() {
    return categories.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    // We need to handle this synchronously for static generation
    return params.then(({ slug }) => {
        const category = getCategoryBySlug(slug);
        if (!category) return { title: 'Kategori Bulunamadı' };
        return {
            title: `${category.name} Kumaşlar`,
            description: category.description,
        };
    });
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const categoryProducts = getProductsByCategory(slug);

    return (
        <div className="py-8 sm:py-12">
            <div className="container-main">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-6">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <Link href="/kategori" className="hover:text-primary-600 transition-colors">Kumaşlar</Link>
                    <span>/</span>
                    <span className="text-surface-700 font-medium">{category.name}</span>
                </nav>

                {/* Category header */}
                <div className="mb-10">
                    <h1 className="section-title">{category.name} Kumaşlar</h1>
                    <p className="section-subtitle mt-2">{category.description}</p>
                    <p className="text-sm text-surface-400 mt-2">{categoryProducts.length} ürün bulundu</p>
                </div>

                {/* Products Grid */}
                {categoryProducts.length > 0 ? (
                    <CategoryProductGrid products={categoryProducts} />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-surface-400 text-lg mb-4">Bu kategoride henüz ürün bulunmuyor.</p>
                        <Link href="/kategori" className="btn btn-primary">
                            Diğer Kategorilere Göz At
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
