"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "480px",
}: ModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(4px)",
                            zIndex: 100,
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            width: "90vw",
                            maxWidth,
                            maxHeight: "85vh",
                            overflow: "auto",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-lg)",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
                            zIndex: 101,
                            padding: "1.5rem",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "1.25rem",
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "1.15rem",
                                    fontWeight: 600,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                }}
                            >
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "var(--radius-sm)",
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
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
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
