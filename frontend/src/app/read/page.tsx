'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

// Kita butuh wrapper biar gak error di Next.js saat build
function ReadMessageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  // Kalau gak ada token, tendang balik ke home
  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const handleOpenMessage = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:3000/messages/read?token=${token}`, {
        method: 'GET', // Ingat, backend kita pakai method GET
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal membuka pesan.');
      }

      setMessage(data.message);
      setIsOpened(true);
    } catch (err: any) {
      setError(err.message || 'Link ini sudah kadaluwarsa atau pesannya sudah hancur.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="max-w-md w-full text-center space-y-6">
      {!isOpened ? (
        // --- TAMPILAN SEBELUM DIBUKA ---
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">Pesan Rahasia</h1>
          <p className="text-gray-400 mb-6">
            Seseorang mengirimimu pesan rahasia.
            <br />
            <span className="text-yellow-500 text-sm">
              ⚠️ Peringatan: Pesan ini akan hancur otomatis setelah dibaca.
            </span>
          </p>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleOpenMessage}
            disabled={loading}
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20"
          >
            {loading ? 'Mendekripsi...' : 'BACA PESAN SEKARANG'}
          </button>
        </div>
      ) : (
        // --- TAMPILAN SETELAH DIBUKA ---
        <div className="bg-gray-900 border-2 border-green-500 p-6 rounded-xl relative overflow-hidden">
          {/* Efek scanline ala hacker */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

          <div className="relative z-20">
            <h2 className="text-green-500 font-mono text-sm mb-4 border-b border-green-800 pb-2 uppercase tracking-widest">
              Decrypted Content
            </h2>

            <p className="text-white text-lg font-mono whitespace-pre-wrap break-words leading-relaxed">
              {message}
            </p>

            <div className="mt-8 pt-4 border-t border-gray-800">
              <p className="text-red-500 text-xs font-bold uppercase animate-pulse">
                🚫 Pesan ini telah dihapus dari server selamanya.
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 text-gray-500 hover:text-white text-sm underline"
              >
                Buat Pesan Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page Component
export default function ReadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      {/* Suspense wajib ada kalau pakai useSearchParams di Next.js App Router */}
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ReadMessageContent />
      </Suspense>
    </main>);
}
