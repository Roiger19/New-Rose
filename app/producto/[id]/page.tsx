"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrls: string[];
  category: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Capturamos la URL real para el mensaje de WhatsApp
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            ...data,
            imageUrls: data.imageUrls || [data.imageUrl || ""],
          } as Product);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] text-[#8B6F7F]">Cargando prenda...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">Producto no encontrado</div>;

  // ── LÓGICA DE WHATSAPP CON LINK ──
  const phoneNumber = "5493624708623"; 
  const message = encodeURIComponent(
    `¡Hola New Rose! Me encantó esta prenda: ${product.title}.\n\n` +
    `${currentUrl}\n\n` +
    `¿Está disponible?`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/catalogo" className="text-[#C05677] font-semibold mb-8 inline-block hover:underline">
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-[2.5rem] shadow-xl border border-[#D4BFC8]/20">
          
          {/* GALERÍA DE IMÁGENES */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden border-4 border-[#FFF5F7] shadow-inner">
              <img 
                src={product.imageUrls[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            {/* Miniaturas */}
            <div className="flex gap-4">
              {product.imageUrls.map((url, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === index ? 'border-[#C05677] scale-105' : 'border-transparent opacity-60'}`}
                >
                  <img src={url} className="w-full h-full object-cover" alt="miniatura" />
                </button>
              ))}
            </div>
          </div>

          {/* INFORMACIÓN DEL PRODUCTO */}
          <div className="flex flex-col justify-center">
            <span className="text-[#D4A853] font-bold uppercase tracking-widest text-xs mb-2">
              Categoría: {product.category || "General"}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2D1F2B] mb-4">
              {product.title}
            </h1>
            <p className="text-3xl font-bold text-[#C05677] mb-8">
              ${product.price.toLocaleString('es-AR')}
            </p>

            <div className="bg-[#FFF5F7] p-6 rounded-2xl mb-8 border border-[#D4BFC8]/30">
              <p className="text-[#8B6F7F] leading-relaxed">
                Esta es una prenda única. 
                Si te gusta, ¡no esperes mucho! Cada pieza en New Rose es irrepetible.
              </p>
            </div>

            {/* BOTÓN WHATSAPP CON LINK */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-center text-lg shadow-lg hover:shadow-[#25D366]/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}