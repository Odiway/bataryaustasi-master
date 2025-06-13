"use client";

import { useEffect, useState } from "react";

interface Article {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: { name: string };
}

export default function TechnologyNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError("Haberler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return <p className="p-6 text-center">Haberler yükleniyor...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Teknoloji ve Üretim Haberleri</h1>
      <ul className="space-y-6">
        {articles.map((article, idx) => (
          <li
            key={idx}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {article.title}
            </a>
            <p className="mt-2 text-gray-700">
              {article.description || "Açıklama yok."}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString()} -{" "}
              {article.source.name}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
