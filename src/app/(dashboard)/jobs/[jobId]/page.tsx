"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/shared/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ArrowLeft, MapPin, Loader2, Calendar, FileText, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Job, Application } from "@/lib/types";
import ApplyModal from "@/components/applicant/ApplyModal";

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const jobRes = await api.getJob(jobId);
            setJob(jobRes.job);

            // Check if user has already applied
            const historyRes = await api.getMyApplications();
            const appliedIds = historyRes.applications.map((app: Application) => app.job_id);
            if (appliedIds.includes(jobId)) {
                setHasApplied(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) loadData();
    }, [jobId]);

    const handleApplySuccess = () => {
        setHasApplied(true);
    };

    return (
        <AuthGuard allowedRoles={["user"]}>
            <Navbar title="Job Details" subtitle="View requirements and apply" />
            <div style={{ padding: "1.5rem" }}>

                <Button variant="ghost" size="sm" onClick={() => router.push("/jobs")} style={{ marginBottom: "1rem", display: "inline-flex", gap: "0.5rem" }}>
                    <ArrowLeft size={16} /> Back to Browse
                </Button>

                {loading ? (
                    <Card padding="sm">
                        <div style={{ padding: "5rem", display: "flex", justifyContent: "center" }}>
                            <Loader2 className="animate-spin text-muted" size={32} />
                        </div>
                    </Card>
                ) : job ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }}>

                        {/* Main Content */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Header */}
                            <Card>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                    <div>
                                        <h1 style={{ fontSize: "1.75rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>
                                            {job.title}
                                        </h1>
                                        <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                <MapPin size={16} /> {job.jd_parsed?.job_metadata?.location || "Remote"}
                                            </span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                <Calendar size={16} /> Posted on {new Date(job.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant={job.status === "open" ? "green" : "red"}>
                                        {job.status.toUpperCase()}
                                    </Badge>
                                </div>

                                <div style={{ display: "flex", gap: "1rem" }}>
                                    {hasApplied ? (
                                        <Button variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20" disabled>
                                            <CheckCircle size={16} style={{ marginRight: "0.5rem" }} />
                                            Successfully Applied
                                        </Button>
                                    ) : (
                                        <Button onClick={() => setIsApplyModalOpen(true)} disabled={job.status !== "open"}>
                                            Apply with AI <FileText size={16} style={{ marginLeft: "0.5rem" }} />
                                        </Button>
                                    )}
                                </div>
                            </Card>

                            {/* JD Content */}
                            <Card>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>
                                    Full Job Description
                                </h3>
                                <div style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                                    {job.job_desc}
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <Card padding="md">
                                <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "1rem" }}>
                                    Mandatory Skills
                                </h3>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    {(job.jd_parsed?.mandatory_skills || []).map((skill, i) => (
                                        <span key={i} style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)" }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            <Card padding="md">
                                <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "1rem" }}>
                                    Experience
                                </h3>
                                <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {(job.jd_parsed?.experiences || []).map((exp, i) => (
                                        <li key={i}>{exp}</li>
                                    ))}
                                </ul>
                            </Card>

                            {job.jd_parsed?.preferables && job.jd_parsed.preferables.length > 0 && (
                                <Card padding="md">
                                    <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "1rem" }}>
                                        Preferables
                                    </h3>
                                    <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {job.jd_parsed.preferables.map((pref, i) => (
                                            <li key={i}>{pref}</li>
                                        ))}
                                    </ul>
                                </Card>
                            )}
                        </div>

                    </div>
                ) : (
                    <Card>
                        <div style={{ padding: "4rem", textAlign: "center", color: "var(--red)" }}>
                            Job not found.
                        </div>
                    </Card>
                )}
            </div>

            <ApplyModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                jobId={jobId}
                onSuccess={handleApplySuccess}
            />

        </AuthGuard>
    );
}
