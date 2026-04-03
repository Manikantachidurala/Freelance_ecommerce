"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Package, Tag, Search } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
    unit: string;
    hasVariants?: boolean;
    variants?: Array<{
        name: string;
        price: number;
        discountedPrice?: number;
        stock: number;
    }>;
}

const AdminProductList = ({ onEdit, externalSearchQuery = "" }: { onEdit: (product: Product) => void, externalSearchQuery?: string }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(externalSearchQuery);

    useEffect(() => {
        setSearchQuery(externalSearchQuery);
    }, [externalSearchQuery]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter((p) => p._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700"
                />
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-400 italic">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading products...</p>
                    </div>
                </div>
            ) : (
                <>
                    {searchQuery && (
                        <p className="text-sm text-gray-500 font-medium px-2">
                            Showing {filteredProducts.length} results for "{searchQuery}"
                        </p>
                    )}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Desktop Table Content... */}
                        {/* (Internal table and mobile card logic remains the same) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Price</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Stock</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                    <div>
                                                        <p className="font-bold text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.unit}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    <Tag size={12} />
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {(product as any).hasVariants ? (
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-bold text-purple-600 uppercase">Multiple Options</p>
                                                        {(product as any).variants?.slice(0, 2).map((v: any, i: number) => (
                                                            <p key={i} className="text-xs text-gray-600">• {v.name}: ₹{v.discountedPrice || v.price}</p>
                                                        ))}
                                                        {(product as any).variants?.length > 2 && (
                                                            <p className="text-xs text-gray-400 italic">+{(product as any).variants.length - 2} more</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="font-bold text-gray-900">₹{product.price}</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {(product as any).hasVariants ? (
                                                    <div className="text-xs text-gray-600">
                                                        {(product as any).variants?.reduce((sum: number, v: any) => sum + v.stock, 0)} total
                                                    </div>
                                                ) : (
                                                    <span className={`font-medium ${product.stock <= 5 ? "text-red-600" : "text-gray-600"}`}>
                                                        {product.stock} {product.unit}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onEdit(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-gray-400 italic">No products found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 break-words">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.unit}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900 flex-shrink-0">₹{product.price}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                            <Tag size={10} />
                                            {product.category}
                                        </span>
                                        {(product as any).hasVariants ? (
                                            <span className="text-xs font-medium text-purple-600">
                                                {(product as any).variants?.length} options
                                            </span>
                                        ) : (
                                            <span className={`text-xs font-medium ${product.stock <= 5 ? "text-red-600" : "text-gray-600"}`}>
                                                Stock: {product.stock} {product.unit}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2"
                                        >
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="p-8 text-center text-gray-400 italic">No products found.</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminProductList;
