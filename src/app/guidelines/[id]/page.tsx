type Params = {
    params: {
        id: string
    }
}

const guides: Record<string, { title: string; content: string; pdfUrl?: string }> = {
    guide1: {
        title: 'Lityum Batarya Montajı',
        content: 'Bu, Lityum Batarya Montajı rehberidir.',
        pdfUrl: '/Batarya.pdf',
    },
    guide2: {
        title: 'Batarya Tamir Teknikleri',
        content: 'Bu, Batarya Tamir Teknikleri rehberidir.',
        pdfUrl: '/pdfs/batarya-tamir-teknikleri.pdf',
    },
    guide3: {
        title: 'Güvenlik ve Koruma Protokolleri',
        content: 'Bu, Güvenlik ve Koruma Protokolleri rehberidir.',
        pdfUrl: '/pdfs/guvenlik-ve-koruma-protokolleri.pdf',
    },
}

export default function GuideDetailPage({ params }: Params) {
    const guide = guides[params.id]

    if (!guide) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-red-50 to-white">
                <div className="bg-white border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-lg max-w-lg w-full flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6m0-6l-6 6" />
                    </svg>
                    <h2 className="text-xl font-bold mb-2">Kılavuz bulunamadı</h2>
                    <p className="text-center">Aradığınız kılavuz mevcut değil veya kaldırılmış olabilir.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
            <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-2xl w-full border border-gray-100 flex flex-col items-center">
                <div className="mb-6 flex items-center gap-3">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" />
                    </svg>
                    <h1 className="text-3xl font-extrabold text-blue-700">{guide.title}</h1>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed text-center">{guide.content}</p>
                {guide.pdfUrl && (
                    <a
                        href={guide.pdfUrl}
                        target="_blank"
                        download
                        rel="noopener noreferrer"
                        className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors"
                    >
                        PDF'yi İndir
                    </a>
                )}
            </div>
        </div>
    )
}
