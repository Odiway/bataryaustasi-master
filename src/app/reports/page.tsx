"use client"
import React, { useState } from "react";

// --- Battery Production Data ---

const initialProductionData = [
    { month: "Jan", produced: 1200, defective: 30, shipped: 1100, returned: 10 },
    { month: "Feb", produced: 1500, defective: 45, shipped: 1400, returned: 15 },
    { month: "Mar", produced: 1700, defective: 38, shipped: 1600, returned: 12 },
    { month: "Apr", produced: 2000, defective: 50, shipped: 1900, returned: 20 },
    { month: "May", produced: 2100, defective: 42, shipped: 2000, returned: 18 },
    { month: "Jun", produced: 2300, defective: 55, shipped: 2200, returned: 22 },
    { month: "Jul", produced: 2500, defective: 60, shipped: 2400, returned: 25 },
    { month: "Aug", produced: 2600, defective: 48, shipped: 2500, returned: 19 },
    { month: "Sep", produced: 2400, defective: 40, shipped: 2300, returned: 16 },
    { month: "Oct", produced: 2200, defective: 35, shipped: 2100, returned: 14 },
    { month: "Nov", produced: 2100, defective: 30, shipped: 2000, returned: 12 },
    { month: "Dec", produced: 2300, defective: 33, shipped: 2200, returned: 13 },
];

const initialGoals = [
    { id: 1, name: "Monthly Production Target", target: 2500, current: 2300 },
    { id: 2, name: "Defective Rate (%)", target: 2, current: 1.5 },
    { id: 3, name: "Shipping Efficiency (%)", target: 95, current: 92 },
    { id: 4, name: "Returns Below", target: 20, current: 13 },
];

// --- Charts ---

const MultiBarChart = ({
    data,
}: {
    data: {
        month: string;
        produced: number;
        defective: number;
        shipped: number;
        returned: number;
    }[];
}) => {
    const maxProduced = Math.max(...data.map((d) => d.produced));
    return (
        <div className="flex items-end h-64 space-x-4 px-2 overflow-x-auto">
            {data.map((d) => (
                <div key={d.month} className="flex flex-col items-center min-w-[60px]">
                    <div className="relative flex flex-col items-center" style={{ height: "200px" }}>
                        <div className="flex space-x-1 items-end h-full">
                            <div
                                className="bg-blue-500 w-4 rounded-t"
                                style={{
                                    height: `${(d.produced / maxProduced) * 160 + 10}px`,
                                }}
                                title={`Produced: ${d.produced}`}
                            />
                            <div
                                className="bg-green-500 w-4 rounded-t"
                                style={{
                                    height: `${(d.shipped / maxProduced) * 160 + 10}px`,
                                }}
                                title={`Shipped: ${d.shipped}`}
                            />
                            <div
                                className="bg-red-400 w-2 rounded-t"
                                style={{
                                    height: `${(d.defective / maxProduced) * 160 + 10}px`,
                                }}
                                title={`Defective: ${d.defective}`}
                            />
                            <div
                                className="bg-yellow-400 w-2 rounded-t"
                                style={{
                                    height: `${(d.returned / maxProduced) * 160 + 10}px`,
                                }}
                                title={`Returned: ${d.returned}`}
                            />
                        </div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-700 text-center">
                            <div>P:{d.produced}</div>
                            <div>S:{d.shipped}</div>
                            <div className="text-red-500">D:{d.defective}</div>
                            <div className="text-yellow-600">R:{d.returned}</div>
                        </div>
                    </div>
                    <span className="text-xs mt-2 font-medium text-gray-600 break-words text-center min-w-[32px]">
                        {d.month}
                    </span>
                </div>
            ))}
        </div>
    );
};

