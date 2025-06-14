'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const guides = [
    { id: 'guide1', title: 'Lityum Batarya Montajı' },
    { id: 'guide2', title: 'Batarya Tamir Teknikleri' },
    { id: 'guide3', title: 'Güvenlik ve Koruma Protokolleri' },
    { id: 'guide4', title: 'Batarya Test Yöntemleri' },
    { id: 'guide5', title: 'Enerji Depolama Sistemleri' },
    { id: 'guide6', title: 'Batarya Bakım İpuçları' },
    { id: 'guide7', title: 'Şarj ve Deşarj Prosedürleri' },
    { id: 'guide8', title: 'Batarya Geri Dönüşümü' },
]

export default function GuideListPage() {
    const router = useRouter()
    const [search, setSearch] = useState('')

    const handleClick = (id: string) => {
        router.push(`/guidelines/${id}`)
    }

    const filteredGuides = guides.filter(guide =>
        guide.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center drop-shadow">
                    Batarya Kılavuzları
                </h1>
                <div className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Kılavuz ara..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={() => setSearch('')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                        Temizle
                    </button>
                </div>
                <div className="space-y-4">
                    {filteredGuides.length === 0 ? (
                        <div className="text-center text-gray-500">Kılavuz bulunamadı.</div>
                    ) : (
                        filteredGuides.map(guide => (
                            <button
                                key={guide.id}
                                onClick={() => handleClick(guide.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg"
                            >
                                {guide.title}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
