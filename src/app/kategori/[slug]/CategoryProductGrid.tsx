'use client';

import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export function CategoryProductGrid({ products }: { products: Product[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
            ))}
        </div>
    );
}
