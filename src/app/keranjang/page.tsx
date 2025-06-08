// src/app/keranjang/page.tsx
"use client"; // Karena butuh akses context dan interaksi
 
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
 
export default function HalamanKeranjang() {
  const { itemDiKeranjang, updateJumlah, hapusDariKeranjang, totalItem, totalHarga } = useCart();
 
  if (itemDiKeranjang.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Keranjang Belanjamu Kosong</h1>
        <p className="mb-6">Yuk, pilih kue-kue enak di toko kami!</p>
        <Link href="/" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg">
          Mulai Belanja
        </Link>
      </div>
    );
  }
 
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Keranjang Belanja ({totalItem} item)</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {itemDiKeranjang.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-4">
            <div className="flex items-center">
              <div className="relative w-20 h-20 mr-4 rounded overflow-hidden">
                <Image src={item.gambarUrl} alt={item.nama} fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{item.nama}</h2>
                <p className="text-sm text-gray-500">Rp {item.harga.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <input 
                type="number" 
                value={item.jumlah}
                onChange={(e) => updateJumlah(item.id, parseInt(e.target.value) || 0)}
                min="0" // Bisa juga min="1" kalau mau hapus otomatis pas 0
                className="w-16 text-center border border-gray-300 rounded-md p-1 mx-2"
              />
              <button 
                onClick={() => hapusDariKeranjang(item.id)}
                className="text-red-500 hover:text-red-700 font-semibold text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-gray-800">Total Harga:</p>
            <p className="text-xl font-bold text-pink-600">
              Rp {totalHarga.toLocaleString('id-ID')}
            </p>
          </div>
          <Link href="/checkout" className="mt-6 w-full block text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Lanjut ke Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}