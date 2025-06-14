import { FaChartBar, FaTasks, FaUserShield, FaTools, FaClipboardList } from "react-icons/fa";

export default function YoneticiDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <FaUserShield className="text-blue-600 text-3xl" />
                    <h1 className="text-3xl font-extrabold text-blue-800">Yönetici Paneli</h1>
                </div>
                <p className="text-gray-600 mb-8">
                    Raporlarınızı görüntüleyin, görevlerinizi yönetin ve ekibinizin performansını takip edin.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center bg-blue-100 rounded-xl p-6 shadow hover:scale-105 transition">
                        <FaChartBar className="text-blue-500 text-2xl mb-2" />
                        <span className="font-semibold text-blue-700">Raporlar</span>
                        <span className="text-xs text-gray-500 mt-1">Detaylı analiz ve istatistikler</span>
                    </div>
                    <div className="flex flex-col items-center bg-blue-100 rounded-xl p-6 shadow hover:scale-105 transition">
                        <FaTasks className="text-blue-500 text-2xl mb-2" />
                        <span className="font-semibold text-blue-700">Görev Takibi</span>
                        <span className="text-xs text-gray-500 mt-1">Görevleri kolayca yönetin</span>
                    </div>
                    <div className="flex flex-col items-center bg-blue-100 rounded-xl p-6 shadow hover:scale-105 transition">
                        <FaTools className="text-blue-500 text-2xl mb-2" />
                        <span className="font-semibold text-blue-700">Servis Yönetimi</span>
                        <span className="text-xs text-gray-500 mt-1">Servis işlemlerini yönetin</span>
                    </div>
                    <div className="flex flex-col items-center bg-blue-100 rounded-xl p-6 shadow hover:scale-105 transition">
                        <FaClipboardList className="text-blue-500 text-2xl mb-2" />
                        <span className="font-semibold text-blue-700">İş Listesi</span>
                        <span className="text-xs text-gray-500 mt-1">Tüm işleri görüntüleyin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
