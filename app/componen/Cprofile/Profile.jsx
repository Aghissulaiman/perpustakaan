"use client";

import { useEffect, useState } from "react";
import { User, Mail, Badge, Shield } from "lucide-react"; // Ganti IdBadge → Badge

export default function ProfileData() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const parsedUser = JSON.parse(userJson);
      console.log("User data parsed:", parsedUser); // 🔍 Debug log
      setUser(parsedUser);
    }
  }, []);

  if (!user || !user.username) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-500">
        Data user tidak ditemukan atau belum lengkap.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold shadow-inner">
          {user?.username?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-700">{user.username}</h2>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
          <User size={20} className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Nama</p>
            <p className="font-medium">{user.username}</p>
          </div>
        </div>

        {user.nis && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
            <Badge size={20} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">NIS</p>
              <p className="font-medium">{user.nis}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl">
          <Mail size={20} className="text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
          <Shield size={20} className="text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