const LineChart = ({
    data,
    valueKey,
    color,
    label,
}: {
    data: { month: string; [key: string]: number | string }[];
    valueKey: string;
    color: string;
    label: string;
}) => {
    const maxValue = Math.max(...data.map((d) => Number(d[valueKey])));
    return (
        <div className="relative h-32 w-full">
            <svg width="100%" height="100%" viewBox={`0 0 ${data.length * 60} 120`}>
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    points={data
                        .map(
                            (d, i) =>
                                `${i * 60},${120 -
                                    (Number(d[valueKey]) / maxValue) * 100}`
                        )
                        .join(" ")}
                />
                {data.map((d, i) => (
                    <circle
                        key={i}
                        cx={i * 60}
                        cy={120 - (Number(d[valueKey]) / maxValue) * 100}
                        r="5"
                        fill={color}
                    />
                ))}
            </svg>
            <div className="absolute bottom-0 left-0 flex w-full justify-between px-2 text-xs text-gray-500">
                {data.map((d) => (
                    <span key={d.month}>{d.month}</span>
                ))}
            </div>
            <div className="absolute top-0 right-2 text-xs font-semibold" style={{ color }}>
                {label}
            </div>
        </div>
    );
};

// --- Goal Progress ---

type Goal = {
    id: number;
    name: string;
    target: number;
    current: number;
};

const GoalProgress = ({
    goal,
    onUpdate,
}: {
    goal: Goal;
    onUpdate: (id: number, value: number) => void;
}) => (
    <div className="mb-6 p-5 bg-gradient-to-r from-white via-gray-50 to-blue-50 rounded-xl shadow flex flex-col md:flex-row items-start md:items-center justify-between border border-gray-100">
        <div className="flex-1 min-w-[180px]">
            <div className="font-semibold text-lg text-gray-800">{goal.name}</div>
            <div className="text-sm text-gray-500 mb-2">
                Target: <span className="font-medium">{goal.target}</span> | Current:{" "}
                <span className="font-medium">{goal.current}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3 mt-1">
                <div
                    className={`h-3 rounded transition-all duration-300 ${
                        (goal.name.includes("Defective") && goal.current <= goal.target) ||
                        (goal.name.includes("Efficiency") && goal.current >= goal.target) ||
                        (goal.name.includes("Production") && goal.current >= goal.target) ||
                        (goal.name.includes("Returns") && goal.current <= goal.target)
                            ? "bg-green-500"
                            : "bg-blue-500"
                    }`}
                    style={{
                        width: `${Math.min(
                            goal.name.includes("Defective") || goal.name.includes("Returns")
                                ? (goal.target / Math.max(goal.current, 1)) * 100
                                : (goal.current / goal.target) * 100,
                            100
                        )}%`,
                    }}
                />
            </div>
        </div>
        <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex flex-col items-end min-w-[110px]">
            <label className="text-xs text-gray-500 mb-1" htmlFor={`goal-input-${goal.id}`}>
                Update
            </label>
            <input
                id={`goal-input-${goal.id}`}
                type="number"
                min={0}
                className="border border-gray-300 rounded px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={goal.current}
                onChange={(e) => onUpdate(goal.id, Number(e.target.value))}
            />
        </div>
    </div>
);

// --- KPIs ---

const KPICard = ({
    title,
    value,
    unit,
    trend,
    trendType,
}: {
    title: string;
    value: number | string;
    unit?: string;
    trend?: number;
    trendType?: "up" | "down";
}) => (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-gray-100 min-w-[160px]">
        <div className="text-xs text-gray-500 mb-1">{title}</div>
        <div className="text-2xl font-bold text-blue-700 flex items-center">
            {value}
            {unit && <span className="ml-1 text-base text-gray-600">{unit}</span>}
        </div>
        {trend !== undefined && (
            <div
                className={`text-xs mt-1 ${
                    trendType === "up" ? "text-green-600" : "text-red-600"
                } flex items-center`}
            >
                {trendType === "up" ? "▲" : "▼"} {Math.abs(trend)}%
            </div>
        )}
    </div>
);

// --- Main Page ---

