"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    onSuccess: () => void;
}

export default function ApplyModal({ isOpen, onClose, jobId, onSuccess }: ApplyModalProps) {
    // const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<{ matchPct: number; semantic_score: number } | null>(null);

    /* PDF handles commented out for prototype
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedInfo = e.target.files[0];
            if (selectedInfo.type !== "application/pdf") {
                setError("Please upload a PDF file.");
                setFile(null);
                return;
            }
            setFile(selectedInfo);
            setError("");
        }
    };
    */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resumeText.trim()) {
            setError("Please paste your resume text to apply.");
            return;
        }
        if (resumeText.trim().length < 50) {
            setError("Resume text must be at least 50 characters.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await api.applyToJob(jobId, resumeText);
            const data = res.application;

            setResult({
                matchPct: Math.round(data.semantic_score * 100),
                semantic_score: data.semantic_score
            });
            onSuccess();
        } catch (err: any) {
            setError(err.message || "An error occurred while analyzing your resume.");
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        // setFile(null);
        setResumeText("");
        setResult(null);
        setError("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} title={result ? "Application Submitted!" : "Apply for Job"} maxWidth="600px">
            {result ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "1rem" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "var(--accent-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-light)"
                    }}>
                        <Sparkles size={36} />
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                            {result.matchPct}% Match
                        </h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                            Our AI has successfully analyzed your resume against the job description.
                        </p>
                    </div>

                    <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "99px", overflow: "hidden", marginTop: "1rem" }}>
                        <div style={{
                            height: "100%",
                            width: `${result.matchPct}%`,
                            background: result.matchPct >= 75 ? "var(--green)" : result.matchPct >= 50 ? "var(--yellow)" : "var(--red)",
                            transition: "width 1s ease-out"
                        }} />
                    </div>

                    <Button onClick={resetAndClose} style={{ width: "100%", marginTop: "1rem" }}>
                        Done
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    {loading ? (
                        <div style={{ padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                            <div style={{ position: "relative" }}>
                                <Loader2 className="animate-spin text-accent" size={48} />
                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "var(--accent-light)" }}>
                                    <Sparkles size={16} />
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <h4 style={{ fontWeight: 600, fontSize: "1.1rem" }}>AI Agent is Reading Your Resume</h4>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                    Extracting context, generating high-dimensional vectors, and placing you in the ranking matrix...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                For this prototype, please directly paste the text of your resume below. Our AI engine will read your resume and instantly match you to the job requirements.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste your full resume text here..."
                                    style={{
                                        minHeight: "250px",
                                        padding: "1rem",
                                        background: "var(--bg-secondary)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-md)",
                                        color: "var(--text-primary)",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.6,
                                        resize: "vertical",
                                        width: "100%",
                                        outline: "none",
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                    {resumeText.trim().length} characters
                                </div>
                            </div>

                            {error && (
                                <div style={{ color: "var(--red)", fontSize: "0.85rem", padding: "0.75rem", background: "var(--red-soft)", borderRadius: "var(--radius-sm)" }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                                <Button type="button" variant="ghost" onClick={resetAndClose} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading || !resumeText.trim()}>
                                    Submit Application
                                </Button>
                            </div>
                        </>
                    )}

                </form>
            )}
        </Modal>
    );
}
