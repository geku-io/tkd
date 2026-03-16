import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function proxy(request: NextRequest) {
   const path = request.nextUrl.pathname;
   const authToken = (await cookies()).get("Authentication")?.value;

   if (!authToken && path.includes("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
   }

   if (path === "/login" && authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
   }
   return NextResponse.next();
}

export const config = {
   matcher: ["/dashboard/:path*", "/login"],
};
