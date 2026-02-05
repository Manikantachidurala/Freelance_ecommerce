"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Pencil } from "lucide-react";

const CategoryManager = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setCategories([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCategory),
            });

            if (res.ok) {
                setNewCategory({ name: "", description: "" });
                setEditingId(null);
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: any) => {
        setNewCategory({ name: category.name, description: category.description });
        setEditingId(category._id);
    };

    const handleCancel = () => {
        setNewCategory({ name: "", description: "" });
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (res.ok) fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const seedDefaults = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/seed", { method: "POST" });
            if (res.ok) fetchCategories();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            {editingId ? <Pencil size={18} className="text-blue-600" /> : <Plus size={18} className="text-green-600" />}
                            {editingId ? "Edit Category" : "Add Category"}
                        </h3>
                        <button
                            onClick={seedDefaults}
                            className="text-[10px] font-bold uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 px-2 py-1 rounded"
                        >
                            Seed Defaults
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition resize-none"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                disabled={loading}
                                className={`w-full ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 rounded-lg font-bold transition disabled:opacity-50`}
                            >
                                {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Category" : "Add Category")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="md:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <table className="w-full hidden md:table">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Category Name</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Description</th>
                                <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                            <Tag size={16} />
                                        </div>
                                        {cat.name}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{cat.description}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="p-8 text-center text-gray-400 italic">No categories created yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <div key={cat._id} className="p-4">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                        <div className="p-1.5 bg-green-50 rounded-md text-green-600">
                                            <Tag size={14} />
                                        </div>
                                        {cat.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 pl-9">{cat.description}</p>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="p-8 text-center text-gray-400 italic">No categories created yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
