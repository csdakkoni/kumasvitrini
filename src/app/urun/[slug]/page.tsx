import { notFound } from 'next/navigation';
import { products, getProductBySlug, getProductCategory } from '@/lib/mock-data';
import { ProductDetail } from './ProductDetail';

export function generateStaticParams() {
    return products.filter(p => p.is_active).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) return { title: 'Ürün Bulunamadı' };
    const category = getProductCategory(product);
    return {
        title: `${product.name} - ${category?.name || 'Kumaş'}`,
        description: product.description,
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const category = getProductCategory(product);

    return <ProductDetail product={product} category={category} />;
}
