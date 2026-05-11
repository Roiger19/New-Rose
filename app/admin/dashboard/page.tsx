"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import AddProductForm from "./AddProduct"; 

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrls: string[];
  category: string; // <-- Nueva propiedad
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/admin");
  }, [user, loading, router]);

  const getInventory = async () => {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Mantenemos la compatibilidad con productos viejos sin categoría
          category: data.category || "Sin categoría",
          imageUrls: data.imageUrls || [data.imageUrl || ""]
        };
      }) as Product[];
      setProducts(productList);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`¿Eliminar "${title}"?`)) {
      await deleteDoc(doc(db, "products", id));
      getInventory();
    }
  };

  useEffect(() => { if (user) getInventory(); }, [user]);

  if (loading || isFetching) return <div className="p-20 text-center text-[#8B6F7F]">Cargando Panel...</div>;

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-28 px-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-12 border-b border-[#D4BFC8]/30 pb-8">
          <h1 className="text-4xl font-display text-[#2D1F2B] italic">Panel Rose Vault</h1>
          <button 
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="bg-gradient-to-r from-[#E8799A] to-[#C05677] text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105"
          >
            + Nuevo Producto
          </button>
        </header>

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md">
              <button onClick={() => setShowForm(false)} className="absolute -top-12 right-0 text-white text-xl">Cerrar ✕</button>
              <AddProductForm 
                productToEdit={editingProduct}
                onSuccess={() => { setShowForm(false); getInventory(); }} 
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-[#D4BFC8]/20">
          <table className="w-full text-left">
            <thead className="bg-[#FDF2F5]/50 border-b border-[#D4BFC8]/20 text-[#8B6F7F]">
              <tr>
                <th className="p-6 uppercase text-xs font-bold tracking-widest">Prenda</th>
                <th className="p-6 uppercase text-xs font-bold tracking-widest">Nombre</th>
                <th className="p-6 uppercase text-xs font-bold tracking-widest">Categoría</th>
                <th className="p-6 uppercase text-xs font-bold tracking-widest">Precio</th>
                <th className="p-6 uppercase text-xs font-bold tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4BFC8]/10 text-[#2D1F2B]">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-[#FDF2F5]/30 transition-colors">
                  <td className="p-6"><img src={item.imageUrls[0]} className="h-16 w-16 rounded-2xl object-cover shadow-sm" /></td>
                  <td className="p-6 font-semibold">{item.title}</td>
                  <td className="p-6"><span className="bg-[#FFF5F7] px-3 py-1 rounded-full text-xs text-[#C05677] border border-[#D4BFC8]/30">{item.category}</span></td>
                  <td className="p-6 font-bold text-[#C05677]">${item.price.toLocaleString()}</td>
                  <td className="p-6 text-center space-x-4">
                    <button onClick={() => {setEditingProduct(item); setShowForm(true);}} className="text-blue-500 font-medium">Editar</button>
                    <button onClick={() => handleDelete(item.id, item.title)} className="text-red-400 font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}