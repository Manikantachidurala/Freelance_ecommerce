"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AdminManager = () => {
    const [admins, setAdmins] = useState<any[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/admins");
            if (res.ok) {
                const data = await res.json();
                setAdmins(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newAdminEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Admin added successfully");
                setNewAdminEmail("");
                fetchAdmins();
            } else {
                toast.error(data.error || "Failed to add admin");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAdmin = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email} from admins?`)) return;

        try {
            const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Admin removed successfully");
                fetchAdmins();
            } else {
                toast.error("Failed to remove admin");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <UserPlus size={18} className="text-green-600" />
                            Add New Admin
                        </h3>
                    </div>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                                placeholder="user@example.com"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Note: This user will have full access to manage products, orders, and categories, but cannot add other admins.
                            </p>
                        </div>
                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Admin"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="md:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <table className="w-full hidden md:table">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Admin Email</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Added By</th>
                                <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Date Added</th>
                                <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Super Admin Row (Hardcoded/Visual only) */}
                            <tr className="bg-green-50/30">
                                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                    <Shield size={16} className="text-green-600" />
                                    {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Super Admin"}
                                </td>
                                <td className="p-4 text-sm text-gray-500">System</td>
                                <td className="p-4 text-sm text-gray-500">-</td>
                                <td className="p-4 text-right">
                                    <span className="text-xs font-bold text-gray-400 uppercase px-2 py-1 bg-gray-100 rounded">Super Admin</span>
                                </td>
                            </tr>

                            {admins.map((admin) => (
                                <tr key={admin._id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4 font-medium text-gray-900">
                                        {admin.email}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 text-xs">{admin.addedBy}</td>
                                    <td className="p-4 text-sm text-gray-500 text-xs">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleRemoveAdmin(admin._id, admin.email)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Remove Admin"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">No additional admins added yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        <div className="p-4 bg-green-50/30">
                            <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                                <Shield size={16} className="text-green-600" />
                                <span className="truncate">{process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Super Admin"}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">System</span>
                                <span className="font-bold text-gray-400 uppercase px-2 py-0.5 bg-gray-100 rounded">Super Admin</span>
                            </div>
                        </div>

                        {admins.map((admin) => (
                            <div key={admin._id} className="p-4">
                                <div className="flex justify-between items-start gap-3 mb-2">
                                    <div>
                                        <p className="font-bold text-gray-900">{admin.email}</p>
                                        <p className="text-xs text-gray-500">Added by: {admin.addedBy}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAdmin(admin._id, admin.email)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Remove Admin"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Added on: {new Date(admin.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}

                        {admins.length === 0 && (
                            <div className="p-8 text-center text-gray-400 italic">No additional admins added yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManager;
