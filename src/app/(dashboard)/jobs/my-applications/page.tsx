"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Briefcase, Calendar, ChevronRight, Loader2, Target } from "lucide-react";
import { api } from "@/lib/api";
import { Application, Job } from "@/lib/types";

export default function MyApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<(Application & { jobTitle?: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                // Fetch both jobs and applications to join the job title
                const [appsRes, jobsRes] = await Promise.all([
                    api.getMyApplications(),
                    api.getJobs()
                ]);

                const jobMap = new Map(jobsRes.jobs.map((j: Job) => [j.job_id, j.title]));

                const mappedApps = appsRes.applications.map((app: Application) => ({
                    ...app,
                    jobTitle: jobMap.get(app.job_id) || "Unknown Job"
                }));

                // Sort newest first
                mappedApps.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime());

                setApplications(mappedApps);
            } catch (err) {
                console.error("Failed to load applications", err);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    return (
        <AuthGuard allowedRoles={["user"]}>
            <Navbar title="My Applications" subtitle="Track your submitted job applications" />
            <div style={{ padding: "1.5rem" }}>

                {loading ? (
                    <Card padding="sm">
                        <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
                            <Loader2 className="animate-spin text-muted" size={32} />
                        </div>
                    </Card>
                ) : applications.length === 0 ? (
                    <Card>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "4rem 2rem" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "var(--radius-xl)", background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-light)" }}>
                                <Briefcase size={28} />
                            </div>
                            <h3 style={{ fontSize: "1.1rem", fontFamily: "'Space Grotesk', sans-serif" }}>No Applications Yet</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", maxWidth: "400px" }}>
                                You haven&apos;t applied to any jobs yet. Browse open positions to find your perfect match.
                            </p>
                            <Button style={{ marginTop: "1rem" }} onClick={() => router.push("/jobs")}>
                                Browse Open Jobs
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1.25rem" }}>
                        {applications.map((app) => {
                            const matchPct = Math.round(app.semantic_score * 100);

                            return (
                                <Card key={app.application_id} hover className="group" onClick={() => router.push(`/jobs/${app.job_id}`)}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.4rem", color: "var(--text-primary)" }}>
                                                    {app.jobTitle}
                                                </h3>
                                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                        <Calendar size={13} /> Applied {new Date(app.applied_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                app.status === "shortlisted" ? "green"
                                                    : app.status === "rejected" ? "red"
                                                        : app.status === "reviewed" ? "blue"
                                                            : "yellow"}
                                            >
                                                {app.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div style={{
                                            padding: "1rem",
                                            background: "var(--bg-root)",
                                            borderRadius: "var(--radius-md)",
                                            border: "1px solid var(--border-light)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem"
                                        }}>
                                            <div style={{
                                                width: "48px",
                                                height: "48px",
                                                borderRadius: "50%",
                                                border: `3px solid ${matchPct >= 75 ? "var(--green)" : matchPct >= 50 ? "var(--yellow)" : "var(--red)"}`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 700,
                                                fontSize: "0.85rem",
                                                color: matchPct >= 75 ? "var(--green)" : matchPct >= 50 ? "var(--yellow)" : "var(--red)",
                                            }}>
                                                {matchPct}%
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                    <Target size={12} /> Semantic Match Score
                                                </div>
                                                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                                                    Based on AI vector similarity analysis
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                                            <Button size="sm" variant="ghost" className="group-hover:bg-accent/10 group-hover:text-accent-light" onClick={(e) => { e.stopPropagation(); router.push(`/jobs/${app.job_id}`); }}>
                                                View Job Post <ChevronRight size={16} />
                                            </Button>
                                        </div>

                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
