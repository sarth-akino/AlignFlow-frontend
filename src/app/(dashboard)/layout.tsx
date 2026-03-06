"use client";

import Sidebar from "@/components/shared/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main
                style={{
                    flex: 1,
                    minHeight: "100vh",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                {/* Ambient background glow */}
                <div
                    className="pointer-events-none"
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse 60% 30% at 70% 0%, rgba(99,102,241,0.04), transparent)",
                        zIndex: 0,
                    }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
            </main>
        </div>
    );
}
