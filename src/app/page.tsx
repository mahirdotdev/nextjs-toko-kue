// src/app/page.tsx

import React from "react";
import Link from "next/link";
import { Kue } from "@/types/kue"; // Impor tipe Kue
import KartuKue from "@/components/kartu-kue"; // Impor komponen KartuKue

async function getDaftarKue(): Promise<Kue[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/kue`, {
    cache: "force-cache", // Atau 'no-store' jika mau selalu data baru.
  });

  if (!response.ok) {
    console.error(
      "Gagal mengambil data kue:",
      response.status,
      response.statusText
    );

    // throw new Error('Gagal mengambil data produk kue');

    return []; // Kembalikan array kosong jika gagal
  }

  return response.json(); // Otomatis di-parse jadi array objek Kue (jika API-nya bener)
}

export default async function HalamanUtama() {
  const daftarKue = await getDaftarKue();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8 text-pink-700">
        Selamat Datang di Toko Kue Mahir.dev!
      </h1>

      {daftarKue.length === 0 ? (
        <p className="text-center text-gray-500">
          Ups, sepertinya belum ada kue yang dijual saat ini. Coba lagi nanti
          ya!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {daftarKue.map((kue) => (
            <KartuKue key={kue.id} kue={kue} />
          ))}
        </div>
      )}

      {/* Contoh link ke halaman lain (misal, keranjang) */}

      <div className="text-center mt-10">
        <Link
          href="/keranjang"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Lihat Keranjang Saya
        </Link>
      </div>
    </div>
  );
}
