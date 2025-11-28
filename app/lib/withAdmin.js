"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export function withAdmin(Component) {
  return function AdminProtected(props) {
    const router = useRouter();
    const [status, setStatus] = useState("loading"); // loading | allowed | denied

    useEffect(() => {
      const checkSession = async () => {
        const session = await getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        if (session.user.role !== "admin") {
          setStatus("denied");
          setTimeout(() => {
            router.push("/home");
          }, 3000); // tampil 3 detik
          return;
        }

        setStatus("allowed");
      };

      checkSession();
    }, [router]);

    if (status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <h2 className="text-2xl font-semibold">Memeriksa hak akses...</h2>
        </div>
      );
    }

    if (status === "denied") {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
          <img
            src="/Error.png" // simpan gambar yang kamu upload di public/error-robot.png
            alt="Access Denied"
            className="w-80 h-80 object-contain mb-6"
          />
          <h1 className="text-4xl font-bold text-blue-600">Oops!</h1>
          <h2 className="text-2xl mt-2">Akses Ditolak</h2>
          <p className="mt-2 text-gray-500">
            Hanya admin yang bisa masuk. Mengalihkan ke halaman utama...
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
