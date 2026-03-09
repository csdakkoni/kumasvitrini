'use client';

import { products } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/ProductCard';

export function AllProductsGrid() {
    const activeProducts = products.filter((p) => p.is_active);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
            ))}
        </div>
    );
}
