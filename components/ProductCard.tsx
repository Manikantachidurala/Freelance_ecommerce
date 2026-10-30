
"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";

interface Variant {
    name: string;
    price: number;
    discountedPrice?: number;
    stock: number;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
    unit: string;
    discountedPrice?: number;
    hasVariants?: boolean;
    variants?: Variant[];
}

const ProductCard = ({ product }: { product: Product }) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.hasVariants && product.variants && product.variants.length > 0
            ? product.variants[0]
            : null
    );

    const currentPrice = useMemo(() => {
        if (selectedVariant) return selectedVariant.price;
        return product.price;
    }, [product, selectedVariant]);

    const currentDiscountPrice = useMemo(() => {
        if (selectedVariant) return selectedVariant.discountedPrice;
        return product.discountedPrice;
    }, [product, selectedVariant]);

    const currentStock = useMemo(() => {
        if (selectedVariant) return selectedVariant.stock;
        return product.stock;
    }, [product, selectedVariant]);

    const addToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        if (product.hasVariants && !selectedVariant) {
            toast.error("Please select an option");
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        let existingItemIndex = -1;

        if (product.hasVariants && selectedVariant) {
            // Find item matching both ID and Variant Name
            existingItemIndex = cart.findIndex((item: any) =>
                item.productId === product._id && item.variant === selectedVariant.name
            );
        } else {
            existingItemIndex = cart.findIndex((item: any) =>
                item.productId === product._id && !item.variant
            );
        }

        if (existingItemIndex > -1) {
            if (cart[existingItemIndex].quantity + 1 > currentStock) {
                toast.error(`Only ${currentStock} items available in stock!`);
                return;
            }
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                productId: product._id,
                name: product.name,
                price: currentDiscountPrice || currentPrice,
                originalPrice: currentPrice, // Store original for future ref
                quantity: 1,
                imageUrl: product.imageUrl,
                unit: product.unit,
                variant: selectedVariant?.name, // Add variant to cart item
                isVariant: !!product.hasVariants
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} added to cart!`);
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-3 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 border border-emerald-50/50 group flex flex-col h-full relative overflow-hidden">
            <Link href={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-50">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {currentDiscountPrice && currentDiscountPrice < currentPrice && (
                        <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30">
                            {Math.round(((currentPrice - currentDiscountPrice) / currentPrice) * 100)}% OFF
                        </div>
                    )}
                </div>

                {currentStock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Out of Stock</span>
                    </div>
                )}

                {/* Quick Action Overlay (Only on desktop hover) */}
                <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 hidden md:block">
                    <button
                        onClick={addToCart}
                        disabled={currentStock <= 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-emerald-600/30 active:scale-95 disabled:opacity-50 disabled:bg-gray-400"
                    >
                        Add to Cart
                    </button>
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <div className="mb-4">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">{product.category}</p>
                    <Link href={`/product/${product._id}`} className="block">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Variant Selector */}
                {product.hasVariants && product.variants && (
                    <div className="mb-6">
                        <div className="relative group/select">
                            <select
                                className="w-full appearance-none bg-emerald-50/30 border border-emerald-100/50 text-gray-700 py-3 px-4 pr-10 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer font-bold transition-all hover:bg-emerald-50/50"
                                value={selectedVariant?.name}
                                onChange={(e) => {
                                    const v = product.variants?.find(v => v.name === e.target.value);
                                    if (v) setSelectedVariant(v);
                                }}
                            >
                                {product.variants.map((v, idx) => (
                                    <option key={`${product._id}-variant-${idx}`} value={v.name}>
                                        {v.name} - ₹{v.discountedPrice || v.price}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none transition-transform group-focus-within/select:rotate-180" />
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-emerald-50/50 flex items-center justify-between">
                    <div>
                        {currentDiscountPrice && currentDiscountPrice < currentPrice ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 line-through font-medium">₹{currentPrice}</span>
                                <span className="text-2xl font-black text-emerald-700 leading-none tracking-tight">₹{currentDiscountPrice}</span>
                            </div>
                        ) : (
                            <p className="text-2xl font-black text-gray-900 leading-none tracking-tight mb-1">₹{currentPrice}</p>
                        )}
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                            {product.hasVariants ? "Selected Variant" : `per ${product.unit}`}
                        </p>
                    </div>

                    {/* Compact Add button for mobile */}
                    <button
                        onClick={addToCart}
                        disabled={currentStock <= 0}
                        className="md:hidden bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20 active:scale-90"
                    >
                        <Plus size={24} />
                    </button>

                    <div className="hidden md:flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        In Stock
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
