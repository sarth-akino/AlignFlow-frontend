"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import { LayoutDashboard, Users, Briefcase, FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { DashboardStats } from "@/lib/types";

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getStats()
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <Navbar title="Admin Dashboard" subtitle="Manage users, jobs, and application data" />
            <div style={{ padding: "1.5rem" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "1rem",
                        marginBottom: "2rem",
                    }}
                >
                    {[
                        { label: "Total Users", value: stats?.total_users, icon: <Users size={20} />, color: "var(--blue)" },
                        { label: "Recruiters", value: stats?.total_recruiters, icon: <LayoutDashboard size={20} />, color: "var(--accent-light)" },
                        { label: "Open Jobs", value: stats?.total_jobs, icon: <Briefcase size={20} />, color: "var(--green)" },
                        { label: "Applications", value: stats?.total_applications, icon: <FileText size={20} />, color: "var(--yellow)" },
                    ].map((stat) => (
                        <Card key={stat.label} hover>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "var(--radius-md)",
                                        background: `${stat.color}15`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: stat.color,
                                    }}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{stat.label}</p>
                                    <p
                                        style={{
                                            fontSize: "1.5rem",
                                            fontWeight: 700,
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin text-muted" /> : (stat.value ?? "—")}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>
                        Admin panel will be wired to the backend API in Phase 3.
                        <br />
                        <span style={{ fontSize: "0.8rem" }}>Stats cards, user management, and data editing coming soon.</span>
                    </p>
                </Card>
            </div>
        </AuthGuard>
    );
}
