"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, style, ...props }, ref) => {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {label && (
                    <label
                        style={{
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "var(--text-secondary)",
                        }}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    style={{
                        padding: "0.65rem 0.9rem",
                        background: "var(--bg-secondary)",
                        border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                        fontFamily: "'Inter', sans-serif",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        width: "100%",
                        ...style,
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = error ? "var(--red)" : "var(--accent)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = error ? "var(--red)" : "var(--border)";
                    }}
                    {...props}
                />
                {error && (
                    <span style={{ fontSize: "0.75rem", color: "var(--red)" }}>{error}</span>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, style, ...props }, ref) => {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {label && (
                    <label
                        style={{
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "var(--text-secondary)",
                        }}
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    style={{
                        padding: "0.65rem 0.9rem",
                        background: "var(--bg-secondary)",
                        border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                        fontFamily: "'Inter', sans-serif",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        width: "100%",
                        resize: "vertical",
                        minHeight: "100px",
                        ...style,
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = error ? "var(--red)" : "var(--accent)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = error ? "var(--red)" : "var(--border)";
                    }}
                    {...props}
                />
                {error && (
                    <span style={{ fontSize: "0.75rem", color: "var(--red)" }}>{error}</span>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";
