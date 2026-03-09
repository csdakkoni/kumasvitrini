import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: {
        default: 'Kumaş Dükkanı - Metrelik Kumaş Satışı',
        template: '%s | Kumaş Dükkanı',
    },
    description:
        'Kadife, saten, pamuklu, şifon, keten ve polyester kumaşlar. Metre ile online kumaş satışı. Hızlı kargo, güvenli ödeme.',
    keywords: [
        'kumaş',
        'metrelik kumaş',
        'online kumaş',
        'kadife',
        'saten',
        'pamuklu',
        'şifon',
        'keten',
        'kumaş satış',
    ],
    robots: 'index, follow',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
