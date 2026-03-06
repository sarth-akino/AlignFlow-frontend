"use client";

import { ReactNode, CSSProperties } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
    onClick?: () => void;
    style?: CSSProperties;
}

export default function Card({
    children,
    className = "",
    hover = false,
    glow = false,
    padding = "md",
    onClick,
    style = {},
}: CardProps) {
    const paddings = { none: "0", sm: "1rem", md: "1.5rem", lg: "2rem" };

    return (
        <div
            onClick={onClick}
            className={`glass-card ${className}`}
            style={{
                padding: paddings[padding],
                cursor: onClick ? "pointer" : "default",
                transition: "all 0.25s ease",
                ...(hover
                    ? { ["--hover-bg" as string]: "var(--bg-card-hover)" }
                    : {}),
                ...(glow
                    ? { boxShadow: "0 0 20px 2px var(--accent-glow)" }
                    : {}),
                ...style,
            }}
            onMouseEnter={(e) => {
                if (hover) {
                    e.currentTarget.style.background = "var(--bg-card-hover)";
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                }
            }}
            onMouseLeave={(e) => {
                if (hover) {
                    e.currentTarget.style.background = "var(--glass-bg)";
                    e.currentTarget.style.borderColor = "var(--glass-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                }
            }}
        >
            {children}
        </div>
    );
}
