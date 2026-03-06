"use client";

import { UserRole } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface RoleBadgeProps {
    role: UserRole;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
    const config: Record<UserRole, { label: string; variant: "red" | "purple" | "green" }> = {
        admin: { label: "Admin", variant: "red" },
        recruiter: { label: "Recruiter", variant: "purple" },
        user: { label: "Applicant", variant: "green" },
    };

    const { label, variant } = config[role];

    return <Badge variant={variant} size="sm">{label}</Badge>;
}
