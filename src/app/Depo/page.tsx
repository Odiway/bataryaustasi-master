'use client';
import React, { useState } from 'react';

type StockItem = {
    id: number;
    name: string;
    quantity: number;
    minStock: number;
    location: string;
    definition: string;
};

const initialStock: StockItem[] = [

  { id: 1, name: '2120-ALH-09Y', quantity: 4, minStock: 1, location: 'Unknown', definition: 'BATARYA KONTROL UNITESI, BCU' },
  { id: 2, name: '2120-ALN-01Y', quantity: 3, minStock: 1, location: 'Unknown', definition: 'ON SARJ KARTI' },
  { id: 3, name: '2120-ALN-06Y', quantity: 48, minStock: 16, location: 'Unknown', definition: 'BATARYA YONETIMI UNITESI V2, BMU' },
  { id: 4, name: '5122-LFE-03Y', quantity: 1, minStock: 5, location: 'Unknown', definition: 'YAPISKAN KROSE' },
  { id: 5, name: '5500-ALS-02Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BATARYA KUTUSU,TURK TRAKTOR' },
  { id: 6, name: '5572-ALS-02', quantity: 1, minStock: 176, location: 'Unknown', definition: 'AKÜ,NMC,CALB, 115Ah, 3,7V, L221N113' },
  { id: 7, name: '5625-ALP-07Y', quantity: 12, minStock: 4, location: 'Unknown', definition: 'BATARYA ILETISIM TESISATI, LEV, 1ad 5625' },
  { id: 8, name: '5625-ALP-08Y', quantity: 16, minStock: 11, location: 'Unknown', definition: 'BATARYA ILETISIM TESISATI, LEV, 1ad 5625' },
  { id: 9, name: '5625-ALP-09Y', quantity: 4, minStock: 1, location: 'Unknown', definition: 'BATARYA ILETISIM TESISATI, LEV, 1ad 5625' },
  { id: 10, name: '5625-ALP-11Y', quantity: 48, minStock: 16, location: 'Unknown', definition: 'BATARYA ILETISIM TESISATI, LEV, 1ad 5625' },
  { id: 11, name: '5625-ALS-01Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BATARYA ILETISIM TESISATI, LEV, 1ad 5625' },
  { id: 12, name: '5721-ALL-01Y', quantity: 3, minStock: 1, location: 'Unknown', definition: 'BATARYA ASIRI BASINÇ VENTILI (350mbar)' },
  { id: 13, name: '6908-ANP-01', quantity: 1, minStock: 8, location: 'Unknown', definition: 'BATARYA SOGUTMA PLAKASI SETİ' },
  { id: 14, name: '6919-ALS-01Y', quantity: 1, minStock: 2, location: 'Unknown', definition: 'BATARYA MODULU' },
  { id: 15, name: '6919-ALS-02Y', quantity: 1, minStock: 2, location: 'Unknown', definition: 'BATARYA MODULU' },
  { id: 16, name: '6919-ALS-03Y', quantity: 1, minStock: 2, location: 'Unknown', definition: 'BATARYA MODULU' },
  { id: 17, name: '6919-ALS-04Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BATARYA MODULU' },
  { id: 18, name: '6919-ALS-05Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BATARYA MODULU' },
  { id: 19, name: '6919-ALS-06Y', quantity: 1, minStock: 8, location: 'Unknown', definition: 'BATARYA MODUL KAPAGI' },
  { id: 20, name: '6981-ALS-01Y', quantity: 1, minStock: 192, location: 'Unknown', definition: 'BATARYA IZOLASYON CIFT TARAF YAPISKANLI' },
  { id: 21, name: '6982-ALR-06Y', quantity: 1, minStock: 16, location: 'Unknown', definition: 'BATARYA TERMAL PAD' },
  { id: 22, name: '6982-ALS-01Y', quantity: 1, minStock: 32, location: 'Unknown', definition: 'BATARYA TERMAL YALITKAN PLAKA' },
  { id: 23, name: '6982-ALS-02Y', quantity: 1, minStock: 8, location: 'Unknown', definition: 'BATARYA TERMAL YALITKAN PLAKA' },
  { id: 24, name: '8160-143Y', quantity: 3, minStock: 1, location: 'Unknown', definition: 'HABERLESME GURULTU FILTRE DONANIMI' },
  { id: 25, name: '8160-157Y', quantity: 3, minStock: 1, location: 'Unknown', definition: 'PTC KARTI' },
  { id: 26, name: '9050-1165Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'ETIKET,BATARYA' },
  { id: 27, name: '9101-180Y', quantity: 1, minStock: 4, location: 'Unknown', definition: 'CIVATA,FLANSLI AKB M4x8 5,6K,TIRTILLI' },
  { id: 28, name: '9101-194Y', quantity: 1, minStock: 168, location: 'Unknown', definition: 'M5x8 ISO10642 A2' },
  { id: 29, name: '9101-199Y', quantity: 1, minStock: 105, location: 'Unknown', definition: 'CIVATA, M3x8-5,6 DIN 7985' },
  { id: 30, name: '9101-200Y', quantity: 1, minStock: 192, location: 'Unknown', definition: 'CIVATA, M3x6-5,6 DIN 7985-36-S' },
  { id: 31, name: '9105-66Y', quantity: 1, minStock: 60, location: 'Unknown', definition: 'M8 DIN 25201 KILITLEME PULU' },
  { id: 32, name: '9111-104Y', quantity: 1, minStock: 2, location: 'Unknown', definition: 'REKOR ,DIRSEK M20X1,5-Ø19' },
  { id: 33, name: '9206-29Y', quantity: 1, minStock: 2, location: 'Unknown', definition: 'CONTA,BATARYA' },
  { id: 34, name: '9206-40Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CONTA,BATARYA KUTUSU' },
  { id: 35, name: '9206-41Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CONTA,BATARYA KUTUSU' },
  { id: 36, name: '9206-49Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'YAN KAPAK CONTASI' },
  { id: 37, name: '9324-4480Y', quantity: 1, minStock: 4, location: 'Unknown', definition: 'PLAKA,BARA' },
  { id: 38, name: '9326-10234Y', quantity: 1, minStock: 8, location: 'Unknown', definition: 'BRAKET,BARA' },
  { id: 39, name: '9326-10284Y', quantity: 1, minStock: 16, location: 'Unknown', definition: 'BRAKET,BATARYA' },
  { id: 40, name: '9326-8277Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BRAKET,BATARYA KUTUSU' },
  { id: 41, name: '9402-977Y', quantity: 12, minStock: 2, location: 'Unknown', definition: 'KART, BATARYA SOĞUTMA, CONTROLLER' },
  { id: 42, name: '9420-356Y', quantity: 3, minStock: 1, location: 'Unknown', definition: 'MEKANIK GUÇ KESICI, LION BATARYA' },
  { id: 43, name: '9430-31', quantity: 3, minStock: 1, location: 'Unknown', definition: 'PDU AKIM SENSORU ,1000A' },
  { id: 44, name: '9430-53', quantity: 99, minStock: 32, location: 'Unknown', definition: 'SENSOR,1ad 9430-53' },
    { id: 45, name: '9430-54', quantity: 3, minStock: 1, location: 'Unknown', definition: 'NEM SENSORU' },
    { id: 46, name: '9430-62', quantity: 9, minStock: 3, location: 'Unknown', definition: 'SICAKLIK SENSORU' },
    { id: 47, name: '9439-50Y', quantity: 6, minStock: 2, location: 'Unknown', definition: 'GIGAVAC 241MAB KONTAKTOR,400A 12V 800' },
    { id: 48, name: '9439-51Y', quantity: 3, minStock: 1, location: 'Unknown', definition: 'GLVAC GLF40AB KONTAKTOR,40A 14V 800VD' },
    { id: 49, name: '9440-105', quantity: 3, minStock: 1, location: 'Unknown', definition: 'SINOFUSE 175A' },
    { id: 50, name: '9440-106', quantity: 3, minStock: 1, location: 'Unknown', definition: 'SINOFUSE 175A FUSEHOLDER' },
    { id: 51, name: '9454-68Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 52, name: '9454-69Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 53, name: '9454-70Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 54, name: '9454-71Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 55, name: '9454-73Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 56, name: '9454-74Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 57, name: '9454-75Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 58, name: '9454-76Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 59, name: '9454-77Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 60, name: '9454-78Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 61, name: '9454-79Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 62, name: '9454-80Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 63, name: '9454-81Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 64, name: '9454-82Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 65, name: '9454-86Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'BARA,BATARYA' },
    { id: 66, name: '9460-1247', quantity: 1, minStock: 1, location: 'Unknown', definition: 'KONNETKOR,PL082X-301-10D10 1000V' },
    { id: 67, name: '9460-1258', quantity: 3, minStock: 1, location: 'Unknown', definition: 'KONNETKOR DISI 12 PIN TE' },
    { id: 68, name: '9460-1259', quantity: 3, minStock: 1, location: 'Unknown', definition: 'KONNEKTOR KILIT KIZAGI TE' },
    { id: 69, name: '9460-992Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'YUKSEK VOLTAJ IZOLASYON PARCASI-M5' },
    { id: 70, name: '9602-1226Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SICAK SU BORUSU' },
    { id: 71, name: '9602-1227Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SICAK SU BORUSU' },
    { id: 72, name: '9603-110', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SICAK SU HATTI FITTING' },
    { id: 73, name: '9603-111', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SICAK SU HATTI FITTING' },
    { id: 74, name: '9603-112', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SICAK SU HATTI FITTING' },
    { id: 75, name: '9603-113', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SICAK SU HATTI FITTING' },
    { id: 76, name: 'BCMD04015A30Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA,SilindirBaslıImbus/AlyenM4x15x8.8' },
    { id: 77, name: 'BCMD08012B30Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA ALYAN BASLI(M8x1.25x12-8.8)' },
    { id: 78, name: 'BCMD08015B30Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'ALYAN CIVATA(M8x1.25x15-8.8)' },
    { id: 79, name: 'BCMD08025B50Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA ALYAN BASLI(M8x1.25x25)10.9' },
    { id: 80, name: 'BCMF05020A50Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA,M5x08x20' },
    { id: 81, name: 'BSMB10010C31Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SOMUN,AKB,FLANSLI(M10x1.5-8.8)' },
    { id: 82, name: 'BSMS05B10Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'FIBERLI SOMUN M5 (DIN 985)' },
    { id: 83, name: 'MA275757Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'KLIPS (15)' },
    { id: 84, name: 'MF140005Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA AKB FLANSLI (M6X0.9X16 4T) K:5.8' },
    { id: 85, name: 'MF140425Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA AKB FLANSLI (M8x1,25x20)  K:8,8' },
    { id: 86, name: 'MF200027Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA AKB FLANSLI (M8x1,25x20)  K:8,8' },
    { id: 87, name: 'MF200050Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA,BOMBE,YILDIZ(A M5x0,8x10-5,6)' },
    { id: 88, name: 'MF200051Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA,BOMBE,YILDIZ(A M5X0,8X12-5,6)' },
    { id: 89, name: 'MF200055Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA,BOMBE,YILDIZ(A M5X0,8X20-5,6)' },
    { id: 90, name: 'MF430004Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SOMUN,AKB (M6x1x5) K:4,8' },
    { id: 91, name: 'MF430005KY', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SOMUN, KİLİTLEMELİ (M8X1,25)   K:8' },
    { id: 92, name: 'MF434103Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'SOMUN,AKB,FLANSLI (M6X1) K:6' },
    { id: 93, name: 'MF450401Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'RONDELA,YAYLI (B 3) (1X3X6,5)' },
    { id: 94, name: 'MH020804Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'KLİPS (12)' },
    { id: 95, name: 'TF100029-AY', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA ALYAN BASLI M6x1x20  K:8.8 '},
    { id: 96, name: 'TF100033-AY', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA,ALYAN(M6x1x40-8,8)' },
    { id: 97, name: 'TF101256Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA ALYAN BASLI (M8x1,25x20-8,8)' },
    { id: 98, name: 'TF133039Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA ALYAN BASLI (M10x1,5x25-8,8)' },
    { id: 99, name: 'TY310128Y', quantity: 1, minStock: 1, location: 'Unknown', definition: 'CIVATA ALYAN BASLI (M6X1X8,5)  K:8.8A' },
];
function calculateProduction(stock: StockItem[]) {
    if (stock.length === 0) return 0;
    // The limiting factor is the minimum ratio of quantity to minStock (rounded down)
    return Math.min(
        ...stock.map(item =>
            item.minStock > 0 ? Math.floor(item.quantity / item.minStock) : Infinity
        )
    );
}

export function ProductionInfo({ stock }: { stock: StockItem[] }) {
    const production = calculateProduction(stock);
    return (
        <div className="mb-6 flex justify-center">
            <div className="bg-green-100 border border-green-300 rounded-lg px-6 py-3 text-lg font-semibold text-green-800 shadow">
                Production possible: <span className="text-2xl">{production}</span> set{production !== 1 ? 's' : ''}
            </div>
        </div>
    );
}

export default function StockManagementPage() {
    const [stock, setStock] = useState<StockItem[]>(initialStock);
    const [search, setSearch] = useState('');
    const [newItem, setNewItem] = useState<Omit<StockItem, 'id'>>({
        name: '',
        quantity: 0,
        minStock: 0,
        location: '',
        definition: '',
    });

    const filteredStock = stock.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddItem = () => {
        if (!newItem.name || newItem.quantity < 0 || newItem.minStock < 0) return;
        setStock([
            ...stock,
            {
                ...newItem,
                id: Date.now(),
            },
        ]);
        setNewItem({ name: '', quantity: 0, minStock: 0, location: '', definition: '' });
    };

    const handleUpdateQuantity = (id: number, delta: number) => {
        setStock(stock =>
            stock.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleDelete = (id: number) => {
        setStock(stock => stock.filter(item => item.id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <h1 className="text-4xl font-extrabold mb-8 text-blue-800 tracking-tight text-center drop-shadow">
                Stock Management
            </h1>
            <ProductionInfo stock={stock} />
            <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-end">
                <input
                    className="border-2 border-blue-200 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="🔍 Search stock..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 bg-white rounded-lg shadow px-4 py-3">
                    <input
                        className="border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        placeholder="Name"
                        value={newItem.name}
                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <input
                        className="border border-gray-200 rounded px-2 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        type="number"
                        min={0}
                        placeholder="Qty"
                        value={newItem.quantity}
                        onChange={e =>
                            setNewItem({ ...newItem, quantity: Number(e.target.value) })
                        }
                    />
                    <input
                        className="border border-gray-200 rounded px-2 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={newItem.minStock}
                        onChange={e =>
                            setNewItem({ ...newItem, minStock: Number(e.target.value) })
                        }
                    />
                    <input
                        className="border border-gray-200 rounded px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        placeholder="Location"
                        value={newItem.location}
                        onChange={e =>
                            setNewItem({ ...newItem, location: e.target.value })
                        }
                    />
                    <input
                        className="border border-gray-200 rounded px-2 py-1 w-40 focus:outline-none focus:ring-1 focus:ring-blue-300"
                        placeholder="Definition"
                        value={newItem.definition}
                        onChange={e =>
                            setNewItem({ ...newItem, definition: e.target.value })
                        }
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                        onClick={handleAddItem}
                    >
                        Add
                    </button>
                </div>
            </div>
            {/* Excel Download Button */}
            <div className="mb-4 flex justify-end">
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
                    onClick={() => {
                        // Prepare CSV content
                        const headers = ['Name', 'Quantity', 'Min Stock', 'Location', 'Definition'];
                        const rows = filteredStock.map(item =>
                            [
                                item.name,
                                item.quantity,
                                item.minStock,
                                item.location,
                                item.definition,
                            ].map(field =>
                                typeof field === 'string' && (field.includes(',') || field.includes('"'))
                                    ? `"${field.replace(/"/g, '""')}"`
                                    : field
                            ).join(',')
                        );
                        const csvContent = [headers.join(','), ...rows].join('\r\n');
                        // Create a blob and trigger download
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'stock-list.csv');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    }}
                >
                    Excel İndir
                </button>
            </div>
            <div className="overflow-x-auto mt-8 rounded-lg shadow">
                <table className="min-w-full bg-white rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 border-b font-semibold text-left">Name</th>
                            <th className="py-3 px-4 border-b font-semibold text-left">Quantity</th>
                            <th className="py-3 px-4 border-b font-semibold text-left">Min Stock</th>
                            <th className="py-3 px-4 border-b font-semibold text-left">Location</th>
                            <th className="py-3 px-4 border-b font-semibold text-left">Definition</th>
                            <th className="py-3 px-4 border-b font-semibold text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStock.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">
                                    No items found.
                                </td>
                            </tr>
                        )}
                        {filteredStock.map(item => (
                            <tr
                                key={item.id}
                                className={
                                    item.quantity <= item.minStock
                                        ? 'bg-red-50 animate-pulse'
                                        : 'hover:bg-blue-50 transition'
                                }
                            >
                                <td className="py-3 px-4 border-b">{item.name}</td>
                                <td className="py-3 px-4 border-b">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="bg-gray-200 px-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
                                            onClick={() => handleUpdateQuantity(item.id, -1)}
                                            disabled={item.quantity === 0}
                                            title="Decrease"
                                        >
                                            –
                                        </button>
                                        <span className="font-mono w-8 text-center">{item.quantity}</span>
                                        <button
                                            className="bg-gray-200 px-2 rounded hover:bg-gray-300 transition"
                                            onClick={() => handleUpdateQuantity(item.id, 1)}
                                            title="Increase"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="py-3 px-4 border-b">
                                    <span className={item.quantity <= item.minStock ? 'text-red-600 font-bold' : ''}>
                                        {item.minStock}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border-b">{item.location}</td>
                                <td className="py-3 px-4 border-b">{item.definition}</td>
                                <td className="py-3 px-4 border-b">
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition shadow"
                                        onClick={() => handleDelete(item.id)}
                                        title="Delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}  
