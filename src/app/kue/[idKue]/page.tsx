// src/app/kue/[idKue]/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Kue } from '@/types/kue'; // Impor tipe Kue
import TombolTambahKeranjang from '@/components/tombol-tambah-keranjang';
// import tombol-tambah-keranjang from '@/components/tombol-tambah-keranjang'; // Akan kita buat nanti
 
// Tipe untuk props yang diterima halaman ini (termasuk params dinamis)
interface DetailKuePageProps {
  params: {
    idKue: string; // 'idKue' harus sama dengan nama folder dinamis '[idKue]'
  };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Jika butuh query params
}
 
// Fungsi untuk mengambil data satu kue berdasarkan ID dari API Route kita
// Ini adalah Server Component, jadi bisa langsung async/await fetch!
async function getDetailKue(id: string): Promise<Kue | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/kue/${id}`, {
    cache: 'force-cache' // Atau 'no-store', atau atur di segment config
  });
 
  if (!response.ok) {
    // Kalau 404 (gak ketemu) atau error lain, kita bisa return null atau throw error
    // Untuk contoh ini, kita return null biar bisa ditangani di komponen Page
    if (response.status === 404) {
      return null; 
    }
    // Untuk error lain, mungkin lebih baik throw error
    // throw new Error(`Gagal mengambil data kue ID: ${id}`);
    console.error("Gagal mengambil detail kue:", response.status, response.statusText);
    return null;
  }
  return response.json();
}
 
// Komponen Page untuk halaman detail kue
// Ingat, di Next.js 15+, akses ke params di Server Component bisa jadi Promise
// Untuk konsistensi dengan contoh sebelumnya, kita buat fungsi async dan await params
export default async function HalamanDetailKue({ params }: DetailKuePageProps) {
  // Di Next.js 15+, jika `params` adalah Promise, Anda perlu `await`
  // const resolvedParams = await params; // Baris ini mungkin tidak perlu jika params sudah di-resolve oleh Next.js
  // const idKue = resolvedParams.idKue; 
  // Namun, seringkali Next.js sudah otomatis me-resolve-nya untuk Server Component dasar.
  // Kita akan coba akses langsung, jika error, baru di-await.
  // Untuk contoh yang lebih robust dengan typing Promise di props:
  // async function HalamanDetailKue({ params: paramsPromise }: { params: Promise<{ idKue: string }> }) {
  //   const params = await paramsPromise;
  //   const idKue = params.idKue;
  
  const idKue = params.idKue; // Langsung akses dari props.params
  const kue = await getDetailKue(idKue);
 
  if (!kue) {
    // Bisa juga pake fungsi notFound() dari next/navigation buat nampilin halaman not-found.tsx standar
    // import { notFound } from 'next/navigation';
    // notFound(); 
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">Kue Tidak Ditemukan!</h1>
        <p className="mt-4">Maaf, kue dengan ID &quot;{idKue}&quot; tidak dapat kami temukan.</p>
        <Link href="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          Kembali ke Daftar Kue
        </Link>
      </div>
    );
  }
 
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Kembali ke Semua Kue
      </Link>
      <article className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        <div className="md:w-1/2 relative h-64 md:h-auto"> {/* Butuh tinggi untuk 'fill' atau set rasio aspek */}
          <Image
            src={kue.gambarUrl}
            alt={kue.nama}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority // Penting untuk gambar utama di atas lipatan (Above The Fold)
          />
        </div>
        <div className="md:w-1/2 p-6 md:p-8 space-y-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {kue.nama}
          </h1>
          <p className="text-sm text-gray-500 mb-4">Kategori: {kue.kategori}</p>
          
          <p className="text-2xl font-semibold text-pink-600 mb-6">
            Rp {kue.harga.toLocaleString('id-ID')}
          </p>
 
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Deskripsi Lengkap:</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {kue.deskripsiLengkap}
          </p>
 
          {kue.bahanUtama && kue.bahanUtama.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Bahan Utama:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {kue.bahanUtama.map((bahan, index) => (
                  <li key={index}>{bahan}</li>
                ))}
              </ul>
            </div>
          )}
 
          {kue.rating && (
            <p className="text-yellow-500 font-semibold mb-6">
              Rating: {'⭐'.repeat(Math.floor(kue.rating))} ({kue.rating.toFixed(1)})
            </p>
          )}
          
          {/* Tombol Tambah ke Keranjang akan kita buat sebagai Client Component nanti */}
          {/* <button 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
            Tambah ke Keranjang
          </button> */}
          <TombolTambahKeranjang kue={kue} />
          {/* <TombolTambahKeranjang kue={kue} /> */}
        </div>
      </article>
    </div>
  );
}