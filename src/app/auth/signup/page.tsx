// src/app/auth/signup/page.tsx
"use client"; // Karena ini akan jadi form interaktif
 
import React, { useState, FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
 
export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
// Di dalam SignUpPage komponen, fungsi handleSignUp:
const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
 
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      setLoading(false);
      return;
    }
    if (password.length < 6) { // Supabase punya aturan minimal password (default 6)
      setError("Password minimal harus 6 karakter.");
      setLoading(false);
      return;
    }
 
    // Panggil Supabase Auth untuk sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      // Kamu bisa nambahin data tambahan (metadata) di sini kalau mau:
      // options: {
      //   data: {
      //     nama_lengkap: 'Budi Awal', // Ini akan masuk ke user_metadata di Supabase
      //   }
      // }
    });
 
    setLoading(false);
 
    if (signUpError) {
      setError(signUpError.message);
      console.error("Error Sign Up:", signUpError);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // Kasus user sudah ada tapi belum konfirmasi email (jika konfirmasi email diaktifkan)
      // Atau kasus lain di mana user object ada tapi identities kosong
      setMessage("User mungkin sudah terdaftar tapi belum dikonfirmasi. Silakan cek email Anda atau coba login.");
      // Atau setError("Pengguna sudah ada atau butuh konfirmasi.")
    } else if (data.user) {
      // Cek apakah konfirmasi email diperlukan (dari settingan Supabase Auth-mu)
      if (data.user.email_confirmed_at) {
         setMessage("Pendaftaran berhasil! Anda akan diarahkan ke halaman login.");
         setTimeout(() => router.push('/auth/signin'), 2000); // Arahkan ke login setelah 2 detik
      } else {
         setMessage("Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi akun sebelum login.");
      }
    } else if (!data.session && !data.user) {
      // Kasus aneh jika user dan session null tapi tidak ada error eksplisit dari signUpError
      // Seringkali ini karena email sudah terdaftar atau konfigurasi lain
      setError("Email mungkin sudah terdaftar atau ada masalah lain. Coba login atau gunakan email lain.");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Buat Akun Baru</h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required
                   value={email} onChange={(e) => setEmail(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required
                   value={password} onChange={(e) => setPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required
                   value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <div>
            <button type="submit" disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}