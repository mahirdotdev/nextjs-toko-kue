// src/context/cart-context.tsx
"use client"; // Context Provider yang punya state dan useEffect biasanya butuh "use client"
 
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Kue, ItemKeranjang } from '@/types/kue'; // Impor tipe kita
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
 
// Definisikan tipe untuk nilai context
interface CartContextType {
  itemDiKeranjang: ItemKeranjang[];
  tambahKeKeranjang: (kue: Kue) => void;
  hapusDariKeranjang: (idKue: string) => void;
  updateJumlah: (idKue: string, jumlahBaru: number) => void;
  kosongkanKeranjang: () => void;
  totalItem: number;
  totalHarga: number;

  user: User | null;
  session: Session | null;
  isLoadingAuth: boolean; // Buat nandain kalau status auth lagi dicek
  signOut: () => Promise<void>;
}
 
// Bikin Context dengan nilai default undefined (atau objek default)
// Kita kasih '!' karena kita yakin Provider akan ngasih nilai.
const CartContext = createContext<CartContextType>(null!); 
 
// Custom hook biar gampang pake context ini di komponen lain
export function useCart() {
  return useContext(CartContext);
}
 
// Komponen Provider buat ngebungkus aplikasi kita
interface CartProviderProps {
  children: ReactNode;
}
 
export function CartProvider({ children }: CartProviderProps) {

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Awalnya true
  const router = useRouter(); // Jika mau redirect dari sini

  useEffect(() => {
    async function getSessionData() {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoadingAuth(false); // Selesai loading status auth awal
    }
    getSessionData();
 
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state changed:", _event, newSession);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoadingAuth(false); // Selesai loading juga pas ada perubahan
      
      // Contoh: kalau event-nya SIGNED_OUT dan kita lagi di halaman terproteksi, redirect
      // if (_event === 'SIGNED_OUT' && window.location.pathname.startsWith('/checkout')) {
      //    router.push('/auth/signin');
      // }
    });
 
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]); // Tambahkan router jika digunakan di effect

  const signOut = async () => {
    await supabase.auth.signOut();
    // setUser(null); setSession(null); // akan dihandle oleh onAuthStateChange
    router.push('/auth/signin'); // Arahkan setelah logout
  };
  
  const [itemDiKeranjang, setItemDiKeranjang] = useState<ItemKeranjang[]>(() => {
    // Ambil dari localStorage pas awal
    if (typeof window !== "undefined") { // Pastikan localStorage cuma diakses di client-side
      const savedCart = localStorage.getItem('keranjangBelanja');
      try {
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (e) {
        console.error("Gagal parse keranjang dari localStorage", e);
        return [];
      }
    }
    return [];
  });
 
  // Simpen ke localStorage setiap kali itemDiKeranjang berubah
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('keranjangBelanja', JSON.stringify(itemDiKeranjang));
    }
  }, [itemDiKeranjang]);
 
  const tambahKeKeranjang = (kueDiterima: Kue) => {
    setItemDiKeranjang(prevItems => {
      const itemSudahAda = prevItems.find(item => item.id === kueDiterima.id);
      if (itemSudahAda) {
        // Kalau udah ada, tambah jumlahnya
        return prevItems.map(item =>
          item.id === kueDiterima.id ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      } else {
        // Kalau belum ada, tambahin item baru dengan jumlah 1
        return [...prevItems, { ...kueDiterima, jumlah: 1 }];
      }
    });
  };
 
  const hapusDariKeranjang = (idKue: string) => {
    setItemDiKeranjang(prevItems => prevItems.filter(item => item.id !== idKue));
  };
 
  const updateJumlah = (idKue: string, jumlahBaru: number) => {
    if (jumlahBaru <= 0) { // Kalau jumlah baru 0 atau kurang, hapus aja itemnya
      hapusDariKeranjang(idKue);
    } else {
      setItemDiKeranjang(prevItems =>
        prevItems.map(item =>
          item.id === idKue ? { ...item, jumlah: jumlahBaru } : item
        )
      );
    }
  };
  
  const kosongkanKeranjang = () => {
    setItemDiKeranjang([]);
  };
 
  const totalItem = itemDiKeranjang.reduce((total, item) => total + item.jumlah, 0);
  const totalHarga = itemDiKeranjang.reduce((total, item) => total + (item.harga * item.jumlah), 0);
 
  const contextValue = {
    itemDiKeranjang,
    tambahKeKeranjang,
    hapusDariKeranjang,
    updateJumlah,
    kosongkanKeranjang,
    totalItem,
    totalHarga,
    user,
    session,
    isLoadingAuth,
    signOut
  };
 
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}