import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"];

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("jwt_token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/routines/:path*",
    "/stats/:path*",
    "/settings/:path*",
    "/workout/:path*",
    "/login",
    "/register",
  ],
};
