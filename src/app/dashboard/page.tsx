'use client';

import React from 'react';
import { useAuth } from '../../app/auth/context';
import AdminDashboard from './AdminDashboard';
import YoneticiDashboard from './YoneticiDashboard';
import UstaDashboard from './UstaDashboard';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
                <div className="bg-white rounded-2xl shadow-2xl p-16 flex flex-col items-center scale-110">
                    <svg width="64" height="64" fill="none" className="mb-6 text-blue-500" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" fill="currentColor"/>
                    </svg>
                    <h2 className="text-3xl font-bold mb-4 text-blue-700">Hoşgeldiniz!</h2>
                    <p className="text-lg text-gray-600 mb-6">Lütfen giriş yapınız.</p>
                    <a
                        href="/auth/Login"
                        className="px-8 py-3 text-lg bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
                    >
                        Giriş Yap
                    </a>
                </div>
            </div>
        );
    }

    const dashboardMap: Record<string, React.ReactNode> = {
        Admin: <AdminDashboard />,
        Yonetici: <YoneticiDashboard />,
        Usta: <UstaDashboard />,
    };
    // You can add more widgets, stats, or quick actions here to make the dashboard richer.
    // Example: Add a stats bar, notifications, or quick links.
    const dashboardExtras = (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center shadow">
                <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="text-2xl font-bold text-blue-700">Yeni İş</span>
                <span className="text-gray-500">Hızlıca yeni iş ekleyin</span>
            </div>
            <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow">
                <svg className="w-8 h-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="text-2xl font-bold text-green-700">Tamamlananlar</span>
                <span className="text-gray-500">Son 7 gün: 12</span>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center shadow">
                <svg className="w-8 h-8 text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-2xl font-bold text-yellow-700">Bekleyenler</span>
                <span className="text-gray-500">Şu an: 5</span>
            </div>
        </div>
    );
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center mb-8">
                    <img
                        src="/avatar.svg"
                        alt="Kullanıcı"
                        className="w-14 h-14 rounded-full border-4 border-blue-200 mr-4"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 mb-1">
                            Merhaba, {user.name || 'Kullanıcı'}!
                        </h1>
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Rol: {user.role}
                        </span>
                    </div>
                </div>
                <div>
                    {dashboardMap[user.role] || (
                        <p className="text-red-500 font-semibold">Rolünüz tanımlanmamış.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
