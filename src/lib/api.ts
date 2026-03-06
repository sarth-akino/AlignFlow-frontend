// ──────────────────────────────────────────
// AlignFlow — API Fetch Wrapper with JWT
// ──────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
    private getToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("alignflow_token");
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();

        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string>),
        };

        // Don't set Content-Type for FormData (browser sets it with boundary)
        if (!(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: "Request failed" }));
            throw { message: error.message || "Request failed", status: res.status };
        }

        return res.json();
    }

    // ── Auth ──────────────────────────────
    async login(email: string, password: string) {
        return this.request<{ token: string; user: import("./types").User }>(
            "/auth/login",
            { method: "POST", body: JSON.stringify({ email, password }) }
        );
    }

    async register(name: string, email: string, password: string) {
        return this.request<{ token: string; user: import("./types").User }>(
            "/auth/register",
            { method: "POST", body: JSON.stringify({ name, email, password }) }
        );
    }

    async getMe() {
        return this.request<{ user: import("./types").User }>("/auth/me");
    }

    // ── Admin ─────────────────────────────
    async getUsers(role?: string) {
        const query = role ? `?role=${role}` : "";
        return this.request<{ users: import("./types").User[] }>(`/admin/users${query}`);
    }

    async createUser(data: { name: string; email: string; password: string; role: string }) {
        return this.request<{ user: import("./types").User }>("/admin/users", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateUser(id: string, data: Partial<import("./types").User>) {
        return this.request<{ user: import("./types").User }>(`/admin/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteUser(id: string) {
        return this.request<{ message: string }>(`/admin/users/${id}`, {
            method: "DELETE",
        });
    }

    async getStats() {
        return this.request<import("./types").DashboardStats>("/admin/stats");
    }

    async getCollectionData(collection: string) {
        return this.request<{ documents: any[] }>(`/admin/data/${collection}`);
    }

    async updateCollectionData(collection: string, id: string, data: any) {
        return this.request<{ document: any }>(`/admin/data/${collection}/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    // ── Jobs ──────────────────────────────
    async getJobs() {
        return this.request<{ jobs: import("./types").Job[] }>("/jobs");
    }

    async getJob(id: string) {
        return this.request<{ job: import("./types").Job }>(`/jobs/${id}`);
    }

    async createJob(data: { title: string; job_desc: string }) {
        return this.request<{ job: import("./types").Job }>("/jobs", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateJob(id: string, data: Partial<import("./types").Job>) {
        return this.request<{ job: import("./types").Job }>(`/jobs/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteJob(id: string) {
        return this.request<{ message: string }>(`/jobs/${id}`, {
            method: "DELETE",
        });
    }

    // ── Applications ──────────────────────
    async getApplications(jobId: string) {
        return this.request<{ applications: import("./types").Application[] }>(
            `/jobs/${jobId}/applications`
        );
    }

    async applyToJob(jobId: string, resumeText: string) {
        return this.request<{ application: import("./types").Application }>(
            `/jobs/${jobId}/apply`,
            { method: "POST", body: JSON.stringify({ resume_text: resumeText }) }
        );
    }

    async getMyApplications() {
        return this.request<{ applications: import("./types").Application[] }>("/me/applications");
    }

    async updateApplicationStatus(jobId: string, applicationId: string, status: string) {
        return this.request<{ application: import("./types").Application }>(
            `/jobs/${jobId}/applications/${applicationId}/status`,
            { method: "PUT", body: JSON.stringify({ status }) }
        );
    }

    // ── Scoring ───────────────────────────
    async triggerLLMScore(jobId: string, applicationId: string) {
        return this.request<{ score: import("./types").LLMScore }>(
            `/jobs/${jobId}/applications/${applicationId}/score`,
            { method: "POST" }
        );
    }
}

export const api = new ApiClient();
