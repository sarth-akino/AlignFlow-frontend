import { NextRequest, NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register"];

// Role-to-path mapping for authorization
const roleRoutes: Record<string, string[]> = {
    admin: ["/admin"],
    recruiter: ["/recruiter"],
    user: ["/jobs"],
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes and static files
    if (
        publicRoutes.some((r) => pathname.startsWith(r)) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // Check for auth token in cookie
    const token = request.cookies.get("alignflow_token")?.value;

    // If no token, the client-side AuthProvider handles redirect via localStorage.
    // This middleware is a safety net — allow the request and let client-side handle it.
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
