// src/app/terima-kasih/page.tsx
import React from 'react';
import Link from 'next/link';
 
export default function HalamanTerimaKasih() {
  return (
    <div className="container mx-auto p-4 md:p-8 text-center min-h-[60vh] flex flex-col justify-center items-center">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-md shadow-lg max-w-md">
        <h1 className="text-3xl font-bold mb-4">Pesanan Diterima! 🎉</h1>
        <p className="text-lg mb-2">Terima kasih telah berbelanja di Toko Kue Mahir.dev!</p>
        <p className="mb-6">Kami (pura-puranya) akan segera memproses pesanan Anda.</p>
      </div>
      <Link href="/" className="mt-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Kembali ke Beranda
      </Link>
    </div>
  );
}