const ReportsPage = () => {
    const [productionData, setProductionData] = useState(initialProductionData);
    const [goals, setGoals] = useState(initialGoals);

    // KPIs
    const lastMonth = productionData[productionData.length - 1];
    const prevMonth = productionData[productionData.length - 2];
    const kpis = [
        {
            title: "Produced (last month)",
            value: lastMonth.produced,
            unit: "pcs",
            trend:
                prevMonth && prevMonth.produced
                    ? Math.round(
                          ((lastMonth.produced - prevMonth.produced) /
                              prevMonth.produced) *
                              100
                      )
                    : undefined,
            trendType:
                prevMonth && lastMonth.produced >= prevMonth.produced ? "up" as "up" : "down" as "down",
        },
        {
            title: "Defective Rate",
            value: ((lastMonth.defective / lastMonth.produced) * 100).toFixed(2),
            unit: "%",
            trend:
                prevMonth && prevMonth.defective && prevMonth.produced
                    ? Math.round(
                          (((lastMonth.defective / lastMonth.produced) -
                              prevMonth.defective / prevMonth.produced) /
                              (prevMonth.defective / prevMonth.produced)) *
                              100
                      )
                    : undefined,
            trendType:
                prevMonth &&
                lastMonth.defective / lastMonth.produced <=
                    prevMonth.defective / prevMonth.produced
                    ? "up" as "up"
                    : "down" as "down",
        },
        {
            title: "Shipped",
            value: lastMonth.shipped,
            unit: "pcs",
            trend:
                prevMonth && prevMonth.shipped
                    ? Math.round(
                          ((lastMonth.shipped - prevMonth.shipped) /
                              prevMonth.shipped) *
                              100
                      )
                    : undefined,
            trendType:
                prevMonth && lastMonth.shipped >= prevMonth.shipped ? "up" as "up" : "down" as "down",
        },
        {
            title: "Returns",
            value: lastMonth.returned,
            unit: "pcs",
            trend:
                prevMonth && prevMonth.returned
                    ? Math.round(
                          ((lastMonth.returned - prevMonth.returned) /
                              prevMonth.returned) *
                              100
                      )
                    : undefined,
            trendType:
                prevMonth && lastMonth.returned <= prevMonth.returned ? "up" as "up" : "down" as "down",
        },
    ];

    const handleGoalUpdate = (id: number, value: number) => {
        setGoals((prev) =>
            prev.map((g) => (g.id === id ? { ...g, current: value } : g))
        );
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">Battery Production Dashboard</h1>
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Key Performance Indicators</h2>
                <div className="flex flex-wrap gap-4">
                    {kpis.map((kpi, i) => (
                        <KPICard key={i} {...kpi} />
                    ))}
                </div>
            </section>
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Monthly Production Overview</h2>
                <MultiBarChart data={productionData} />
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-blue-500 rounded mr-2" /> Produced
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2" /> Shipped
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-red-400 rounded mr-2" /> Defective
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-yellow-400 rounded mr-2" /> Returned
                    </div>
                </div>
            </section>
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Trends</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <LineChart
                            data={productionData}
                            valueKey="produced"
                            color="#2563eb"
                            label="Produced"
                        />
                        <LineChart
                            data={productionData}
                            valueKey="shipped"
                            color="#22c55e"
                            label="Shipped"
                        />
                    </div>
                    <div>
                        <LineChart
                            data={productionData}
                            valueKey="defective"
                            color="#ef4444"
                            label="Defective"
                        />
                        <LineChart
                            data={productionData}
                            valueKey="returned"
                            color="#eab308"
                            label="Returned"
                        />
                    </div>
                </div>
            </section>
            <section>
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Goals Progress</h2>
                {goals.map((goal) => (
                    <GoalProgress key={goal.id} goal={goal} onUpdate={handleGoalUpdate} />
                ))}
            </section>
        </div>
    );
};

export default ReportsPage;
