import { getProducts } from '@/lib/services/api';
import { ProductGridWithFilters } from '@/components/product/ProductGridWithFilters';

export async function AllProductsGrid() {
    const activeProducts = await getProducts();

    return <ProductGridWithFilters initialProducts={activeProducts} />;
}
