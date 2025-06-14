// src/app/produk/page.tsx (Server Component, tidak perlu "use client")
import { supabase } from '@/lib/supabase-client'; // Impor client kita
import { Kue } from '@/types/kue';
// import { Kue } from '@/data/kue'; // Asumsi tipe Kue sudah ada
 
async function getProdukKue():Promise<Kue[]> {
  // Untuk Server Component, idealnya Anda membuat instance Supabase client 
  // yang bisa menggunakan service_role key jika diperlukan untuk bypass RLS,
  // atau menggunakan helper Supabase untuk SSR.
  // Namun, untuk GET data publik yang RLS-nya sudah diatur, anon key juga bisa.
  const { data, error } = await supabase
    .from('kue') // Nama tabel kue Anda
    .select('*')
    .order('created_at', { ascending: false });
 
  if (error) {
    console.error("Error ambil produk kue:", error);
    return [];
  }
  return data || []; // Kembalikan data atau array kosong
}
 
export default async function HalamanProduk() {
  const daftarProduk = await getProdukKue();
 
  return (
    <div>
      <h1>Daftar Produk Kue</h1>
      <ul>
        {daftarProduk.map((produk) => ( // Ganti 'any' dengan tipe Kue
          <li key={produk.id}>{produk.nama} - Rp {produk.harga}</li>
        ))}
      </ul>
    </div>
  );
}