'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [ghostLink, setGhostLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim ke backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });

      const data = await res.json();
      setGhostLink(data.ghostlink); // Ambil link dari response backend
    } catch (err) {
      alert('Gagal membuat pesan hantu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-blue-500">
          👻 GhostLink
        </h1>
        <p className="text-gray-400">
          Kirim pesan rahasia yang akan hancur otomatis setelah dibaca.
        </p>

        {!ghostLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none h-40"
              placeholder="Tulis rahasiamu di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition disabled:opacity-50"
            >
              {loading ? 'Mengunci Pesan...' : 'Buat Link Rahasia 🔒'}
            </button>
          </form>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg border border-green-500 animate-pulse">
            <h2 className="text-xl font-bold text-green-400 mb-2">Link Siap!</h2>
            <p className="text-sm text-gray-400 mb-4">
              Link ini hanya bisa dibuka SATU KALI.
            </p>
            <div className="bg-black p-3 rounded mb-4 break-all text-xs font-mono text-gray-300">
              {ghostLink}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(ghostLink);
                alert('Copied!');
              }}
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-bold"
            >
              Copy Link 📋
            </button>
            <button
              onClick={() => {
                setGhostLink('');
                setMessage('');
              }}
              className="mt-4 text-sm text-gray-500 hover:text-white"
            >
              Kirim Pesan Lain
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
