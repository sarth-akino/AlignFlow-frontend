// ──────────────────────────────────────────
// AlignFlow — TypeScript Interfaces
// ──────────────────────────────────────────

export type UserRole = "admin" | "recruiter" | "user";

export interface User {
  user_id: string;
  email: string;
  name: string;
  role: UserRole;
  created_by?: string;
  created_at: string;
}

export interface Job {
  job_id: string;
  recruiter_id: string;
  title: string;
  job_desc: string;
  jd_parsed: JDParsed;
  status: "open" | "closed";
  applicant_count?: number;
  created_at: string;
}

export interface JDParsed {
  role: string;
  mandatory_skills: string[];
  experiences: string[];
  preferables: string[];
  job_metadata: {
    location: string;
    salary_range: string;
    benefits: string;
    industry: string;
  };
}

export interface Application {
  application_id: string;
  job_id: string;
  user_id: string;
  user_name: string;
  resume_text: string;
  semantic_score: number;
  llm_score?: LLMScore | null;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  applied_at: string;
}

export interface LLMScore {
  mandatory_skills: Record<string, number>;
  experience_validation: Record<string, 0 | 1>;
  preferables_validation: Record<string, 0 | 1>;
  insights: string[];
  concerns: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface DashboardStats {
  total_users: number;
  total_recruiters: number;
  total_jobs: number;
  total_applications: number;
}
