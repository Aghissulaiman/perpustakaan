"use client";
import { useState, useEffect } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { Bell, Shield, Eye, Moon, Sun, Save, User } from "lucide-react";

function PengaturanContent() {
  const { data: session } = useSession();

  const [settings, setSettings] = useState({
    notifications: { email: true, push: false, sms: false },
    privacy: { profileVisible: true, showActivity: false },
    appearance: { theme: "light", language: "id" },
  });

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, theme: savedTheme }
    }));

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Update internal state
  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
  };

  // Save settings
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    alert("Pengaturan berhasil disimpan!");
  };

  return (
    <>
      

      <section className="py-28 px-6 md:px-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
              Pengaturan Akun
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola preferensi dan pengaturan akun Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">

                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-blue-600 dark:text-blue-400" />
                </div>

                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                  {session?.user?.name || "Nama Pengguna"}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {session?.user?.email}
                </p>

                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full capitalize">
                  {session?.user?.role || "siswa"}
                </span>

              </div>
            </div>

            {/* Settings */}
            <div className="md:col-span-2 space-y-6">

              {/* Notification Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="text-blue-600 dark:text-blue-400" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notifikasi</h3>
                </div>

                {["email", "push", "sms"].map((item) => (
                  <div key={item} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 capitalize">{item}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item === "email"
                          ? "Terima notifikasi via email"
                          : item === "push"
                          ? "Notifikasi di browser"
                          : "Notifikasi via SMS"}
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[item]}
                        onChange={(e) => updateSetting("notifications", item, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Privacy Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-green-600 dark:text-green-400" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Privasi</h3>
                </div>

                {[
                  ["profileVisible", "Profil Publik", "Tampilkan profil Anda ke pengguna lain"],
                  ["showActivity", "Aktivitas Publik", "Tampilkan aktivitas peminjaman Anda"],
                ].map(([key, title, desc]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy[key]}
                        onChange={(e) => updateSetting("privacy", key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Appearance Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="text-purple-600 dark:text-purple-400" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Tampilan</h3>
                </div>

                {/* Theme Selector */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
                <div className="flex gap-4">

                  {/* Light */}
                  <button
                    onClick={() => {
                      updateSetting("appearance", "theme", "light");
                      localStorage.setItem("theme", "light");
                      document.documentElement.classList.remove("dark");
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      settings.appearance.theme === "light"
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Sun size={16} />
                    Terang
                  </button>

                  {/* Dark */}
                  <button
                    onClick={() => {
                      updateSetting("appearance", "theme", "dark");
                      localStorage.setItem("theme", "dark");
                      document.documentElement.classList.add("dark");
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      settings.appearance.theme === "dark"
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Moon size={16} />
                    Gelap
                  </button>
                </div>

                {/* Language */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">
                  Bahasa
                </label>
                <select
                  value={settings.appearance.language}
                  onChange={(e) => updateSetting("appearance", "language", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Simpan Pengaturan
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PengaturanPage() {
  return (
    <SessionProvider>
      <PengaturanContent />
    </SessionProvider>
  );
}

export default PengaturanPage;
