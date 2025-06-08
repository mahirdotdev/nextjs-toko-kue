// src/app/api/kue/[id]/route.ts
import { NextResponse } from 'next/server';
import kueLengkap from '@/data/daftar-kue.json'; 
import { Kue } from '@/types/kue';
 
interface RouteParams {
  params: {
    id: string; // Nama parameter 'id' harus sama kayak nama folder dinamis '[id]'
  }
}
 
export async function GET(request: Request, { params }: RouteParams) {
  // Ingat, di Next.js 15+, akses ke params di Route Handlers juga bisa jadi asynchronous
  // jika Next.js mendeteksinya sebagai 'dynamic' (tergantung bagaimana ia dipanggil atau dikonfigurasi).
  // Namun, untuk Route Handlers, parameter kedua biasanya langsung berisi objek params yang sudah di-resolve.
  // Kita akan asumsikan `params` sudah di-resolve di sini untuk kesederhanaan contoh dasar.
  // Jika ada warning atau error terkait Promise, kita bisa `await params;`
  
  const kueId = params.id; // Ambil ID kue dari parameter URL
 
  const kueDitemukan = (kueLengkap as Kue[]).find(kue => kue.id === kueId);
 
  if (kueDitemukan) {
    return NextResponse.json(kueDitemukan);
  } else {
    // Kalau kue gak ditemuin, kasih response 404 Not Found
    return NextResponse.json({ message: `Kue dengan ID "${kueId}" tidak ditemukan.` }, { status: 404 });
  }
}