'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order');

    return (
        <div className="min-h-screen bg-surface-50 py-16">
            <div className="container-main max-w-2xl text-center">
                <div className="bg-white rounded-2xl p-10 md:p-14 shadow-sm">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-surface-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        Siparişiniz Alındı! 🎉
                    </h1>
                    
                    <p className="text-surface-500 mb-6 max-w-md mx-auto">
                        Ödemeniz başarıyla tamamlandı. Siparişiniz en kısa sürede hazırlanıp kargoya verilecektir.
                    </p>

                    {orderId && (
                        <div className="bg-surface-50 rounded-xl p-4 mb-8 inline-block">
                            <p className="text-sm text-surface-400 mb-1">Sipariş No</p>
                            <p className="text-lg font-bold text-surface-800 font-mono">{orderId.slice(0, 8).toUpperCase()}</p>
                        </div>
                    )}

                    <div className="space-y-3 text-left bg-green-50 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <Package size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-800">Sipariş onay bilgileri e-posta adresinize gönderilecektir.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Package size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-800">Kargo takip numaranız, siparişiniz kargoya verildiğinde tarafınıza iletilecektir.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/kategori" className="btn btn-primary inline-flex items-center gap-2">
                            Alışverişe Devam Et
                            <ArrowRight size={16} />
                        </Link>
                        <Link href="/" className="btn btn-secondary inline-flex">
                            Ana Sayfa
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
