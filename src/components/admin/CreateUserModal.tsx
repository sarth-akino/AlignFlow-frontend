"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"recruiter" | "admin" | "user">("recruiter");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.createUser({ name, email, password, role });
            onSuccess();
            onClose();
            // Reset form
            setName("");
            setEmail("");
            setPassword("");
            setRole("recruiter");
        } catch (err: any) {
            setError(err.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Account" maxWidth="500px">
            <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "12px", background: "var(--accent-glow)", color: "var(--accent)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)" }}>Add Team Member</h3>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Invite a new Recruiter or Admin to your workspace.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    required
                />

                <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                />

                <Input
                    label="Temporary Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                        System Role
                    </label>
                    <div style={{ position: "relative" }}>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as any)}
                            style={{
                                padding: "0.65rem 0.9rem",
                                paddingRight: "2.5rem",
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                fontSize: "0.875rem",
                                fontFamily: "'Inter', sans-serif",
                                outline: "none",
                                width: "100%",
                                appearance: "none",
                                cursor: "pointer",
                                transition: "border-color 0.2s ease"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                        >
                            <option value="recruiter">Recruiter — Job Posting & Scoring</option>
                            <option value="admin">Admin — Full System Access</option>
                            <option value="user">Applicant — Job Seeking (Testing)</option>
                        </select>
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        {role === "recruiter" && "Recruiters can create jobs and review matching applicants."}
                        {role === "admin" && "Admins have unrestricted access to all data and user management."}
                        {role === "user" && "Applicants can browse jobs and apply. Usually created via self-registration."}
                    </p>
                </div>

                {error && (
                    <div style={{ color: "var(--red)", fontSize: "0.8rem", padding: "0.6rem", background: "var(--red-soft)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Create User
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
