import { getProducts } from '@/lib/services/api';
import { ProductCard } from '@/components/product/ProductCard';

export async function AllProductsGrid() {
    const activeProducts = await getProducts();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
            ))}
        </div>
    );
}
