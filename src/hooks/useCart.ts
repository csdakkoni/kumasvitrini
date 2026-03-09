'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/lib/types';

const CART_KEY = 'kumas-shop-cart';

function loadCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveCart(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        setItems(loadCart());
        setIsLoaded(true);
    }, []);

    // Save cart whenever items change
    useEffect(() => {
        if (isLoaded) {
            saveCart(items);
            // Dispatch custom event for other components to listen
            window.dispatchEvent(new Event('cart-updated'));
        }
    }, [items, isLoaded]);

    const addItem = useCallback((product: Product, meters: number, selectedColor?: string) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.product.id === product.id && item.selectedColor === selectedColor
            );
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    meters: updated[existingIndex].meters + meters,
                };
                return updated;
            }
            return [...prev, { product, meters, selectedColor }];
        });
    }, []);

    const removeItem = useCallback((productId: string, selectedColor?: string) => {
        setItems((prev) =>
            prev.filter(
                (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
            )
        );
    }, []);

    const updateMeters = useCallback((productId: string, meters: number, selectedColor?: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId && item.selectedColor === selectedColor
                    ? { ...item, meters: Math.max(item.product.min_order_meters, meters) }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalMeters = items.reduce((sum, item) => sum + item.meters, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.meters * item.product.price_per_meter,
        0
    );
    const itemCount = items.length;

    return {
        items,
        isLoaded,
        addItem,
        removeItem,
        updateMeters,
        clearCart,
        totalMeters,
        totalPrice,
        itemCount,
    };
}
