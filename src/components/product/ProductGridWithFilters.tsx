'use client';

import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridWithFiltersProps {
    initialProducts: Product[];
}

export function ProductGridWithFilters({ initialProducts }: ProductGridWithFiltersProps) {
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedCompositions, setSelectedCompositions] = useState<string[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Filter Extractors
    const allColors = useMemo(() => {
        const colors = new Set<string>();
        initialProducts.forEach(p => p.colors.forEach(c => colors.add(c.name)));
        return Array.from(colors).sort();
    }, [initialProducts]);

    const allCompositions = useMemo(() => {
        const comps = new Set<string>();
        initialProducts.forEach(p => {
            if (p.composition) comps.add(p.composition);
        });
        return Array.from(comps).sort();
    }, [initialProducts]);

    const weightRanges = [
        { id: 'light', label: 'Hafif (<150 g/m²)', filter: (w: number) => w < 150 },
        { id: 'medium', label: 'Orta (150-250 g/m²)', filter: (w: number) => w >= 150 && w <= 250 },
        { id: 'heavy', label: 'Ağır (>250 g/m²)', filter: (w: number) => w > 250 },
    ];

    // Filter engine
    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            // Color check
            const matchesColor = selectedColors.length === 0 || 
                product.colors.some(c => selectedColors.includes(c.name));
            
            // Composition check
            const matchesComp = selectedCompositions.length === 0 || 
                selectedCompositions.includes(product.composition);

            // Weight check
            const matchesWeight = selectedWeights.length === 0 || 
                selectedWeights.some(rangeId => {
                    const range = weightRanges.find(r => r.id === rangeId);
                    return range ? range.filter(product.weight_gsm) : false;
                });

            return matchesColor && matchesComp && matchesWeight;
        });
    }, [initialProducts, selectedColors, selectedCompositions, selectedWeights]);

    const handleCheckboxChange = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        currentValues: string[],
        value: string
    ) => {
        if (currentValues.includes(value)) {
            setter(currentValues.filter(v => v !== value));
        } else {
            setter([...currentValues, value]);
        }
    };

    const clearFilters = () => {
        setSelectedColors([]);
        setSelectedCompositions([]);
        setSelectedWeights([]);
    };

    const activeFilterCount = selectedColors.length + selectedCompositions.length + selectedWeights.length;

    const FilterSidebar = () => (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-surface-200">
                <h3 className="font-bold text-surface-900" style={{ fontFamily: 'var(--font-display)' }}>Filtreler</h3>
                {activeFilterCount > 0 && (
                    <button 
                        onClick={clearFilters}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Temizle ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Colors */}
            {allColors.length > 0 && (
                <div>
                    <h4 className="font-semibold text-surface-800 mb-3 text-sm">Renkler</h4>
                    <div className="space-y-2">
                        {allColors.map(color => (
                            <label key={color} className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                                    checked={selectedColors.includes(color)}
                                    onChange={() => handleCheckboxChange(setSelectedColors, selectedColors, color)}
                                />
                                <span className="text-sm text-surface-600 group-hover:text-surface-900">{color}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Composition */}
            {allCompositions.length > 0 && (
                <div>
                    <h4 className="font-semibold text-surface-800 mb-3 text-sm">Kumaş Karışımı</h4>
                    <div className="space-y-2">
                        {allCompositions.map(comp => (
                            <label key={comp} className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                                    checked={selectedCompositions.includes(comp)}
                                    onChange={() => handleCheckboxChange(setSelectedCompositions, selectedCompositions, comp)}
                                />
                                <span className="text-sm text-surface-600 group-hover:text-surface-900 text-xs">{comp}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Weight */}
            <div>
                <h4 className="font-semibold text-surface-800 mb-3 text-sm">Kumaş Ağırlığı</h4>
                <div className="space-y-2">
                    {weightRanges.map(range => (
                        <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="rounded border-surface-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                                checked={selectedWeights.includes(range.id)}
                                onChange={() => handleCheckboxChange(setSelectedWeights, selectedWeights, range.id)}
                            />
                            <span className="text-sm text-surface-600 group-hover:text-surface-900">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex justify-between items-center mb-4">
                <span className="text-sm text-surface-500">{filteredProducts.length} ürün</span>
                <button 
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="btn btn-secondary btn-sm flex items-center gap-2"
                >
                    <Filter size={16} /> 
                    Filtrele {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                    <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto p-6 shadow-2xl ml-auto flex flex-col">
                        <div className="flex justify-between items-center mb-6 border-b border-surface-100 pb-4">
                            <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>Filtrele</h2>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 -mr-2 text-surface-500 hover:text-surface-900">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <FilterSidebar />
                        </div>
                        <div className="pt-6 border-t border-surface-100 mt-auto">
                            <button 
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="btn btn-primary w-full"
                            >
                                Sonuçları Göster ({filteredProducts.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-1/4 flex-shrink-0 sticky top-28 self-start">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100">
                     <FilterSidebar />
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 w-full lg:w-3/4">
                {/* Desktop Product Count */}
                <div className="hidden lg:flex justify-end mb-6">
                     <span className="text-sm text-surface-500">{filteredProducts.length} ürün gösteriliyor</span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {filteredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface-50 rounded-2xl border border-surface-100">
                        <Filter className="mx-auto text-surface-300 mb-4" size={32} />
                        <h3 className="text-surface-900 font-bold text-lg mb-2">Eşleşen ürün bulunamadı</h3>
                        <p className="text-surface-500 mb-6">Seçtiğiniz filtrelere uygun ürün gözükmüyor.</p>
                        <button onClick={clearFilters} className="btn btn-primary">Filtreleri Temizle</button>
                    </div>
                )}
            </div>
        </div>
    );
}
