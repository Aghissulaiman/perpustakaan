import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // redirect ke login kalau belum auth
  },
});

export const config = {
  matcher: [
    "/home/:path*",   // semua halaman home harus login
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
