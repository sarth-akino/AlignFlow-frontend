"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Database, Loader2, Save } from "lucide-react";
import { api } from "@/lib/api";

type CollectionType = "users" | "jobs" | "applications";

export default function AdminDataPage() {
    const [collection, setCollection] = useState<CollectionType>("users");
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Editor State
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [editorValue, setEditorValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const loadData = async (col: CollectionType) => {
        try {
            setLoading(true);
            const data = await api.getCollectionData(col);
            setDocuments(data.documents);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(collection);
    }, [collection]);

    const openEditor = (doc: any) => {
        setSelectedDoc(doc);
        setEditorValue(JSON.stringify(doc, null, 2));
        setSaveError("");
    };

    const handleSave = async () => {
        try {
            setSaveError("");
            setSaving(true);
            const parsedData = JSON.parse(editorValue);

            const idField = collection === "users" ? "user_id"
                : collection === "jobs" ? "job_id"
                    : "application_id";

            const id = parsedData[idField];
            if (!id) throw new Error(`Document must contain a valid ${idField}`);

            // Remove internal DB _id from payload
            const { _id, ...updatePayload } = parsedData;

            await api.updateCollectionData(collection, id, updatePayload);

            // Reload & close
            await loadData(collection);
            setSelectedDoc(null);
        } catch (err: any) {
            setSaveError(err.message || "Invalid JSON or save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <Navbar title="Data Management" subtitle="System data browser and raw editor" />
            <div style={{ padding: "1.5rem" }}>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    {(["users", "jobs", "applications"] as CollectionType[]).map((col) => (
                        <button
                            key={col}
                            onClick={() => setCollection(col)}
                            style={{
                                padding: "0.6rem 1.25rem",
                                borderRadius: "var(--radius-md)",
                                background: collection === col ? "var(--accent)" : "var(--bg-secondary)",
                                color: collection === col ? "white" : "var(--text-secondary)",
                                border: `1px solid ${collection === col ? "var(--accent)" : "var(--border)"}`,
                                fontWeight: 500,
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                textTransform: "capitalize",
                            }}
                        >
                            {col}
                        </button>
                    ))}
                </div>

                <Card padding="sm">
                    {loading ? (
                        <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
                            <Loader2 className="animate-spin text-muted" size={32} />
                        </div>
                    ) : documents.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                            No documents found in {collection} collection.
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                                        <th style={{ padding: "1rem" }}>ID</th>
                                        <th style={{ padding: "1rem" }}>Snippet</th>
                                        <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc, idx) => {
                                        const idField = collection === "users" ? "user_id" : collection === "jobs" ? "job_id" : "application_id";
                                        const id = doc[idField] || doc._id;
                                        const snippet = JSON.stringify(doc).substring(0, 100) + "...";

                                        return (
                                            <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                                                <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", color: "var(--accent-light)" }}>
                                                    {id}
                                                </td>
                                                <td style={{ padding: "0.75rem 1rem", color: "var(--text-muted)", maxWidth: "400px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                                    {snippet}
                                                </td>
                                                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                                                    <Button size="sm" variant="secondary" onClick={() => openEditor(doc)}>
                                                        View / Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

            </div>

            {/* Document Editor Modal */}
            <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Raw Document Editor" maxWidth="700px">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Edit the raw JSON document below. Proceed with caution.
                    </p>

                    <textarea
                        value={editorValue}
                        onChange={(e) => setEditorValue(e.target.value)}
                        style={{
                            width: "100%",
                            height: "400px",
                            padding: "1rem",
                            background: "#0d0d12",
                            color: "#e2e8f0",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            fontFamily: "monospace",
                            fontSize: "0.85rem",
                            resize: "vertical",
                            outline: "none",
                        }}
                        spellCheck={false}
                    />

                    {saveError && (
                        <div style={{ color: "var(--red)", fontSize: "0.8rem", padding: "0.6rem", background: "var(--red-soft)", borderRadius: "var(--radius-sm)" }}>
                            {saveError}
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                        <Button variant="ghost" onClick={() => setSelectedDoc(null)}>Cancel</Button>
                        <Button loading={saving} onClick={handleSave}>
                            <Save size={16} /> Save Document
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthGuard>
    );
}
