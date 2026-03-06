"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Job, Application } from "@/lib/types";
import ApplicantTable from "@/components/recruiter/ApplicantTable";
import React from "react";

export default function RecruiterJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const [job, setJob] = useState<Job | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [jobRes, appsRes] = await Promise.all([
                api.getJob(jobId),
                api.getApplications(jobId)
            ]);
            setJob(jobRes.job);

            // Ensure applications are sorted by match % descending
            const sortedApps = (appsRes.applications || []).sort((a, b) => b.semantic_score - a.semantic_score);
            setApplications(sortedApps);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) loadData();
    }, [jobId]);

    return (
        <AuthGuard allowedRoles={["recruiter"]}>
            <Navbar title="Ranked Applicants" subtitle="AI-ranked candidates for this job post" />
            <div style={{ padding: "1.5rem" }}>

                <Button variant="ghost" size="sm" onClick={() => router.push("/recruiter")} style={{ marginBottom: "1rem", display: "inline-flex", gap: "0.5rem" }}>
                    <ArrowLeft size={16} /> Back to Jobs
                </Button>

                {loading ? (
                    <Card padding="sm">
                        <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
                            <Loader2 className="animate-spin text-muted" size={32} />
                        </div>
                    </Card>
                ) : job ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                        {/* Job Context Header */}
                        <Card padding="sm" style={{ borderLeft: "4px solid var(--accent)" }}>
                            <div style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.5rem" }}>
                                        {job.title}
                                    </h2>
                                    <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <MapPin size={14} /> {job.jd_parsed?.job_metadata?.location || "Remote"}
                                        </span>
                                        <span>•</span>
                                        <span>{applications.length} Candidates Applied</span>
                                    </div>
                                </div>

                                <Badge variant={job.status === "open" ? "green" : "default"}>
                                    {job.status.toUpperCase()}
                                </Badge>
                            </div>
                        </Card>

                        {/* Applicants Table */}
                        <Card padding="none">
                            <ApplicantTable
                                jobId={jobId}
                                applications={applications}
                                onUpdate={loadData}
                            />
                        </Card>

                    </div>
                ) : (
                    <Card>
                        <div style={{ padding: "4rem", textAlign: "center", color: "var(--red)" }}>
                            Job not found or access denied.
                        </div>
                    </Card>
                )}
            </div>
        </AuthGuard>
    );
}
