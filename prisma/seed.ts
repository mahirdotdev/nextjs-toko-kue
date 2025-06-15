import { PrismaClient } from '@/generated/client';
import * as fs from 'fs';
import * as path from 'path';

type KueInput = {
  id: string; // This ID from JSON might be used for other purposes, but Prisma will generate its own UUID.
  nama: string;
  deskripsi_singkat: string;
  deskripsi_lengkap: string;
  harga: number;
  gambar_url: string;
  kategori?: string | null;
  rating?: number;
  bahan_utama?: string[];
};

const prisma = new PrismaClient();

async function main() {
  console.log(`Mulai proses seeding ...`);

  const filePath = path.join(__dirname, '../src/data/daftar-kue.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const daftarKue: KueInput[] = JSON.parse(jsonData);

  for (const kueData of daftarKue) {
    try {
      const createdKue = await prisma.kue.create({
        data: {
          // Prisma will auto-generate the 'id' if not provided or if the provided one doesn't match UUID format for the DB.
          // We will let Prisma handle the ID generation by not passing kueData.id
          // id: uuidv4(), // Let Prisma handle this if it's a UUID in the DB
          nama: kueData.nama,
          deskripsi_singkat: kueData.deskripsi_singkat,
          deskripsi_lengkap: kueData.deskripsi_lengkap,
          harga: kueData.harga, // Prisma's Decimal type can accept number
          gambar_url: kueData.gambar_url,
          kategori: kueData.kategori, // Now a String type in schema, direct assignment
          rating: kueData.rating, // Prisma's Decimal type can accept number
          bahan_utama: kueData.bahan_utama || [],
          // created_at and updated_at will be handled by @default(now())
        },
      });
      console.log(`Kue berhasil ditambahkan: ${createdKue.nama} (ID: ${createdKue.id})`);
    } catch (error) {
      console.error(`Gagal menambahkan kue ${kueData.nama}:`, error);
    }
  }

  console.log(`Proses seeding selesai.`);
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });