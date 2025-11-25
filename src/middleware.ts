import type { NextRequest } from 'next/server'
import {
    DEFAULT_LOGIN_REDIRECT,
    authRoutes,
    apiAuthPrefix,
    publicRoutes,
    presidentRoutes,
    teacherRoutes,
    adminRoutes
} from '@/routes'
import { Session } from 'next-auth'

import { auth } from "@/auth"

// export { auth as middleware } from "@/auth"

// Extend NextRequest to include auth property
interface AuthenticatedRequest extends NextRequest {
    auth?: Session | null; // Change the type to match NextAuthRequest
}

export default auth((req: AuthenticatedRequest) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isPresident = req.auth?.user?.role_id === 2 ? true : false;
    const isTeacher = req.auth?.user?.role_id === 3 ? true : false;
    const isAdmin = req.auth?.user?.role_id === 99 ? true : false;
    
    const isApiAuthRoute = apiAuthPrefix.some(prefix => nextUrl.pathname.startsWith(prefix));
    const isPublicRoute = publicRoutes.some(route => {
        // Handle wildcard routes (ending with /*)
        if (route.endsWith('/*')) {
            const baseRoute = route.slice(0, -2); // Remove /* from the end
            return nextUrl.pathname.startsWith(baseRoute);
        }
        // Exact match for normal routes
        return route === nextUrl.pathname;
    });
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isPresidentRoute = presidentRoutes.includes(nextUrl.pathname);
    const isTeacherRoute = teacherRoutes.includes(nextUrl.pathname);
    const isAdminRoute = adminRoutes.includes(nextUrl.pathname);
    if (isApiAuthRoute) {
        return; // Changed from null to undefined
    }
    if (isAuthRoute) {
        if (isLoggedIn) {
            if (isTeacher) {
                return Response.redirect(new URL("/dashboard/adminTeacher/managebyClubs", nextUrl))
            } else if (isAdmin) {
                return Response.redirect(new URL("/dashboard/clubManagement", nextUrl))
            } else {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
            }
        }
        return;
    }
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl));
    }
    if (isPresidentRoute && !isPresident) {
        return Response.redirect(new URL("/dashboard/overview", nextUrl))
    }
    if (isTeacherRoute && !isTeacher) {
        return Response.redirect(new URL("/dashboard/overview", nextUrl))
    }
    if (isAdminRoute && !isAdmin) {
        return Response.redirect(new URL("/dashboard/overview", nextUrl))
    }
    
    return;
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
