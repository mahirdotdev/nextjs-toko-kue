// src/types/kue.ts
export interface Kue {
    id: string; // Kita pake string buat ID biar bisa lebih fleksibel (misal, 'kue-coklat-01')
    nama: string;
    deskripsiSingkat: string;
    deskripsiLengkap: string;
    harga: number;
    gambarUrl: string; // Path ke gambar kue
    kategori: string; // Misal: 'Cake', 'Roti', 'Cookies'
    rating?: number; // Opsional, dari 1-5
    bahanUtama?: string[]; // Opsional, array of string
  }


  export interface ItemKeranjang extends Kue {
    jumlah: number;
  }