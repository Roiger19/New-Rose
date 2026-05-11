"use client";

import { useState, useEffect } from "react";
import { db } from "@/src/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { uploadMultipleToCloudinary } from "@/src/lib/cloudinary";

interface AddProductFormProps {
  onSuccess: () => void;
  productToEdit?: any | null; 
}

export default function AddProductForm({ onSuccess, productToEdit }: AddProductFormProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("vestidos"); // Estado para la categoría
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Lista de categorías basada en tu configuración previa
  const categories = [
    { name: "Vestidos", slug: "vestidos" },
    { name: "Blusas", slug: "blusas-tops" },
    { name: "Pantalones", slug: "pantalones" },
    { name: "Faldas", slug: "faldas" },
    { name: "Zapatos", slug: "zapatos" },
    { name: "Accesorios", slug: "accesorios" },
    { name: "Chaquetas", slug: "chaquetas-abrigos" },
    { name: "Trajes de Baño", slug: "trajes-de-bano" },
  ];

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setPrice(productToEdit.price.toString());
      setCategory(productToEdit.category || "vestidos"); // Cargamos categoría al editar
    }
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || (!productToEdit && files.length === 0)) {
      return alert("Completa todos los campos y selecciona al menos una foto.");
    }

    setLoading(true);
    try {
      let finalImages = productToEdit?.imageUrls || [];
      
      if (files.length > 0) {
        const uploadedUrls = await uploadMultipleToCloudinary(files);
        finalImages = uploadedUrls.slice(0, 3);
      }

      // EDUCACIÓN: Añadimos 'category' al objeto que se enviará a Firebase
      const productData = {
        title: title.trim(),
        price: Number(price),
        category: category, // Nueva propiedad
        imageUrls: finalImages,
        updatedAt: serverTimestamp(),
      };

      if (productToEdit) {
        await updateDoc(doc(db, "products", productToEdit.id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un fallo en la operación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl border border-[#D4BFC8]/20 w-full">
      <h2 className="font-display text-2xl text-[#2D1F2B] mb-6 text-center">
        {productToEdit ? "Editar Prenda" : "Registrar Prenda"}
      </h2>
      
      <div className="space-y-5">
        <input 
          type="text" placeholder="Nombre (Ej: Top Satin)"
          className="w-full p-3 rounded-xl border border-[#D4BFC8]/50 text-[#2D1F2B] font-medium outline-none focus:border-[#C05677]"
          value={title} onChange={(e) => setTitle(e.target.value)}
        />
        
        <input 
          type="number" placeholder="Precio ($ ARS)"
          className="w-full p-3 rounded-xl border border-[#D4BFC8]/50 text-[#2D1F2B] font-medium outline-none focus:border-[#C05677]"
          value={price} onChange={(e) => setPrice(e.target.value)}
        />

        {/* SELECTOR DE CATEGORÍA */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#8B6F7F] uppercase tracking-wider ml-1">Categoría</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#D4BFC8]/50 text-[#2D1F2B] font-medium outline-none bg-white focus:border-[#C05677] cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#8B6F7F] uppercase tracking-wider">
            Fotos (hasta 3)
          </label>
          <input 
            type="file" multiple accept="image/*"
            className="w-full text-sm text-[#2D1F2B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFF5F7] file:text-[#C05677]"
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              setFiles(selected.slice(0, 3));
            }}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-[#D4A853] to-[#B8933F] text-white font-bold shadow-lg disabled:opacity-50"
        >
          {loading ? "Procesando..." : productToEdit ? "Guardar Cambios" : "Confirmar y Subir"}
        </button>
      </div>
    </form>
  );
}