import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug, getCategoryById } from '@/lib/services/api';
import { ProductDetail } from './ProductDetail';

export const revalidate = 10; // 10 seconds ISR

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: 'Ürün Bulunamadı' };
    const category = product.category_id ? await getCategoryById(product.category_id) : null;
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
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const category = product.category_id ? await getCategoryById(product.category_id) : undefined;

    return <ProductDetail product={product} category={category || undefined} />;
}
