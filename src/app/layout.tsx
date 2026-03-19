import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Font Optimization
const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-inter',
});

const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
});

const APP_NAME = 'Kumaş Dükkanı';
const APP_DESC = 'Kadife, saten, pamuklu, şifon, keten ve polyester kumaşlar. Metre ile online kumaş satışı. Hızlı kargo, güvenli ödeme.';

export const metadata: Metadata = {
    title: {
        default: `${APP_NAME} - Metrelik Kumaş Satışı`,
        template: `%s | ${APP_NAME}`,
    },
    description: APP_DESC,
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
        'kumaş sipariş',
        'toptan kumaş',
    ],
    authors: [{ name: APP_NAME }],
    robots: 'index, follow',
    openGraph: {
        type: 'website',
        locale: 'tr_TR',
        url: 'https://kumasvitrini.vercel.app',
        title: APP_NAME,
        description: APP_DESC,
        siteName: APP_NAME,
        images: [
            {
                url: '/images/og-image.jpg', // Will need to ensure this image exists or is generated
                width: 1200,
                height: 630,
                alt: 'Kumaş Dükkanı - Premium Kumaşlar',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: APP_NAME,
        description: APP_DESC,
        images: ['/images/og-image.jpg'],
    },
    metadataBase: new URL('https://kumasvitrini.vercel.app'),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
            <body className="font-sans min-h-screen flex flex-col antialiased">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
