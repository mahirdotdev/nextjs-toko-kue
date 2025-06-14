// src/types/kue.ts
export interface Kue {
  id: string; // Akan jadi Primary Key, mungkin tipe UUID di database
  nama: string;
  deskripsiSingkat: string;
  deskripsiLengkap: string;
  harga: number;
  gambarUrl: string;
  kategori: string; 
  rating?: number;    // Opsional
  bahanUtama?: string[]; // Opsional, mungkin array teks atau relasi ke tabel lain
  createdAt?: Date;   // Otomatis diisi
  updatedAt?: Date;   // Otomatis diupdate
}

  export interface ItemKeranjang extends Kue {
    jumlah: number;
  }