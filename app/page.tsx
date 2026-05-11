"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrls: string[]; 
  category?: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const categories = [
  { id: "1", name: "Vestidos", slug: "vestidos" },
  { id: "2", name: "Blusas y Tops", slug: "blusas-tops" },
  { id: "3", name: "Pantalones", slug: "pantalones" },
  { id: "4", name: "Faldas", slug: "faldas" },
  { id: "5", name: "Zapatos", slug: "zapatos" },
  { id: "6", name: "Accesorios", slug: "accesorios" },
  { id: "7", name: "Chaquetas", slug: "chaquetas-abrigos" },
  { id: "8", name: "Trajes de Baño", slug: "trajes-de-bano" },
];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(15));
        const querySnapshot = await getDocs(q);
        
        const allFetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageUrls: doc.data().imageUrls || [doc.data().imageUrl || ""]
        })) as Product[];

        setFeaturedProducts(allFetched.slice(0, 4));

        const imagesMap: Record<string, string> = {};
        categories.forEach(cat => {
          const firstInCat = allFetched.find(p => p.category === cat.slug);
          if (firstInCat) {
            imagesMap[cat.slug] = firstInCat.imageUrls[0];
          }
        });
        setCategoryImages(imagesMap);

      } catch (error) {
        console.error("Error cargando Rose Vault:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  return (
    <div className="bg-[#FFF5F7]">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Great+Vibes&display=swap" rel="stylesheet" />
      
      <style>{`
        .font-luxury-serif { font-family: 'Playfair Display', serif !important; }
        .sophisticated-pink { 
          font-family: 'Great Vibes', cursive !important; 
          color: #C05677; font-size: 1.2em; display: inline-block; line-height: 1;
        }
        .sophisticated-gold { 
          font-family: 'Great Vibes', cursive !important; 
          font-size: 1.2em; display: inline-block; line-height: 1;
          background: linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728, #AA771C);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Oculta la barra en Chrome, Safari y Opera */
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE y Edge */
        scrollbar-width: none;  /* Firefox */
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FFF5F7] pt-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" 
            className="w-full h-full object-cover object-center" 
            alt="Rose Vault Hero"
          />
          <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to right, rgba(255,245,247,1) 0%, rgba(255,245,247,0.8) 40%, rgba(255,245,247,0) 100%)" }} />
        </div>

        <div className="relative z-20 max-w-[1200px] mx-auto px-6 w-full py-20">
          <div className="max-w-2xl text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#D4A853] mb-6">
              Catálogo de Ropa Femenina
            </span>
            
            <h1 className="font-luxury-serif text-5xl sm:text-6xl lg:text-7xl text-[#2D1F2B] leading-tight mb-8">
              Ropa con <span className="italic">historia,</span> <br />
              <span className="sophisticated-pink">estilo</span> y <br />
              <span className="sophisticated-gold">corazón</span>
            </h1>
            
            <p className="text-lg text-[#8B6F7F] mb-12 max-w-md leading-relaxed">
              Descubre prendas únicas que merecen una segunda oportunidad, seleccionadas con ese toque de elegancia que tu armario merece.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Link href="/catalogo" className="px-10 py-4 rounded-full text-sm font-bold bg-gradient-to-r from-[#D4A853] to-[#B8933F] text-white shadow-lg hover:scale-105 transition-all">
                Explorar Catálogo
              </Link>
              <Link href="#categorias" className="px-10 py-4 rounded-full text-sm font-bold border-2 border-[#D4BFC8] text-[#2D1F2B] hover:bg-[#D4BFC8]/10 transition-all">
                Ver Categorías
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECIÉN LLEGADOS ── */}
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-luxury-serif text-4xl text-[#2D1F2B]">Recién llegados</h2>
          <Link href="/catalogo" className="text-[#C05677] font-semibold hover:underline">Ver todo</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 text-[#8B6F7F]">Cargando tesoros...</div>
          ) : (
            featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id} // <-- AQUÍ SE AGREGÓ EL ID PARA SOLUCIONAR EL ERROR
                title={product.title} 
                price={product.price} 
                imageUrl={product.imageUrls[0]} 
              />
            ))
          )}
        </div>
      </section>

      {/* ── EXPLORA POR CATEGORÍA (Carrusel dinámico) ── */}
<section id="categorias" className="py-20 bg-white/40">
  <div className="max-w-[1200px] mx-auto px-6">
    <h2 className="font-luxury-serif text-4xl text-[#2D1F2B] text-center mb-14">Explora por Categoría</h2>
    
    {/* MODIFICACIÓN AQUÍ: Se añade 'scrollbar-hide' al div contenedor */}
    <div className="flex overflow-x-auto gap-4 pb-8 scrollbar-hide snap-x snap-mandatory">
      {categories.map((cat) => (
        <Link 
          href={`/catalogo?categoria=${cat.slug}`} 
          key={cat.id} 
          className="snap-start flex-shrink-0 w-[200px] sm:w-[250px] group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md bg-[#FFF5F7]"
        >
          {categoryImages[cat.slug] ? (
            <img 
              src={categoryImages[cat.slug]} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D4BFC8] text-sm italic p-4 text-center">
              Sin productos aún
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1F2B]/80 to-transparent" />
          <div className="absolute bottom-0 p-4 text-white">
            <h3 className="font-bold text-lg">{cat.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
    </div>
  );
}