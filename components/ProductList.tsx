"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import { Search, Loader2 } from "lucide-react";

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
}

const PRODUCTS_PER_PAGE = 8;

const ProductList = ({ category, search }: { category?: string; search?: string }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setCurrentPage(1);
            setDisplayedProducts([]);
            try {
                let url = "/api/products?";
                if (category) url += `category=${encodeURIComponent(category)}&`;
                if (search) url += `search=${encodeURIComponent(search)}&`;

                const res = await fetch(url);
                const data = await res.json();
                setAllProducts(data);

                // Load first batch
                const firstBatch = data.slice(0, PRODUCTS_PER_PAGE);
                setDisplayedProducts(firstBatch);
                setHasMore(data.length > PRODUCTS_PER_PAGE);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, search]);

    const loadMore = useCallback(() => {
        if (!hasMore || loading) return;

        setLoading(true);
        const nextPage = currentPage + 1;
        const startIndex = nextPage * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const nextBatch = allProducts.slice(startIndex, endIndex);

        setTimeout(() => {
            setDisplayedProducts(prev => [...prev, ...nextBatch]);
            setCurrentPage(nextPage);
            setHasMore(endIndex < allProducts.length);
            setLoading(false);
        }, 300); // Simulate network delay for smoother UX
    }, [currentPage, allProducts, hasMore, loading]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    if (loading && displayedProducts.length === 0) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (allProducts.length === 0 && !loading) {
        return (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-emerald-50 shadow-xl shadow-emerald-900/5">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Search className="text-emerald-300" size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No Items Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-light">We searched everywhere but couldn't find matches. Try refreshing or using different keywords.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-8 bg-emerald-50 text-emerald-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95"
                >
                    Clear All Filters
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {hasMore && (
                <div className="mt-12 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More Products"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
