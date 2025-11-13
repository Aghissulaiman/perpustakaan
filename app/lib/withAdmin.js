"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withAdmin(Component) {
  return function AdminProtected(props) {
    const router = useRouter();

    useEffect(() => {
      const userJson = localStorage.getItem("user");

      if (!userJson) {
        // Belum login, arahkan ke login
        router.push("/login");
        return;
      }

      const user = JSON.parse(userJson);
      if (user.role !== "admin") {
        // Bukan admin, arahkan ke home
        alert("Akses ditolak! Hanya admin yang bisa masuk.");
        router.push("/home");
      }
    }, [router]);

    return <Component {...props} />;
  };
}
