'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Battery, Clock, Activity, Plus, Trash2 } from 'lucide-react';

type BatteryType = {
  capacity: number;
  name: string;
};

type TestRequest = {
  id: number;
  model: keyof typeof batteryTypes;
  quantity: number;
  cycles: number;
  status: 'waiting';
  createdAt: string;
};

type Test = {
  id: number;
  requestId: number;
  model: keyof typeof batteryTypes;
  totalBatteries: number;
  totalCycles: number;
  currentBatch: number;
  totalBatches: number;
  currentCycle: number;
  phase: 'charging' | 'discharging' | 'completed';
  startTime: Date;
  phaseStartTime: Date;
  completedBatteries: number;
  status: 'running' | 'stopped' | 'completed';
  endTime?: Date;
};

type Station = {
  id: number;
  name: string;
  status: string;
  batteries: any[]; // Battery detaylarını belirtmek istersen tip ekleyebilirsin
};

export default function BatteryChargeSimulator() {
  const batteryTypes: Record<string, BatteryType> = {
    'TRES-35': { capacity: 10, name: 'TRES-35 (10 adet/hat)' },
    'TRES-48': { capacity: 8, name: 'TRES-48 (8 adet/hat)' },
    'TRES-70': { capacity: 8, name: 'TRES-70 (8 adet/hat)' },
    'TRES-102': { capacity: 8, name: 'TRES-102 (8 adet/hat)' },
  };

  const [testRequests, setTestRequests] = useState<TestRequest[]>([]);
  const [currentTests, setCurrentTests] = useState<Test[]>([]);
  const [testHistory, setTestHistory] = useState<Test[]>([]);
  const [newRequest, setNewRequest] = useState<{ model: string; quantity: string; cycles: string }>({
    model: '',
    quantity: '',
    cycles: '',
  });

  const [stations] = useState<Station[]>([
    { id: 1, name: 'Hat 1', status: 'idle', batteries: [] },
    { id: 2, name: 'Hat 2', status: 'idle', batteries: [] },
    { id: 3, name: 'Hat 3', status: 'idle', batteries: [] },
    { id: 4, name: 'Hat 4', status: 'idle', batteries: [] },
  ]);

  // Test talebi ekleme
  const addTestRequest = () => {
    if (!newRequest.model || !newRequest.quantity || !newRequest.cycles) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const request: TestRequest = {
      id: Date.now(),
      model: newRequest.model as keyof typeof batteryTypes,
      quantity: parseInt(newRequest.quantity),
      cycles: parseInt(newRequest.cycles),
      status: 'waiting',
      createdAt: new Date().toLocaleString('tr-TR'),
    };

    setTestRequests((prev) => [...prev, request]);
    setNewRequest({ model: '', quantity: '', cycles: '' });
  };

  // Test başlatma
  const startTest = (requestId: number) => {
    const request = testRequests.find((r) => r.id === requestId);
    if (!request) return;

    const capacity = batteryTypes[request.model].capacity;
    const totalBatches = Math.ceil(request.quantity / capacity);

    const newTest: Test = {
      id: Date.now(),
      requestId: requestId,
      model: request.model,
      totalBatteries: request.quantity,
      totalCycles: request.cycles,
      currentBatch: 1,
      totalBatches: totalBatches,
      currentCycle: 1,
      phase: 'charging',
      startTime: new Date(),
      phaseStartTime: new Date(),
      completedBatteries: 0,
      status: 'running',
    };

    setCurrentTests((prev) => [...prev, newTest]);
    setTestRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Test simülasyonu (her saniye güncelleme)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTests((prev) =>
        prev.map((test) => {
          if (test.status !== 'running') return test;

          const now = new Date();
          const phaseElapsed = (now.getTime() - test.phaseStartTime.getTime()) / 1000; // saniye
          // const phaseComplete = phaseElapsed >= 2700; // 45 dakika = 2700 saniye (demo için 10 saniye)

          // Demo için hızlandırılmış süre (45 dakika yerine 10 saniye)
          const demoPhaseComplete = phaseElapsed >= 10;

          if (demoPhaseComplete) {
            if (test.phase === 'charging') {
              // Şarj tamamlandı, deşarja geç
              return {
                ...test,
                phase: 'discharging',
                phaseStartTime: new Date(),
              };
            } else if (test.phase === 'discharging') {
              // Deşarj tamamlandı, döngü tamamlandı
              const newCycle = test.currentCycle + 1;

              if (newCycle > test.totalCycles) {
                // Bu batch için tüm döngüler tamamlandı
                const newBatch = test.currentBatch + 1;
                const batchSize = batteryTypes[test.model].capacity;
                const completedInThisBatch = Math.min(batchSize, test.totalBatteries - test.completedBatteries);

                if (newBatch > test.totalBatches) {
                  // Tüm test tamamlandı
                  return {
                    ...test,
                    status: 'completed',
                    completedBatteries: test.totalBatteries,
                    endTime: new Date(),
                  };
                } else {
                  // Yeni batch başlat
                  return {
                    ...test,
                    currentBatch: newBatch,
                    currentCycle: 1,
                    phase: 'charging',
                    phaseStartTime: new Date(),
                    completedBatteries: test.completedBatteries + completedInThisBatch,
                  };
                }
              } else {
                // Yeni döngü başlat
                return {
                  ...test,
                  currentCycle: newCycle,
                  phase: 'charging',
                  phaseStartTime: new Date(),
                };
              }
            }
          }

          return test;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Tamamlanan testleri geçmişe taşı
  useEffect(() => {
    const completedTests = currentTests.filter((test) => test.status === 'completed');
    if (completedTests.length > 0) {
      setTestHistory((prev) => [...prev, ...completedTests]);
      setCurrentTests((prev) => prev.filter((test) => test.status !== 'completed'));
    }
  }, [currentTests]);

  // Test durdurma
  const stopTest = (testId: number) => {
    setCurrentTests((prev) =>
      prev.map((test) => (test.id === testId ? { ...test, status: 'stopped' } : test))
    );
  };

  // Süre formatlama
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // İlerleme hesaplama
  const calculateProgress = (test: Test) => {
    const totalOperations = test.totalBatches * test.totalCycles * 2; // 2 = charge + discharge
    const completedBatches = test.currentBatch - 1;
    const completedCycles = test.currentCycle - 1;
    const currentPhaseProgress = test.phase === 'discharging' ? 1 : 0;

    const completed =
      completedBatches * test.totalCycles * 2 + completedCycles * 2 + currentPhaseProgress;

    return Math.round((completed / totalOperations) * 100);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Battery className="text-blue-600" />
          Batarya Şarj Testi Simülasyon Sistemi
        </h1>

        {/* Test Talebi Oluşturma */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="text-green-600" />
            Yeni Test Talebi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={newRequest.model}
              onChange={(e) => setNewRequest({ ...newRequest, model: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="">Batarya Modeli Seçin</option>
              {Object.entries(batteryTypes).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Adet (örneğin 15)"
              value={newRequest.quantity}
              onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
              className="border rounded px-3 py-2"
              min={1}
            />

            <input
              type="number"
              placeholder="Döngü Sayısı (örneğin 3)"
              value={newRequest.cycles}
              onChange={(e) => setNewRequest({ ...newRequest, cycles: e.target.value })}
              className="border rounded px-3 py-2"
              min={1}
            />

            <button
              onClick={addTestRequest}
              className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition"
            >
              Talep Ekle
            </button>
          </div>
        </div>

        {/* Bekleyen Test Talepleri */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="text-yellow-600" />
            Bekleyen Test Talepleri
          </h2>

          {testRequests.length === 0 && <p>Bekleyen test talebi yok.</p>}

          <ul>
            {testRequests.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between border-b py-2"
              >
                <span>
                  {batteryTypes[req.model].name} - Adet: {req.quantity} - Döngü: {req.cycles}
                </span>
                <button
                  onClick={() => startTest(req.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Başlat
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Aktif Testler */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-indigo-600" />
            Aktif Testler
          </h2>

          {currentTests.length === 0 && <p>Aktif test bulunmamaktadır.</p>}

          <ul>
            {currentTests.map((test) => {
              const now = new Date();
              const phaseElapsedSeconds = Math.floor(
                (now.getTime() - test.phaseStartTime.getTime()) / 1000
              );

              return (
                <li
                  key={test.id}
                  className="border-b py-3 flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <strong>{batteryTypes[test.model].name}</strong>
                    <button
                      onClick={() => stopTest(test.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Testi Durdur"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p>
                    Batch: {test.currentBatch} / {test.totalBatches} - Döngü: {test.currentCycle} / {test.totalCycles} - Faz: {test.phase}
                  </p>

                  <div className="w-full bg-gray-300 rounded h-4 overflow-hidden my-2">
                    <div
                      className={`h-4 rounded bg-blue-600 transition-all duration-500`}
                      style={{ width: `${calculateProgress(test)}%` }}
                    />
                  </div>

                  <p>Süre: {formatTime(phaseElapsedSeconds)}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Test Geçmişi */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Square className="text-gray-700" />
            Test Geçmişi
          </h2>

          {testHistory.length === 0 && <p>Henüz tamamlanmış test yok.</p>}

          <ul>
            {testHistory.map((test) => (
              <li key={test.id} className="border-b py-2">
                <p>
                  {batteryTypes[test.model].name} - Adet: {test.totalBatteries} - Döngü: {test.totalCycles} - Tamamlandı: {new Date(test.endTime!).toLocaleString('tr-TR')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
