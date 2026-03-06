"use client";

import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Database,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
    { label: "Data", href: "/admin/data", icon: <Database size={18} /> },
];

const recruiterNav: NavItem[] = [
    { label: "My Jobs", href: "/recruiter", icon: <Briefcase size={18} /> },
];

const userNav: NavItem[] = [
    { label: "Browse Jobs", href: "/jobs", icon: <Briefcase size={18} /> },
    { label: "My Applications", href: "/jobs/my-applications", icon: <FileText size={18} /> },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const navItems =
        user.role === "admin"
            ? adminNav
            : user.role === "recruiter"
                ? recruiterNav
                : userNav;

    const roleLabel =
        user.role === "admin"
            ? "Admin"
            : user.role === "recruiter"
                ? "Recruiter"
                : "Applicant";

    const roleColor =
        user.role === "admin"
            ? "var(--red)"
            : user.role === "recruiter"
                ? "var(--accent-light)"
                : "var(--green)";

    return (
        <aside
            style={{
                width: collapsed ? "68px" : "240px",
                minHeight: "100vh",
                background: "var(--bg-secondary)",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.25s ease",
                position: "sticky",
                top: 0,
                zIndex: 50,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: collapsed ? "1.25rem 0.75rem" : "1.25rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                {!collapsed && (
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <span
                            className="gradient-text"
                            style={{
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                        >
                            AlignFlow
                        </span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "var(--radius-sm)",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--bg-elevated)";
                        e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-muted)";
                    }}
                >
                    {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Role badge */}
            {!collapsed && (
                <div style={{ padding: "0.75rem 1rem" }}>
                    <span
                        style={{
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: roleColor,
                            opacity: 0.8,
                        }}
                    >
                        {roleLabel}
                    </span>
                </div>
            )}

            {/* Nav Links */}
            <nav style={{ flex: 1, padding: "0.5rem" }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/admin" && item.href !== "/recruiter" && item.href !== "/jobs" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: collapsed ? "0.6rem" : "0.6rem 0.75rem",
                                borderRadius: "var(--radius-md)",
                                textDecoration: "none",
                                fontSize: "0.85rem",
                                fontWeight: isActive ? 500 : 400,
                                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                                background: isActive ? "var(--accent-glow)" : "transparent",
                                transition: "all 0.15s ease",
                                marginBottom: "0.25rem",
                                justifyContent: collapsed ? "center" : "flex-start",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "var(--bg-elevated)";
                                    e.currentTarget.style.color = "var(--text-primary)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }
                            }}
                        >
                            <span style={{ color: isActive ? "var(--accent-light)" : "inherit" }}>
                                {item.icon}
                            </span>
                            {!collapsed && item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User info + Logout */}
            <div
                style={{
                    padding: collapsed ? "0.75rem" : "0.75rem 1rem",
                    borderTop: "1px solid var(--border)",
                }}
            >
                {!collapsed && (
                    <div style={{ marginBottom: "0.5rem" }}>
                        <p
                            style={{
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                color: "var(--text-primary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {user.name}
                        </p>
                        <p
                            style={{
                                fontSize: "0.7rem",
                                color: "var(--text-muted)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {user.email}
                        </p>
                    </div>
                )}
                <button
                    onClick={logout}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        width: "100%",
                        padding: "0.5rem 0.6rem",
                        borderRadius: "var(--radius-md)",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        justifyContent: collapsed ? "center" : "flex-start",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--red-soft)";
                        e.currentTarget.style.color = "var(--red)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-muted)";
                    }}
                >
                    <LogOut size={16} />
                    {!collapsed && "Log Out"}
                </button>
            </div>
        </aside>
    );
}
