// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '@/generated/client';
import { v4 as uuidv4 } from 'uuid';

import * as fs from 'fs';
import * as path from 'path';

type KueProps = { 
    id: string;
    nama: string;
    deskripsi_singkat: string;
    deskripsi_lengkap: string;
    harga: number;
    gambar_url: string;
    kategori?: string;
    rating?: number;
    bahan_utama?: string[];
  }

const prisma = new PrismaClient();

async function main() {
  console.log(`Mulai proses seeding ...`);

  const filePath = path.join(__dirname, '../src/data/daftar-kue.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const daftarKue: KueProps[] = JSON.parse(jsonData);

  for (const kue of daftarKue) {
    // Untuk contoh ini, kita asumsikan kategori adalah string di JSON dan Decimal di Prisma.
    // Jika kategori di Prisma adalah String, maka tidak perlu konversi parseFloat.
    // Berdasarkan schema.prisma yang dilihat, 'kategori' adalah Decimal.
    // Namun, data JSON memiliki kategori sebagai string seperti "Cake", "Roti".
    // Ini berarti kita perlu strategi untuk mengubah string ini menjadi Decimal.
    // Logika saat ini mencoba parseFloat, yang akan menghasilkan NaN untuk string non-numerik.
    // Anda mungkin perlu menambahkan model Kategori dan menghubungkannya, atau memetakan nama kategori ke nilai numerik.
    // Untuk saat ini, jika parseFloat menghasilkan NaN, akan disetel ke null.
const value:KueProps = {
    ...kue,
    id: uuidv4(),
    nama: kue.nama,
    deskripsi_singkat: kue.deskripsi_singkat,
    deskripsi_lengkap: kue.deskripsi_lengkap,
    harga: kue.harga,
    gambar_url: kue.gambar_url,
    // kategori: kue.kategori ? kue.kategori || undefined : undefined, // Ini asumsi sederhana, mungkin perlu penyesuaian
    rating: kue.rating,
    bahan_utama: kue.bahan_utama || [],

  }
    const createdKue = await prisma.kue.create({
      data: value,
    });
    console.log(`Kue berhasil ditambahkan: ${createdKue.nama} (ID: ${createdKue.id})`);
  }

  console.log(`Proses seeding selesai.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });