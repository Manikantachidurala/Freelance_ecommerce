"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import ProductForm from "@/components/Admin/ProductForm";
import OrderList from "@/components/Admin/OrderList";
import DashboardStats from "@/components/Admin/DashboardStats";
import CategoryManager from "@/components/Admin/CategoryManager";
import AdminProductList from "@/components/Admin/ProductList";
import AdminManager from "@/components/Admin/AdminManager";
import CouponManager from "@/components/Admin/CouponManager";
import { Plus, Package, ClipboardList, BarChart3, Tag, Users, Ticket, Search as SearchIcon, X } from "lucide-react";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const [activeTab, setActiveTab] = useState("stats");
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        if (isLoaded && !user) {
            redirect("/sign-in");
        }

        const checkAdminStatus = async () => {
            if (!user) return;

            const email = user.emailAddresses[0].emailAddress;
            const superAdmin = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

            setIsSuperAdmin(superAdmin);

            if (superAdmin) {
                setIsAdmin(true);
            } else {
                // Check if regular admin
                try {
                    const res = await fetch("/api/check-admin");
                    const data = await res.json();
                    if (data.isAdmin) {
                        setIsAdmin(true);
                    } else {
                        redirect("/");
                    }
                } catch (error) {
                    redirect("/");
                }
            }
        };

        if (isLoaded) {
            checkAdminStatus();
        }
    }, [user, isLoaded]);

    if (!isLoaded || !isAdmin) return <div className="p-10 text-center font-bold text-gray-500">Loading admin suite...</div>;

    const tabs = [
        { id: "stats", label: "Stats", icon: <BarChart3 size={18} /> },
        { id: "orders", label: "Orders", icon: <ClipboardList size={18} /> },
        { id: "products", label: "Products", icon: <Package size={18} /> },
        { id: "categories", label: "Categories", icon: <Tag size={18} /> },
        { id: "coupons", label: "Coupons", icon: <Ticket size={18} /> },
    ];

    if (isSuperAdmin) {
        tabs.push({ id: "admins", label: "Admins", icon: <Users size={18} /> });
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 font-medium">Manage your products, orders and categories</p>
                </div>

                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setShowProductForm(true);
                    }}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
                >
                    <Plus size={20} /> New Product
                </button>
            </div>

            <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === tab.id
                            ? "border-green-600 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {activeTab === "stats" && <DashboardStats />}
                {activeTab === "orders" && <OrderList />}
                {activeTab === "products" && (
                    <AdminProductList
                        key={refreshKey}
                        externalSearchQuery={searchQuery}
                        onEdit={(p: any) => {
                            setEditingProduct(p);
                            setShowProductForm(true);
                        }} />
                )}
                {activeTab === "categories" && <CategoryManager />}
                {activeTab === "coupons" && <CouponManager />}
                {activeTab === "admins" && isSuperAdmin && <AdminManager />}
            </div>

            {showProductForm && (
                <ProductForm
                    onClose={() => setShowProductForm(false)}
                    initialData={editingProduct}
                    onSuccess={() => {
                        setShowProductForm(false);
                        setRefreshKey(prev => prev + 1);
                        if (activeTab === "stats") window.location.reload();
                    }}
                />
            )}
        </div>
    );
}

