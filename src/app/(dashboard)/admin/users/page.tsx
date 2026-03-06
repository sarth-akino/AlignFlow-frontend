"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RoleBadge from "@/components/shared/RoleBadge";
import { Users, Plus, Trash2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";
import CreateUserModal from "@/components/admin/CreateUserModal";
import { useAuth } from "@/lib/auth";

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await api.getUsers();
            setUsers(data.users);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.user_id !== id));
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <Navbar title="User Management" subtitle="Create, edit, and delete user accounts" />
            <div style={{ padding: "1.5rem" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        Manage {users.length} users across the platform.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} /> Create User
                    </Button>
                </div>

                <Card padding="sm">
                    {loading ? (
                        <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
                            <Loader2 className="animate-spin text-muted" size={32} />
                        </div>
                    ) : users.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                            No users found.
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--text-secondary)" }}>
                                        <th style={{ padding: "1rem" }}>Name</th>
                                        <th style={{ padding: "1rem" }}>Email</th>
                                        <th style={{ padding: "1rem" }}>Role</th>
                                        <th style={{ padding: "1rem" }}>Joined</th>
                                        <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.user_id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                                            <td style={{ padding: "1rem", fontWeight: 500 }}>{u.name}</td>
                                            <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{u.email}</td>
                                            <td style={{ padding: "1rem" }}>
                                                <RoleBadge role={u.role} />
                                            </td>
                                            <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: "1rem", textAlign: "right" }}>
                                                {currentUser?.user_id !== u.user_id && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(u.user_id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

            </div>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadUsers}
            />
        </AuthGuard>
    );
}
