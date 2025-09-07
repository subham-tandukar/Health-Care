import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Decode JWT to check if user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isAdminLoginPage = pathname === "/admin";
  const isAdminRoute = pathname.startsWith("/admin/") && pathname !== "/admin";

  // If user is not authenticated and tries to access a protected admin route
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If the user is authenticated and tries to access the admin login page
  if (isAdminLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Otherwise allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"], // Apply middleware to all admin routes + login
};
