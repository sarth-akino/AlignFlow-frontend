"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ChevronDown, ChevronUp, Bot, CheckCircle, XCircle, FileText, Loader2 } from "lucide-react";
import { Application, LLMScore } from "@/lib/types";
import { api } from "@/lib/api";

interface ApplicantTableProps {
    jobId: string;
    applications: Application[];
    onUpdate: () => void;
}

export default function ApplicantTable({ jobId, applications, onUpdate }: ApplicantTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [scoringId, setScoringId] = useState<string | null>(null);

    const handleScore = async (appId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setScoringId(appId);
            await api.triggerLLMScore(jobId, appId);
            onUpdate();
            setExpandedId(appId); // Auto expand once scored
        } catch (err) {
            alert("Failed to analyze application");
        } finally {
            setScoringId(null);
        }
    };

    const handleStatusUpdate = async (appId: string, status: "shortlisted" | "rejected", e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.updateApplicationStatus(jobId, appId, status);
            onUpdate();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const toggleExpand = (appId: string) => {
        setExpandedId(expandedId === appId ? null : appId);
    };

    if (applications.length === 0) {
        return (
            <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
                No applications received for this job yet.
            </div>
        );
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                        <th style={{ padding: "1rem" }}>Candidate Name</th>
                        <th style={{ padding: "1rem" }}>Applied Date</th>
                        <th style={{ padding: "1rem", width: "150px" }}>Semantic Match</th>
                        <th style={{ padding: "1rem" }}>Status</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => {
                        const isExpanded = expandedId === app.application_id;
                        const matchPct = Math.round(app.semantic_score * 100);

                        return (
                            <React.Fragment key={app.application_id}>
                                {/* Main Row */}
                                <tr
                                    onClick={() => toggleExpand(app.application_id)}
                                    style={{
                                        borderBottom: isExpanded ? "none" : "1px solid var(--border-light)",
                                        background: isExpanded ? "var(--bg-elevated)" : "transparent",
                                        cursor: "pointer",
                                        transition: "background 0.2s"
                                    }}
                                    className="hover:bg-white/5"
                                >
                                    <td style={{ padding: "1rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                                        {app.user_name}
                                    </td>
                                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                                        {new Date(app.applied_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: "1rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span style={{ fontWeight: 600, color: matchPct >= 75 ? "var(--green)" : matchPct >= 50 ? "var(--yellow)" : "var(--red)", width: "35px" }}>
                                                {matchPct}%
                                            </span>
                                            <div style={{ flex: 1, height: "6px", background: "var(--bg-secondary)", borderRadius: "99px", overflow: "hidden" }}>
                                                <div style={{
                                                    height: "100%",
                                                    width: `${matchPct}%`,
                                                    background: matchPct >= 75 ? "var(--green)" : matchPct >= 50 ? "var(--yellow)" : "var(--red)"
                                                }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "1rem" }}>
                                        <Badge variant={
                                            app.status === "shortlisted" ? "green"
                                                : app.status === "rejected" ? "red"
                                                    : app.status === "reviewed" ? "blue"
                                                        : "yellow"}
                                        >
                                            {app.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td style={{ padding: "1rem", textAlign: "right" }}>
                                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                            <Button size="sm" variant={app.status === "shortlisted" ? "primary" : "ghost"} style={app.status !== "shortlisted" ? { color: "var(--green)" } : {}} onClick={(e) => handleStatusUpdate(app.application_id, "shortlisted", e)}>
                                                Shortlist
                                            </Button>
                                            <Button size="sm" variant={app.status === "rejected" ? "danger" : "ghost"} style={app.status !== "rejected" ? { color: "var(--red)" } : {}} onClick={(e) => handleStatusUpdate(app.application_id, "rejected", e)}>
                                                Reject
                                            </Button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Expanded Details Row */}
                                {isExpanded && (
                                    <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-light)" }}>
                                        <td colSpan={5} style={{ padding: "0 1.5rem 1.5rem 2.5rem" }}>
                                            <div style={{ background: "var(--bg-root)", borderRadius: "var(--radius-md)", padding: "1.25rem", border: "1px solid var(--border)" }}>

                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-light)" }}>
                                                        <Bot size={18} /> Deep AI Analysis
                                                    </h4>

                                                    {!app.llm_score && (
                                                        <Button size="sm" onClick={(e) => handleScore(app.application_id, e)} loading={scoringId === app.application_id}>
                                                            <Bot size={14} style={{ marginRight: "4px" }} /> Run Deep Analysis
                                                        </Button>
                                                    )}
                                                </div>

                                                {!app.llm_score ? (
                                                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem 0" }}>
                                                        Click 'Run Deep Analysis' to use LLM to extract specific reasoning, validations of experiences, and individual skill scorings out of the candidate's resume.
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                                        {/* Left column */}
                                                        <div>
                                                            <h5 style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Skills Alignment</h5>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                                                                {Object.entries(app.llm_score.mandatory_skills || {}).map(([skill, score]: [string, any]) => (
                                                                    <div key={skill} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                                                                        <span>{skill}</span>
                                                                        <span style={{ fontWeight: 600, color: score >= 7 ? "var(--green)" : score >= 4 ? "var(--yellow)" : "var(--red)" }}>
                                                                            {score}/10
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <h5 style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Experience Validation</h5>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                                {Object.entries(app.llm_score.experience_validation || {}).map(([exp, isValid]: [string, any]) => (
                                                                    <div key={exp} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: isValid ? "var(--text-primary)" : "var(--text-muted)" }}>
                                                                        {isValid ? <CheckCircle size={14} className="text-green-500 mt-1 shrink-0" /> : <XCircle size={14} className="text-red-500 mt-1 shrink-0" />}
                                                                        <span>{exp}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Right column */}
                                                        <div>
                                                            <h5 style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Key Insights</h5>
                                                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                                                {(app.llm_score.insights || []).map((insight, i) => (
                                                                    <li key={i} style={{ fontSize: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                                                        <span style={{ color: "var(--accent)", marginTop: "2px" }}>•</span> {insight}
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                            <h5 style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Potential Concerns</h5>
                                                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                                                {(app.llm_score.concerns || []).length > 0 ? (
                                                                    (app.llm_score.concerns || []).map((concern, i) => (
                                                                        <li key={i} style={{ fontSize: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                                                            <span style={{ color: "var(--yellow)", marginTop: "2px" }}>•</span> {concern}
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>No major concerns detected.</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
