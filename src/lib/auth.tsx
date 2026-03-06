"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, UserRole } from "./types";
import { api } from "./api";

// ──────────────────────────────────────────
// Auth Context
// ──────────────────────────────────────────

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Hydrate user from token on mount
    useEffect(() => {
        const token = localStorage.getItem("alignflow_token");
        if (token) {
            api
                .getMe()
                .then((res) => setUser(res.user))
                .catch(() => {
                    localStorage.removeItem("alignflow_token");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await api.login(email, password);
        localStorage.setItem("alignflow_token", res.token);
        setUser(res.user);
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        const res = await api.register(name, email, password);
        localStorage.setItem("alignflow_token", res.token);
        setUser(res.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("alignflow_token");
        setUser(null);
        window.location.href = "/login";
    }, []);

    const isRole = useCallback(
        (role: UserRole) => user?.role === role,
        [user]
    );

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

// Role-based redirect helper
export function getRoleHomePath(role: UserRole): string {
    switch (role) {
        case "admin":
            return "/admin";
        case "recruiter":
            return "/recruiter";
        case "user":
            return "/jobs";
        default:
            return "/login";
    }
}
