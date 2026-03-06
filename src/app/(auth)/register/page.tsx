"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, getRoleHomePath } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
    const { register, user } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || "Registration failed. Please try again.");
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
                        "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(34, 197, 94, 0.06), transparent)",
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
                        Create your applicant account
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: "2rem" }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@email.com"
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

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <UserPlus size={16} /> Create Account
                        </Button>
                    </form>
                </div>

                {/* Login link */}
                <p
                    style={{
                        textAlign: "center",
                        marginTop: "1.25rem",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                    }}
                >
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        style={{
                            color: "var(--accent-light)",
                            textDecoration: "none",
                            fontWeight: 500,
                        }}
                    >
                        Sign in
                    </Link>
                </p>

                {/* Note */}
                <p
                    style={{
                        textAlign: "center",
                        marginTop: "0.75rem",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        opacity: 0.7,
                    }}
                >
                    Recruiter accounts are created by administrators.
                </p>
            </div>
        </div>
    );
}
