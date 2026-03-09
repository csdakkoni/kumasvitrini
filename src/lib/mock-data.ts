import { Category, Product } from './types';

// ==========================================
// Kategoriler
// ==========================================
export const categories: Category[] = [
    {
        id: 'cat-1',
        name: 'Kadife',
        slug: 'kadife',
        image_url: '/images/categories/kadife.jpg',
        description: 'Yumuşak dokulu, premium kadife kumaşlar. Koltuk, perde ve giyim için ideal.',
        sort_order: 1,
    },
    {
        id: 'cat-2',
        name: 'Saten',
        slug: 'saten',
        image_url: '/images/categories/saten.jpg',
        description: 'Parlak ve zarif saten kumaşlar. Abiye, gelinlik ve dekorasyon için.',
        sort_order: 2,
    },
    {
        id: 'cat-3',
        name: 'Pamuklu',
        slug: 'pamuklu',
        image_url: '/images/categories/pamuklu.jpg',
        description: 'Doğal pamuklu kumaşlar. Günlük giyim, ev tekstili ve bebek ürünleri için.',
        sort_order: 3,
    },
    {
        id: 'cat-4',
        name: 'Şifon',
        slug: 'sifon',
        image_url: '/images/categories/sifon.jpg',
        description: 'Hafif ve akışkan şifon kumaşlar. Elbise, şal ve dekoratif kullanım için.',
        sort_order: 4,
    },
    {
        id: 'cat-5',
        name: 'Keten',
        slug: 'keten',
        image_url: '/images/categories/keten.jpg',
        description: 'Nefes alan, doğal keten kumaşlar. Yaz giyim ve ev dekorasyonu için.',
        sort_order: 5,
    },
    {
        id: 'cat-6',
        name: 'Polyester',
        slug: 'polyester',
        image_url: '/images/categories/polyester.jpg',
        description: 'Dayanıklı ve bakımı kolay polyester kumaşlar. Spor giyim ve döşemelik.',
        sort_order: 6,
    },
];

