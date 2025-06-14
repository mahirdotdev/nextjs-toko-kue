// src/app/checkout/page.tsx
"use client"; // Karena kita akan menggunakan form dan state
 
import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Untuk navigasi programatik
import { useCart } from '@/context/cart-context'; // Untuk akses keranjang & kosongkan
 
export default function HalamanCheckout() {
  const router = useRouter();
  const { itemDiKeranjang, totalHarga, kosongkanKeranjang, user, session, isLoadingAuth } = useCart(); 
 
  // State untuk field form
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [catatan, setCatatan] = useState('');


  // Efek buat ngecek status login
  useEffect(() => {
    // Jangan redirect kalau status auth masih loading atau kalau sudah ada sesi
    if (!isLoadingAuth && !session) {
      router.push('/auth/signin?redirect=/checkout'); // Arahkan ke login, simpan halaman tujuan
    }
  }, [user, session, isLoadingAuth, router]); // Dependensi: user, session, isLoadingAuth, router
 
  const handleSubmitCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Cegah reload halaman
 
    // Validasi sederhana (bisa lebih kompleks di aplikasi nyata)
    if (!nama || !email || !alamat || !telepon) {
      alert("Mohon isi semua field yang wajib diisi (Nama, Email, Alamat, Telepon).");
      return;
    }
 
    // Di aplikasi nyata, di sini kamu akan mengirim data ini ke backend
    // untuk diproses (misalnya, rekam pesanan, proses pembayaran).
    console.log("Data Checkout yang Dikirim (pura-puranya):", {
      nama, email, alamat, telepon, catatan,
      itemDipesan: itemDiKeranjang,
      totalBayar: totalHarga
    });
 
    alert(`Terima kasih, ${nama}! Pesanan Anda senilai Rp ${totalHarga.toLocaleString('id-ID')} sedang diproses.`);
    
    kosongkanKeranjang(); // Kosongkan keranjang setelah checkout
    router.push('/terima-kasih'); // Arahkan ke halaman terima kasih
  };
 
  if (itemDiKeranjang.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Keranjang Anda Kosong</h1>
        <p className="mb-6">Anda tidak bisa checkout jika keranjang masih kosong.</p>
        <Link href="/" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg">
          Kembali Belanja
        </Link>
      </div>
    );
  }
 
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Formulir Checkout</h1>
      <form onSubmit={handleSubmitCheckout} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
          <input type="text" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required 
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" />
        </div>
 
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Alamat Email <span className="text-red-500">*</span></label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" />
        </div>
 
        <div className="mb-6">
          <label htmlFor="alamat" className="block text-gray-700 text-sm font-bold mb-2">Alamat Pengiriman <span className="text-red-500">*</span></label>
          <textarea id="alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} required rows={3}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"></textarea>
        </div>
 
        <div className="mb-4">
          <label htmlFor="telepon" className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon <span className="text-red-500">*</span></label>
          <input type="tel" id="telepon" value={telepon} onChange={(e) => setTelepon(e.target.value)} required
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" />
        </div>
        
        <div className="mb-6">
          <label htmlFor="catatan" className="block text-gray-700 text-sm font-bold mb-2">Catatan Tambahan (Opsional)</label>
          <textarea id="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"></textarea>
        </div>
 
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold text-lg mb-2">Ringkasan Pesanan</h3>
          {itemDiKeranjang.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.nama} x {item.jumlah}</span>
              <span>Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
            </div>
          ))}
          <hr className="my-2"/>
          <div className="flex justify-between font-bold text-md">
            <span>Total Bayar:</span>
            <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
          </div>
        </div>
 
        <div className="flex items-center justify-between">
          <button type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors">
            Proses Pesanan
          </button>
          <Link href="/keranjang" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Kembali ke Keranjang
          </Link>
        </div>
      </form>
    </div>
  );
}