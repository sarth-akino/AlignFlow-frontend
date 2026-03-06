"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, getRoleHomePath } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogIn } from "lucide-react";

export default function LoginPage() {
    const { login, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    if (user) {
        router.replace(getRoleHomePath(user.role));
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            // Auth context will update user, then the redirect at the top kicks in
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                position: "relative",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(99,102,241,0.08), transparent)",
                    pointerEvents: "none",
                }}
            />

            <div
                className="animate-fade-in"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "var(--radius-lg)",
                            background: "var(--accent-glow)",
                            border: "1px solid var(--accent)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "0.75rem",
                        }}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: "var(--accent-light)" }}
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1
                        className="gradient-text"
                        style={{
                            fontSize: "1.75rem",
                            fontWeight: 700,
                            fontFamily: "'Space Grotesk', sans-serif",
                        }}
                    >
                        AlignFlow
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                        Sign in to your account
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: "2rem" }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div
                                style={{
                                    padding: "0.6rem 0.8rem",
                                    background: "var(--red-soft)",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--red)",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <Button type="submit" loading={loading} size="lg" style={{ width: "100%" }}>
                            <LogIn size={16} /> Sign In
                        </Button>
                    </form>
                </div>

                {/* Register link */}
                <p
                    style={{
                        textAlign: "center",
                        marginTop: "1.25rem",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                    }}
                >
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        style={{
                            color: "var(--accent-light)",
                            textDecoration: "none",
                            fontWeight: 500,
                        }}
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
