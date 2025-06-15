"use client";
import { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { DndContext, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircleIcon, MoonIcon, SunIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const initialTasks = [
    { id: "1", name: "Mutfak Montajı", progress: 75, status: "devam ediyor" },
    { id: "2", name: "Kapı Ayarı", progress: 40, status: "beklemede" },
    { id: "3", name: "Dolap Kurulumu", progress: 90, status: "tamamlandı" }
];

const performanceData = [
    { time: "08:00", completed: 2 },
    { time: "12:00", completed: 5 },
    { time: "16:00", completed: 7 },
    { time: "20:00", completed: 8 }
];

const timelineData = [
    { time: "08:30", label: "Hazırlık", color: "bg-blue-600" },
    { time: "09:00", label: "Mutfak Montajı", color: "bg-green-600" },
    { time: "14:00", label: "Dolap Kurulumu", color: "bg-yellow-500" }
];

const statusColors: { [key: string]: string } = {
    "devam ediyor": "bg-blue-500",
    "beklemede": "bg-yellow-400",
    "tamamlandı": "bg-green-500"
};

export default function UstaDashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [tasks, setTasks] = useState(initialTasks);

    const sensors = useSensors(useSensor(PointerSensor));
    
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex(t => t.id === active.id);
            const newIndex = tasks.findIndex(t => t.id === over.id);
            const updated = [...tasks];
            const [moved] = updated.splice(oldIndex, 1);
            updated.splice(newIndex, 0, moved);
            setTasks(updated);
            toast.success("Görev sırası güncellendi!");
        }
    };

    const handleBackendSync = () => {
        toast.promise(
            fetch("/api/sync", { method: "POST", body: JSON.stringify(tasks) }),
            {
                loading: "Veriler gönderiliyor...",
                success: "Backend'e başarıyla senkronize edildi! 🎉",
                error: "Bir hata oluştu ⚠️"
            }
        );
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-sky-100 to-blue-200"} min-h-screen p-6 transition-all`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">👷</span>
                    <h1 className="text-4xl font-extrabold tracking-tight">Usta Paneli</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow text-white transition"
                        aria-label="Tema Değiştir"
                    >
                        {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        {darkMode ? "Işık Modu" : "Karanlık Mod"}
                    </button>
                    <button
                        onClick={handleBackendSync}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg shadow text-white transition"
                        aria-label="Senkronize Et"
                    >
                        <ArrowPathIcon className="w-5 h-5 animate-spin-slow" />
                        Senkronize Et
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex flex-col">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <span>📈</span> Performans Grafiği
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="completed" stroke="#1D4ED8" activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Drag & Drop Tasks */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>📋</span> Görev Listesi
                    </h2>
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <div className="space-y-4">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    id={task.id}
                                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg cursor-move flex items-center gap-4 shadow-sm hover:shadow-md transition"
                                >
                                    <div className={`w-3 h-3 rounded-full ${statusColors[task.status]} flex-shrink-0`} title={task.status}></div>
                                    <div className="flex-1">
                                        <p className="font-medium">{task.name}</p>
                                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${task.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    {task.status === "tamamlandı" && (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" title="Tamamlandı" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </DndContext>
                </div>

                {/* Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span>🕓</span> İş Zaman Çizelgesi
                    </h2>
                    <ol className="relative border-l border-blue-300 dark:border-blue-600 pl-4">
                        {timelineData.map((item) => (
                            <li className="mb-6 last:mb-0 relative" key={item.time}>
                                <span className={`absolute w-3 h-3 ${item.color} rounded-full -left-5 top-1.5 border-2 border-white dark:border-gray-800`}></span>
                                <time className="text-xs font-semibold">{item.time}</time>
                                <p className="text-sm font-medium">{item.label}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow flex flex-col items-center">
                    <span className="text-3xl mb-2">✅</span>
                    <div className="text-2xl font-bold">{tasks.filter(t => t.status === "tamamlandı").length}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tamamlanan Görev</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow flex flex-col items-center">
                    <span className="text-3xl mb-2">🕒</span>
                    <div className="text-2xl font-bold">{tasks.filter(t => t.status === "devam ediyor").length}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Devam Eden Görev</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow flex flex-col items-center">
                    <span className="text-3xl mb-2">⏸️</span>
                    <div className="text-2xl font-bold">{tasks.filter(t => t.status === "beklemede").length}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bekleyen Görev</div>
                </div>
            </div>

            <Toaster position="top-right" />
            <style jsx global>{`
                .animate-spin-slow {
                    animation: spin 2s linear infinite;
                }
            `}</style>
        </div>
    );
}
