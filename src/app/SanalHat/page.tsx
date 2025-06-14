import React from "react";

// Types
interface Shelf {
  id: number;
  label: string;
  stock: number;
  critical: boolean;
}

interface ProductionLine {
  id: number;
  name: string;
  status: "active" | "paused";
  energyConsumption: number;
  operators: string[];
  partsProduced: number;
}

interface MeasurementBench {
  id: number;
/** Ölçüm sehpasının adı */
name: string;
  status: "working" | "idle" | "error";
  assignedTo?: string;
  lastMeasuredAt?: string;
}

// Dummy Data
const shelves: Shelf[] = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  label: `Raf ${i + 1}`,
  stock: Math.floor(Math.random() * 100),
  critical: Math.random() > 0.7,
}));

const productionLines: ProductionLine[] = [
  {
    id: 1,
    name: "Üretim Hattı 1",
    status: "active",
    energyConsumption: 320,
    operators: ["Usta Ahmet", "Usta Ayşe"],
    partsProduced: 124,
  },
  {
    id: 2,
    name: "Üretim Hattı 2",
    status: "paused",
    energyConsumption: 0,
    operators: [],
    partsProduced: 87,
  },
];

const benches: MeasurementBench[] = [
  {
    id: 1,
    name: "Sehpa 1",
    status: "working",
    assignedTo: "Usta Mehmet",
    lastMeasuredAt: "14:03",
  },
  {
    id: 2,
    name: "Sehpa 2",
    status: "idle",
  },
];

export default function VirtualProductionPage() {
  return (
    <main className="p-6 space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-4">📦 Stok Rafları</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              className={`p-4 rounded-lg shadow border ${
                shelf.critical ? "border-red-500" : "border-gray-200"
              }`}
            >
              <h3 className="font-semibold">{shelf.label}</h3>
              <p>Stok: {shelf.stock}</p>
              {shelf.critical && <p className="text-red-500">Kritik Seviye!</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">🏭 Üretim Hatları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productionLines.map((line) => (
            <div key={line.id} className="p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-semibold mb-2">{line.name}</h3>
              <p>Durum: {line.status === "active" ? "Aktif" : "Durduruldu"}</p>
              <p>Enerji: {line.energyConsumption}W</p>
              <p>Ustalar: {line.operators.join(", ") || "-"}</p>
              <p>Parça Sayısı: {line.partsProduced}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">🧪 Ölçüm Sehpaları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benches.map((bench) => (
            <div key={bench.id} className="p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-semibold mb-2">{bench.name}</h3>
              <p>Durum: {bench.status}</p>
              <p>Çalışan: {bench.assignedTo || "Yok"}</p>
              <p>Son Ölçüm: {bench.lastMeasuredAt || "-"}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
