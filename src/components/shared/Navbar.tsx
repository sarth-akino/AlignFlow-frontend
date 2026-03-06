"use client";

import { useAuth } from "@/lib/auth";
import Badge from "@/components/ui/Badge";
import { Bell } from "lucide-react";

interface NavbarProps {
    title: string;
    subtitle?: string;
}

export default function Navbar({ title, subtitle }: NavbarProps) {
    const { user } = useAuth();

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-primary)",
                position: "sticky",
                top: 0,
                zIndex: 40,
                backdropFilter: "blur(8px)",
            }}
        >
            <div>
                <h1
                    style={{
                        fontSize: "1.35rem",
                        fontWeight: 600,
                        fontFamily: "'Space Grotesk', sans-serif",
                    }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                        {subtitle}
                    </p>
                )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Notification bell placeholder */}
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "36px",
                        height: "36px",
                        borderRadius: "var(--radius-md)",
                        background: "transparent",
                        border: "1px solid var(--border)",
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
                    <Bell size={16} />
                </button>

                {/* User avatar placeholder */}
                {user && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.3rem 0.6rem 0.3rem 0.3rem",
                            borderRadius: "var(--radius-md)",
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <div
                            style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "var(--radius-sm)",
                                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "white",
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{user.name}</span>
                    </div>
                )}
            </div>
        </header>
    );
}
