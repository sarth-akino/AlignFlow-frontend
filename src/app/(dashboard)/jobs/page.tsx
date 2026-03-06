"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { MapPin, Calendar, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Job } from "@/lib/types";

export default function JobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                // Applicants see all open jobs
                const data = await api.getJobs();
                setJobs(data.jobs);
            } catch (err) {
                console.error("Failed to load jobs", err);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, []);

    return (
        <AuthGuard allowedRoles={["user"]}>
            <Navbar title="Browse Jobs" subtitle="Find your next opportunity and apply instantly" />

            <div style={{ padding: "1.5rem" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Open Positions
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Discover roles perfectly matched to your resume automatically.
                    </p>
                </div>

                {loading ? (
                    <Card padding="sm">
                        <div style={{ padding: "4rem", display: "flex", justifyContent: "center" }}>
                            <Loader2 className="animate-spin text-muted" size={32} />
                        </div>
                    </Card>
                ) : jobs.length === 0 ? (
                    <Card>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "4rem 2rem" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "var(--radius-xl)", background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-light)" }}>
                                <Briefcase size={28} />
                            </div>
                            <h3 style={{ fontSize: "1.1rem", fontFamily: "'Space Grotesk', sans-serif" }}>No Open Jobs</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", maxWidth: "400px" }}>
                                There are no job postings available at the moment. Please check back later.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
                        {jobs.map((job) => (
                            <Card key={job.job_id} hover className="group" onClick={() => router.push(`/jobs/${job.job_id}`)}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.4rem", color: "var(--text-primary)" }}>
                                                {job.title}
                                            </h3>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                    <MapPin size={13} /> {job.jd_parsed?.job_metadata?.location || "Remote"}
                                                </span>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                    <Calendar size={13} /> {new Date(job.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills preview */}
                                    <div style={{ padding: "0.75rem", background: "var(--bg-root)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem", fontWeight: 600 }}>
                                            Key Requirements
                                        </div>
                                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                            {(job.jd_parsed?.mandatory_skills || []).slice(0, 4).map((skill, i) => (
                                                <span key={i} style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", background: "var(--bg-secondary)", borderRadius: "100px", color: "var(--text-primary)" }}>
                                                    {skill}
                                                </span>
                                            ))}
                                            {(job.jd_parsed?.mandatory_skills || []).length > 4 && (
                                                <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", color: "var(--text-muted)" }}>
                                                    +{(job.jd_parsed.mandatory_skills.length - 4)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                                        <Button size="sm" variant="ghost" className="group-hover:bg-accent/10 group-hover:text-accent-light" onClick={(e) => { e.stopPropagation(); router.push(`/jobs/${job.job_id}`); }}>
                                            View Details <ChevronRight size={16} />
                                        </Button>
                                    </div>

                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
