// src/app/api/kue/route.ts (Versi Pake Prisma Client ke Supabase)
// import { prisma } from '@/lib/prisma-client';
import prisma from '@/lib/prisma-client';

 
export async function GET() {
  try {
    const semuaKue = await prisma.kue.findMany({ // Pake metode Prisma!
      orderBy: {
        created_at: 'desc', // Urut dari terbaru
      },
    });
    return Response.json(semuaKue)
    //return NextResponse.json({ posts, totalPages });
  } catch (error) {
    console.error("Error ambil semua kue via Prisma:", error);
    return Response.json({ message: "Gagal mengambil data kue." }, { status: 500 });
  }
}
 
// Fungsi POST, PUT, DELETE juga bisa diubah pake metode Prisma Client
// misalnya prisma.kue.create(), prisma.kue.update(), prisma.kue.delete()