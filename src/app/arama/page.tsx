'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    return (
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-surface-800 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {query ? `"${query}" arama sonuçları` : 'Arama Sonuçları'}
            </h1>
            
            <p className="text-surface-500 mb-8 max-w-lg mx-auto">
                {query 
                    ? 'Aradığınız kelimeye uygun aktif ürün bulunamadı. Lütfen farklı anahtar kelimeler deneyin veya kategorilerimize göz atın.' 
                    : 'Arama terimi girmediniz. Lütfen yukarıdaki arama çubuğunu kullanarak aramak istediğiniz ürünü yazın.'}
            </p>

            <Link href="/kategori" className="btn btn-primary inline-flex">
                Tüm Ürünleri Gör
            </Link>
        </div>
    );
}

export default function AramaPage() {
    return (
        <div className="min-h-screen bg-surface-50 py-12">
            <div className="container-main max-w-4xl">
                <Suspense fallback={<div className="text-center py-20 text-surface-500">Yükleniyor...</div>}>
                    <SearchResults />
                </Suspense>
            </div>
        </div>
    );
}
