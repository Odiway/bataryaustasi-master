import { useState } from "react";
import { useEffect } from "react";

const stats = [
    { label: "Projeler", value: 18, icon: "📁" },
    { label: "Testler", value: 42, icon: "🧪" },
    { label: "Raporlar", value: 27, icon: "📊" },
    { label: "Açık Görevler", value: 7, icon: "📝" },
];

const activities = [
    { time: "09:00", desc: "Yeni proje başlatıldı: Batarya Analizi" },
    { time: "10:30", desc: "Test tamamlandı: Hücre Ömrü Testi" },
    { time: "12:00", desc: "Rapor yüklendi: Termal Analiz" },
    { time: "15:15", desc: "Görev atandı: Prototip Montajı" },
];

const engineers = [
    { name: "Elif Korkmaz", role: "Kıdemli Mühendis", status: "Aktif" },
    { name: "Baran Yıldız", role: "Test Mühendisi", status: "Aktif" },
    { name: "Deniz Aksoy", role: "Stajyer", status: "Pasif" },
];

// Removed duplicate default export for ArgeAdminDashboard
function ArgeAdminDashboard() {
    const [selectedTab, setSelectedTab] = useState("istatistikler");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow">
                    Ar-Ge Admin Paneli
                </h1>
                <div className="flex items-center gap-4">
                    <input
                        className="rounded px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Ara..."
                    />
                    <img
                        src="https://ui-avatars.com/api/?name=Arge+Admin"
                        alt="Arge Admin"
                        className="w-10 h-10 rounded-full border-2 border-blue-400"
                    />
                </div>
            </header>

            <nav className="flex gap-4 mb-6">
                {["istatistikler", "mühendisler", "aktiviteler"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                            selectedTab === tab
                                ? "bg-blue-600 text-white shadow"
                                : "bg-white text-blue-700 hover:bg-blue-100"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </nav>

            {selectedTab === "istatistikler" && (
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
                            >
                                <span className="text-4xl mb-2">{stat.icon}</span>
                                <span className="text-2xl font-bold text-blue-700">
                                    {stat.value}
                                </span>
                                <span className="text-gray-500">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Proje İlerlemesi</h2>
                        {/* Placeholder for chart */}
                        <div className="w-full h-48 flex items-center justify-center text-gray-400">
                            [Burada proje ilerleme grafiği olacak]
                        </div>
                    </div>
                </section>
            )}

            {selectedTab === "mühendisler" && (
                <section>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Mühendisler</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="pb-2">İsim</th>
                                    <th className="pb-2">Rol</th>
                                    <th className="pb-2">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {engineers.map((e) => (
                                    <tr key={e.name} className="border-t">
                                        <td className="py-2">{e.name}</td>
                                        <td>{e.role}</td>
                                        <td>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    e.status === "Aktif"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-500"
                                                }`}
                                            >
                                                {e.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {selectedTab === "aktiviteler" && (
                <section>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Son Aktiviteler</h2>
                        <ul>
                            {activities.map((a, i) => (
                                <li key={i} className="flex items-center mb-3">
                                    <span className="text-blue-600 font-mono w-16">{a.time}</span>
                                    <span>{a.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            <footer className="mt-12 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} Batarya Ustası Ar-Ge Admin Paneli
            </footer>
        </div>
    );
}
/**
 * Ek Özellik: Karanlık Mod Desteği
 * Kullanıcı, panelin sağ üst köşesinden karanlık/aydınlık mod arasında geçiş yapabilir.
 */


function useDarkMode() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    return [dark, setDark] as const;
}

// Karanlık mod butonunu header'a eklemek için AdminDashboard fonksiyonunun başına ekleyin:
// Not: Bu fonksiyon sadece örnek, asıl dark mode desteği AdminDashboardWithDarkMode içinde var.
// Eğer AdminDashboard içinde de dark mode butonu istiyorsanız aşağıdaki gibi ekleyebilirsiniz:

// useDarkMode hook'unu kullanın
// (Kopyası kaldırıldı, aşağıda zaten mevcut)

// AdminDashboard fonksiyonunu güncelleyin
function AdminDashboard() {
    const [selectedTab, setSelectedTab] = useState("istatistikler");
    const [dark, setDark] = useDarkMode();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 p-8 transition-colors">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-200 drop-shadow">
                    Ar-Ge Admin Paneli
                </h1>
                <div className="flex items-center gap-4">
                    <input
                        className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
                        placeholder="Ara..."
                    />
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            setDark(d => !d);
                        }}
                        className="ml-2 px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition cursor-pointer"
                        aria-label="Karanlık Modu Aç/Kapat"
                    >
                        {dark ? "🌙 Karanlık" : "☀️ Aydınlık"}
                    </a>
                    <img
                        src="https://ui-avatars.com/api/?name=Arge+Admin"
                        alt="Arge Admin"
                        className="w-10 h-10 rounded-full border-2 border-blue-400"
                    />
                </div>
            </header>
            {/* ...diğer kodlar aynı kalabilir... */}
        </div>
    );
}
export default AdminDashboardWithDarkMode;

function AdminDashboardWithDarkMode() {
    const [selectedTab, setSelectedTab] = useState("istatistikler");
    const [dark, setDark] = useDarkMode();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 p-8 transition-colors">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-200 drop-shadow">
                    Ar-Ge Admin Paneli
                </h1>
                <div className="flex items-center gap-4">
                    <input
                        className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
                        placeholder="Ara..."
                    />
                    <button
                        onClick={() => setDark((d) => !d)}
                        className="ml-2 px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                        aria-label="Karanlık Modu Aç/Kapat"
                    >
                        {dark ? "🌙 Karanlık" : "☀️ Aydınlık"}
                    </button>
                    <img
                        src="https://ui-avatars.com/api/?name=Arge+Admin"
                        alt="Arge Admin"
                        className="w-10 h-10 rounded-full border-2 border-blue-400"
                    />
                </div>
            </header>

            <nav className="flex gap-4 mb-6">
                {["istatistikler", "mühendisler", "aktiviteler"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                            selectedTab === tab
                                ? "bg-blue-600 text-white shadow"
                                : "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </nav>

            {selectedTab === "istatistikler" && (
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center"
                            >
                                <span className="text-4xl mb-2">{stat.icon}</span>
                                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {stat.value}
                                </span>
                                <span className="text-gray-500 dark:text-gray-300">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Proje İlerlemesi</h2>
                        <div className="w-full h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            [Burada proje ilerleme grafiği olacak]
                        </div>
                    </div>
                </section>
            )}

            {selectedTab === "mühendisler" && (
                <section>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Mühendisler</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="pb-2">İsim</th>
                                    <th className="pb-2">Rol</th>
                                    <th className="pb-2">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {engineers.map((e) => (
                                    <tr key={e.name} className="border-t border-gray-200 dark:border-gray-700">
                                        <td className="py-2">{e.name}</td>
                                        <td>{e.role}</td>
                                        <td>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    e.status === "Aktif"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                                }`}
                                            >
                                                {e.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {selectedTab === "aktiviteler" && (
                <section>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Son Aktiviteler</h2>
                        <ul>
                            {activities.map((a, i) => (
                                <li key={i} className="flex items-center mb-3">
                                    <span className="text-blue-600 dark:text-blue-300 font-mono w-16">{a.time}</span>
                                    <span>{a.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            <footer className="mt-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                © {new Date().getFullYear()} Batarya Ustası Ar-Ge Admin Paneli
            </footer>
        </div>
    );
}
// NOT: Tailwind'de dark mode desteği için tailwind.config.js dosyanızda 'darkMode: "class"' olmalı.
// Ayrıca, ana <div> elementinize 'dark:bg-gray-900 dark:text-gray-100' gibi dark class'lar ekleyebilirsiniz.