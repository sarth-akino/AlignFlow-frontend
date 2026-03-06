"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", loading, children, disabled, className = "", style, ...props }, ref) => {
        const baseStyle: React.CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontWeight: 500,
            borderRadius: "var(--radius-md)",
            transition: "all 0.2s ease",
            cursor: disabled || loading ? "not-allowed" : "pointer",
            opacity: disabled || loading ? 0.5 : 1,
            fontFamily: "'Inter', sans-serif",
            border: "none",
            outline: "none",
            ...style,
        };

        const variants: Record<string, React.CSSProperties> = {
            primary: {
                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                color: "white",
                boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)",
            },
            secondary: {
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
            },
            ghost: {
                background: "transparent",
                color: "var(--text-secondary)",
            },
            danger: {
                background: "var(--red)",
                color: "white",
                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)",
            },
        };

        const sizes: Record<string, React.CSSProperties> = {
            sm: { padding: "0.4rem 0.75rem", fontSize: "0.8rem" },
            md: { padding: "0.6rem 1.25rem", fontSize: "0.875rem" },
            lg: { padding: "0.75rem 1.75rem", fontSize: "1rem" },
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                style={{ ...baseStyle, ...variants[variant], ...sizes[size] }}
                className={className}
                {...props}
            >
                {loading && (
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: "currentColor", borderTopColor: "transparent" }} />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
export default Button;