// ==========================================
// Ürünler
// ==========================================
export const products: Product[] = [
    // Kadife
    {
        id: 'prod-1',
        category_id: 'cat-1',
        name: 'Royal Kadife - Bordo',
        slug: 'royal-kadife-bordo',
        description: 'Premium kalite döşemelik kadife kumaş. Zengin bordo rengiyle klasik ve lüks bir görünüm sunar. Koltuk kaplama, perde ve yastık için idealdir.',
        price_per_meter: 189.90,
        min_order_meters: 1,
        stock_meters: 250,
        width_cm: 150,
        weight_gsm: 320,
        composition: '100% Polyester',
        colors: [
            { name: 'Bordo', hex: '#800020' },
            { name: 'Lacivert', hex: '#1a1a4e' },
            { name: 'Yeşil', hex: '#2d5a27' },
        ],
        images: ['/images/products/kadife-bordo-1.jpg', '/images/products/kadife-bordo-2.jpg'],
        is_active: true,
        is_featured: true,
        created_at: '2025-01-15',
        updated_at: '2025-01-15',
    },
    {
        id: 'prod-2',
        category_id: 'cat-1',
        name: 'Soft Kadife - Krem',
        slug: 'soft-kadife-krem',
        description: 'Ultra yumuşak tüylü kadife. Bebek battaniyesi, pijama ve ev giyim ürünleri için mükemmel.',
        price_per_meter: 149.90,
        min_order_meters: 1,
        stock_meters: 180,
        width_cm: 150,
        weight_gsm: 280,
        composition: '%80 Polyester, %20 Pamuk',
        colors: [
            { name: 'Krem', hex: '#FFFDD0' },
            { name: 'Pembe', hex: '#FFB6C1' },
            { name: 'Gri', hex: '#808080' },
        ],
        images: ['/images/products/kadife-krem-1.jpg'],
        is_active: true,
        is_featured: false,
        created_at: '2025-01-20',
        updated_at: '2025-01-20',
    },
    // Saten
    {
        id: 'prod-3',
        category_id: 'cat-2',
        name: 'Duchesse Saten - Fildişi',
        slug: 'duchesse-saten-fildisi',
        description: 'Ağır ve parlak duchesse saten. Gelinlik, abiye ve özel gece kıyafetleri için birinci sınıf tercih.',
        price_per_meter: 259.90,
        original_price: 319.90,
        min_order_meters: 1,
        stock_meters: 120,
        width_cm: 150,
        weight_gsm: 210,
        composition: '100% Polyester',
        colors: [
            { name: 'Fildişi', hex: '#FFFFF0' },
            { name: 'Şampanya', hex: '#F7E7CE' },
            { name: 'Beyaz', hex: '#FFFFFF' },
        ],
        images: ['/images/products/saten-fildisi-1.jpg'],
        is_active: true,
        is_featured: true,
        created_at: '2025-02-01',
        updated_at: '2025-02-01',
    },
    {
        id: 'prod-4',
        category_id: 'cat-2',
        name: 'Krep Saten - Siyah',
        slug: 'krep-saten-siyah',
        description: 'Bir yüzü mat, diğer yüzü parlak krep saten. Çift taraflı kullanılabilir. Elbise ve bluz için ideal.',
        price_per_meter: 179.90,
        min_order_meters: 1,
        stock_meters: 200,
        width_cm: 150,
        weight_gsm: 160,
        composition: '100% Polyester',
        colors: [
            { name: 'Siyah', hex: '#000000' },
            { name: 'Lacivert', hex: '#000080' },
            { name: 'Bordo', hex: '#800020' },
        ],
        images: ['/images/products/saten-siyah-1.jpg'],
        is_active: true,
        is_featured: false,
        created_at: '2025-02-05',
        updated_at: '2025-02-05',
    },
    // Pamuklu
    {
        id: 'prod-5',
        category_id: 'cat-3',
        name: 'Organik Pamuk Poplin',
        slug: 'organik-pamuk-poplin',
        description: 'GOTS sertifikalı organik pamuk poplin kumaş. Gömlek, elbise ve çocuk giyim için sağlıklı ve doğal seçim.',
        price_per_meter: 129.90,
        min_order_meters: 1,
        stock_meters: 350,
        width_cm: 150,
        weight_gsm: 130,
        composition: '100% Organik Pamuk',
        colors: [
            { name: 'Beyaz', hex: '#FFFFFF' },
            { name: 'Ekru', hex: '#F5F5DC' },
            { name: 'Açık Mavi', hex: '#ADD8E6' },
        ],
        images: ['/images/products/pamuk-poplin-1.jpg'],
        is_active: true,
        is_featured: true,
        created_at: '2025-02-10',
        updated_at: '2025-02-10',
    },
    {
        id: 'prod-6',
        category_id: 'cat-3',
        name: 'Gabardin Pamuk - Bej',
        slug: 'gabardin-pamuk-bej',
        description: 'Sağlam dokunmuş gabardin pamuk. Pantolon, ceket ve çanta yapımı için dayanıklı ve şık.',
        price_per_meter: 159.90,
        min_order_meters: 2,
        stock_meters: 280,
        width_cm: 150,
        weight_gsm: 240,
        composition: '100% Pamuk',
        colors: [
            { name: 'Bej', hex: '#F5F5DC' },
            { name: 'Haki', hex: '#BDB76B' },
            { name: 'Siyah', hex: '#000000' },
        ],
        images: ['/images/products/gabardin-bej-1.jpg'],
        is_active: true,
        is_featured: false,
        created_at: '2025-02-15',
        updated_at: '2025-02-15',
    },
    // Şifon
    {
        id: 'prod-7',
        category_id: 'cat-4',
        name: 'İpek Şifon - Pudra',
        slug: 'ipek-sifon-pudra',
        description: 'Hafif ve zarif ipek karışımlı şifon. Abiye elbise, şal ve dekoratif örtüler için muhteşem akış sağlar.',
        price_per_meter: 219.90,
        min_order_meters: 1,
        stock_meters: 90,
        width_cm: 150,
        weight_gsm: 45,
        composition: '%70 Polyester, %30 İpek',
        colors: [
            { name: 'Pudra', hex: '#FADADD' },
            { name: 'Leylak', hex: '#C8A2C8' },
            { name: 'Mint', hex: '#98FF98' },
        ],
        images: ['/images/products/sifon-pudra-1.jpg'],
        is_active: true,
        is_featured: true,
        created_at: '2025-03-01',
        updated_at: '2025-03-01',
    },
    // Keten
    {
        id: 'prod-8',
        category_id: 'cat-5',
        name: 'Saf Keten - Doğal',
        slug: 'saf-keten-dogal',
        description: 'Belçika keteni kalitesinde saf keten kumaş. Yaz kıyafetleri, masa örtüsü ve perde için harika.',
        price_per_meter: 289.90,
        min_order_meters: 1,
        stock_meters: 150,
        width_cm: 140,
        weight_gsm: 180,
        composition: '100% Keten',
        colors: [
            { name: 'Doğal', hex: '#C2B280' },
            { name: 'Beyaz', hex: '#FFFFFF' },
            { name: 'Açık Gri', hex: '#D3D3D3' },
        ],
        images: ['/images/products/keten-dogal-1.jpg'],
        is_active: true,
        is_featured: false,
        created_at: '2025-03-05',
        updated_at: '2025-03-05',
    },
    // Polyester
    {
        id: 'prod-9',
        category_id: 'cat-6',
        name: 'Oxford Polyester - Lacivert',
        slug: 'oxford-polyester-lacivert',
        description: 'Su geçirmez kaplama oxford polyester. Çanta, kılıf, outdoor ürünleri ve bahçe mobilyası için ideal.',
        price_per_meter: 99.90,
        min_order_meters: 2,
        stock_meters: 500,
        width_cm: 150,
        weight_gsm: 200,
        composition: '100% Polyester',
        colors: [
            { name: 'Lacivert', hex: '#000080' },
            { name: 'Siyah', hex: '#000000' },
            { name: 'Yeşil', hex: '#006400' },
        ],
        images: ['/images/products/oxford-lacivert-1.jpg'],
        is_active: true,
        is_featured: false,
        created_at: '2025-03-10',
        updated_at: '2025-03-10',
    },
    {
        id: 'prod-10',
        category_id: 'cat-6',
        name: 'Scuba Kumaş - Siyah',
        slug: 'scuba-kumas-siyah',
        description: 'Neopren benzeri scuba kumaş. Etek, elbise ve spor giyim için harika form tutar.',
        price_per_meter: 139.90,
        original_price: 169.90,
        min_order_meters: 1,
        stock_meters: 320,
        width_cm: 150,
        weight_gsm: 260,
        composition: '%95 Polyester, %5 Elastan',
        colors: [
            { name: 'Siyah', hex: '#000000' },
            { name: 'Kırmızı', hex: '#CC0000' },
            { name: 'Saks Mavi', hex: '#4169E1' },
        ],
        images: ['/images/products/scuba-siyah-1.jpg'],
        is_active: true,
        is_featured: true,
        created_at: '2025-03-15',
        updated_at: '2025-03-15',
    },
];

// Helper functions
export function getProductsByCategory(categorySlug: string): Product[] {
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return [];
    return products.filter((p) => p.category_id === category.id && p.is_active);
}

export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug && p.is_active);
}

export function getFeaturedProducts(): Product[] {
    return products.filter((p) => p.is_featured && p.is_active);
}

export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}

export function getProductCategory(product: Product): Category | undefined {
    return categories.find((c) => c.id === product.category_id);
}

export function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return products.filter(
        (p) =>
            p.is_active &&
            (p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.composition.toLowerCase().includes(lowerQuery))
    );
}
