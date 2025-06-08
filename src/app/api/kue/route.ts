// src/app/api/kue/route.ts
import { NextResponse } from 'next/server';
import kueLengkap from '@/data/daftar-kue.json'; // Impor data dummy kita
// Pastikan path ke daftar-kue.json sudah benar. 
// Jika kue.ts (interface) dan daftar-kue.json ada di src/data/
// dan API route ini ada di src/app/api/kue/, maka pathnya bisa jadi:
// import kueLengkap from '../../../../data/daftar-kue.json'; 
// Atau, jika kamu setup path alias di tsconfig.json (misal '@/' ke 'src/'), 
// bisa jadi lebih rapi: import kueLengkap from '@/data/daftar-kue.json';
// Untuk contoh ini, saya asumsikan kamu sudah setup alias `@/` ke `src/` di tsconfig.json
// atau kamu sesuaikan path impornya.
 
// Impor tipe Kue jika perlu untuk validasi atau anotasi (opsional di sini)
// import { Kue } from '@/types/kue'; 
 
export const dynamic = 'force-static'; 


export async function GET(request: Request) {
  // Di sini kita gak perlu ngapa-ngapain request-nya karena mau ngambil semua
  
  // Langsung kembalikan semua data kue sebagai JSON
  // Kita bisa asumsikan kueLengkap sudah sesuai tipe Kue[] jika diimpor dari file .ts
  // atau kita bisa lakukan validasi sederhana jika ini dari sumber eksternal.
  // Untuk data dummy JSON, kita langsung kirim.
  return NextResponse.json(kueLengkap);
}
 
// Kamu juga bisa nambahin handler buat method lain (POST, dll.) di sini kalau perlu
// export async function POST(request: Request) { ... }
