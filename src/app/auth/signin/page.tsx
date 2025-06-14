// src/app/auth/signin/page.tsx
"use client";
 
import React, { useState, FormEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
 
export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
 
 // Di dalam SignInPage komponen, fungsi handleSignIn:
 const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
 
    // Panggil Supabase Auth untuk sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
 
    setLoading(false);
 
    if (signInError) {
      setError(signInError.message);
      console.error("Error Sign In:", signInError);
    } else if (data.user) {
      // Login berhasil!
      // 'data.session' juga bakal ada di sini
      console.log("Login berhasil:", data.user);
      // Arahkan ke halaman utama atau dashboard setelah login
      router.push('/'); // Ganti dengan path halaman setelah login yang sesuai
      // Kamu mungkin juga mau nge-refresh halaman atau data di app setelah ini
    } else {
        setError("Login gagal. Cek kembali email dan password Anda.");
    }
  };
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Masuk ke Akun Anda</h2>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required
                   value={email} onChange={(e) => setEmail(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required
                   value={password} onChange={(e) => setPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button type="submit" disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Daftar di sini
          </Link>
        </p>
        {/* Opsional: Link Lupa Password */}
      </div>
    </div>
  );
}