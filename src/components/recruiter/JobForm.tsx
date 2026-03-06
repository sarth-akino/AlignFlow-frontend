"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface JobFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function JobForm({ isOpen, onClose, onSuccess }: JobFormProps) {
    const [title, setTitle] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.createJob({ title, job_desc: jobDesc });
            onSuccess();
            onClose();
            setTitle("");
            setJobDesc("");
        } catch (err: any) {
            setError(err.message || "Failed to create job post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Job Post" maxWidth="600px">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {loading ? (
                    <div style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                        <div style={{ color: "var(--accent)" }}>
                            <Loader2 className="animate-spin" size={40} />
                        </div>
                        <h4 style={{ fontWeight: 600, fontSize: "1.1rem" }}>AI is parsing requirements...</h4>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>
                            We are extracting mandatory skills, experience, and preferables from your job description. This usually takes 5-10 seconds.
                        </p>
                    </div>
                ) : (
                    <>
                        <Input
                            label="Job Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Senior Frontend Engineer"
                            required
                        />

                        <Textarea
                            label="Job Description"
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            placeholder="Paste the full job description here..."
                            required
                            rows={12}
                            style={{ fontSize: "0.85rem" }}
                        />

                        {error && (
                            <div style={{ color: "var(--red)", fontSize: "0.8rem", padding: "0.6rem", background: "var(--red-soft)", borderRadius: "var(--radius-sm)" }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading || !title || !jobDesc}>
                                Post Job & Parse
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Modal>
    );
}
