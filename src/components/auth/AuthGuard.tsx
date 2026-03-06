"use client";

import { useAuth, getRoleHomePath } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { UserRole } from "@/lib/types";

interface AuthGuardProps {
    children: ReactNode;
    allowedRoles: UserRole[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/login");
            } else if (!allowedRoles.includes(user.role)) {
                router.replace(getRoleHomePath(user.role));
            }
        }
    }, [user, loading, allowedRoles, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
