"use client";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "green" | "yellow" | "red" | "blue" | "purple";
    size?: "sm" | "md";
}

export default function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
    const colors: Record<string, { bg: string; color: string }> = {
        default: { bg: "var(--bg-elevated)", color: "var(--text-secondary)" },
        green: { bg: "var(--green-soft)", color: "var(--green)" },
        yellow: { bg: "var(--yellow-soft)", color: "var(--yellow)" },
        red: { bg: "var(--red-soft)", color: "var(--red)" },
        blue: { bg: "var(--blue-soft)", color: "var(--blue)" },
        purple: { bg: "var(--accent-glow)", color: "var(--accent-light)" },
    };

    const sizes = {
        sm: { padding: "0.2rem 0.6rem", fontSize: "0.7rem" },
        md: { padding: "0.3rem 0.8rem", fontSize: "0.8rem" },
    };

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                borderRadius: "999px",
                fontWeight: 500,
                letterSpacing: "0.02em",
                background: colors[variant].bg,
                color: colors[variant].color,
                ...sizes[size],
            }}
        >
            {children}
        </span>
    );
}
