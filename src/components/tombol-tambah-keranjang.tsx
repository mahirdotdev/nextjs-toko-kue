"use client"; // Karena dia manggil fungsi dari context dan berinteraksi
 
import React from 'react';
import { useCart } from '@/context/cart-context';
import { Kue } from '@/types/kue';
 
interface TombolTambahKeranjangProps {
  kue: Kue; // Nerima objek kue yang mau ditambah
}
 
export default function TombolTambahKeranjang({ kue }: TombolTambahKeranjangProps) {
  const { tambahKeKeranjang, itemDiKeranjang } = useCart();
 
  const itemSudahDiKeranjang = itemDiKeranjang.find(item => item.id === kue.id);
  const jumlahDiKeranjang = itemSudahDiKeranjang ? itemSudahDiKeranjang.jumlah : 0;
 
  return (
    <button
      onClick={() => tambahKeKeranjang(kue)}
      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
    >
      Tambah ke Keranjang 
      {jumlahDiKeranjang > 0 && ` (${jumlahDiKeranjang})`}
    </button>
  );
}