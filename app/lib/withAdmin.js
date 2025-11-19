"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export function withAdmin(Component) {
  return function AdminProtected(props) {
    const router = useRouter();

    useEffect(() => {
      const checkSession = async () => {
        const session = await getSession();
        if (!session) {
          // Belum login, arahkan ke login
          router.push("/login");
          return;
        }

        if (session.user.role !== "admin") {
          // Bukan admin, arahkan ke home
          alert("Akses ditolak! Hanya admin yang bisa masuk.");
          router.push("/home");
        }
      };

      checkSession();
    }, [router]);

    return <Component {...props} />;
  };
}
