"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Briefcase, Plus, Users, Trash2, Calendar, MapPin, Loader2, Play } from "lucide-react";
import { api } from "@/lib/api";
import { Job } from "@/lib/types";
import JobForm from "@/components/recruiter/JobForm";

export default function RecruiterDashboard() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const data = await api.getJobs();
            setJobs(data.jobs);
        } catch (err) {
            console.error("Failed to load jobs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this job and all its applications?")) return;

        try {
            await api.deleteJob(id);
            setJobs((prev) => prev.filter((j) => j.job_id !== id));
        } catch (err) {
            alert("Failed to delete job");
        }
    };

    return (
        <AuthGuard allowedRoles={["recruiter"]}>
            <Navbar title="My Job Posts" subtitle="Manage your job listings and view applicants" />
            <div style={{ padding: "1.5rem" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        You have {jobs.length} job post{jobs.length !== 1 && 's'}.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} /> Create Job
                    </Button>
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
                            <h3 style={{ fontSize: "1.1rem", fontFamily: "'Space Grotesk', sans-serif" }}>No Job Posts Yet</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", maxWidth: "400px" }}>
                                Create your first job post to start receiving AI-ranked applications from candidates.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem" }}>
                        {jobs.map((job) => (
                            <Card key={job.job_id} hover className="cursor-pointer group" onClick={() => router.push(`/recruiter/${job.job_id}`)}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.25rem" }}>
                                                {job.title}
                                            </h3>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                                    <MapPin size={12} /> {job.jd_parsed?.job_metadata?.location || "Remote"}
                                                </span>
                                                •
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                                    <Calendar size={12} /> {new Date(job.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge variant={job.status === "open" ? "green" : "default"}>
                                            {job.status.toUpperCase()}
                                        </Badge>
                                    </div>

                                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.5rem 0" }}>
                                        {(job.jd_parsed?.mandatory_skills || []).slice(0, 3).map((skill, i) => (
                                            <span key={i} style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)" }}>
                                                {skill}
                                            </span>
                                        ))}
                                        {(job.jd_parsed?.mandatory_skills || []).length > 3 && (
                                            <span style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem", color: "var(--text-muted)" }}>
                                                +{(job.jd_parsed.mandatory_skills.length - 3)} more
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-light)", fontSize: "0.85rem", fontWeight: 500 }}>
                                            <Users size={16} />
                                            <span>{job.applicant_count || 0} Applicants</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={(e) => handleDelete(job.job_id, e)}>
                                                <Trash2 size={14} />
                                            </Button>
                                            <Button size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/recruiter/${job.job_id}`) }}>
                                                View <Play size={12} style={{ marginLeft: "4px" }} />
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <JobForm
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadJobs}
            />
        </AuthGuard>
    );
}
