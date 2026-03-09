import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
    }).format(price);
}

export function formatMeter(meters: number): string {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters.toFixed(1)} m`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export function getDiscountPercent(original: number, current: number): number {
    return Math.round(((original - current) / original) * 100);
}

export const FREE_SHIPPING_THRESHOLD = 500; // TL
export const FLAT_SHIPPING_COST = 49.90; // TL

export function calculateShipping(totalPrice: number): number {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) return 0;
    return FLAT_SHIPPING_COST;
}

export function generateWhatsAppUrl(items: { name: string; meters: number; price: number }[]): string {
    const phone = '905XXXXXXXXX'; // TODO: Gerçek numara eklenecek
    const itemLines = items.map(
        (item) => `• ${item.name} - ${item.meters}m x ${formatPrice(item.price)} = ${formatPrice(item.meters * item.price)}`
    );
    const total = items.reduce((sum, item) => sum + item.meters * item.price, 0);
    const message = encodeURIComponent(
        `Merhaba! Aşağıdaki ürünleri sipariş vermek istiyorum:\n\n${itemLines.join('\n')}\n\nToplam: ${formatPrice(total)}\n\nTeşekkürler!`
    );
    return `https://wa.me/${phone}?text=${message}`;
}
