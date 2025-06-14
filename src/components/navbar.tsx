// src/app/components/Navbar.tsx (Contoh)
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
 
export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
 
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    checkUser();
 
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
 
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
 
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    else router.push('/auth/signin'); // Arahkan ke halaman login setelah logout
  };
 
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">Toko Kue</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Halo, {user.email}</span>
            <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/signin" className="mr-3 hover:underline">Masuk</Link>
            <Link href="/auth/signup" className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded">Daftar</Link>
          </>
        )}
      </div>
    </nav>
  );
}