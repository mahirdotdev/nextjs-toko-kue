// src/app/contoh-pengguna/page.tsx
"use client"; 
 
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client'; // Impor client kita
 
interface UserProfile { // Contoh interface
  id: string;
  username: string;
  // ... properti lain
}
 
export default function HalamanProfilPengguna() {
  const [profil, setProfil] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function ambilProfil() {
      // Asumsi ada tabel 'profiles' dan user sudah login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles') // Nama tabel profil Anda
          .select('*')
          .eq('id', user.id) // Ambil profil berdasarkan ID user yang login
          .single();
 
        if (error) console.error("Error ambil profil:", error);
        else setProfil(data as UserProfile);
      }
      setLoading(false);
    }
    ambilProfil();
  }, []);
 
  if (loading) return <p>Memuat profil...</p>;
  if (!profil) return <p>Profil tidak ditemukan atau Anda belum login.</p>;
 
  return <div><h1>Profil {profil.username}</h1>{/* ...tampilkan detail profil... */}</div>;
}