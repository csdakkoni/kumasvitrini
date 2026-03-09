'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface MeterSelectorProps {
    minMeters: number;
    maxMeters: number;
    value: number;
    onChange: (meters: number) => void;
    pricePerMeter: number;
}

export function MeterSelector({
    minMeters,
    maxMeters,
    value,
    onChange,
    pricePerMeter,
}: MeterSelectorProps) {
    const [inputValue, setInputValue] = useState(value.toString());

    const handleDecrement = () => {
        const newVal = Math.max(minMeters, value - 0.5);
        onChange(newVal);
        setInputValue(newVal.toString());
    };

    const handleIncrement = () => {
        const newVal = Math.min(maxMeters, value + 0.5);
        onChange(newVal);
        setInputValue(newVal.toString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);
        const parsed = parseFloat(raw);
        if (!isNaN(parsed) && parsed >= minMeters && parsed <= maxMeters) {
            onChange(parsed);
        }
    };

    const handleBlur = () => {
        const parsed = parseFloat(inputValue);
        if (isNaN(parsed) || parsed < minMeters) {
            onChange(minMeters);
            setInputValue(minMeters.toString());
        } else if (parsed > maxMeters) {
            onChange(maxMeters);
            setInputValue(maxMeters.toString());
        } else {
            // Round to nearest 0.5
            const rounded = Math.round(parsed * 2) / 2;
            onChange(rounded);
            setInputValue(rounded.toString());
        }
    };

    const totalPrice = value * pricePerMeter;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-surface-700">
                    Metre Seçin
                </label>
                <span className="text-xs text-surface-400">
                    Min: {minMeters}m • Stok: {maxMeters}m
                </span>
            </div>

            <div className="meter-input">
                <button
                    onClick={handleDecrement}
                    disabled={value <= minMeters}
                    className="meter-btn disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Azalt"
                >
                    <Minus size={18} />
                </button>
                <input
                    type="text"
                    inputMode="decimal"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="meter-value"
                    aria-label="Metre miktarı"
                />
                <span className="text-surface-400 text-sm font-medium pr-1">m</span>
                <button
                    onClick={handleIncrement}
                    disabled={value >= maxMeters}
                    className="meter-btn disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Arttır"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Price calculation */}
            <div className="bg-primary-50 rounded-xl p-4 flex items-center justify-between">
                <div className="text-sm text-surface-600">
                    <span className="font-medium">{value}m</span> × {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(pricePerMeter)}/m
                </div>
                <div className="text-xl font-bold text-primary-700">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalPrice)}
                </div>
            </div>
        </div>
    );
}
