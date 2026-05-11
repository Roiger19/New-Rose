"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import ProductCard from "@/src/components/ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrls: string[];
  category: string;
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("categoria");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, "products"));
        
        // Si hay una categoría en la URL, filtramos en Firebase
        if (categoryFilter) {
          q = query(collection(db, "products"), where("category", "==", categoryFilter));
        }

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageUrls: doc.data().imageUrls || [doc.data().imageUrl || ""]
        })) as Product[];

        setProducts(docs);
      } catch (error) {
        console.error("Error en catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [categoryFilter]);

  return (
    <div className="min-h-screen bg-[#FFF5F7] pt-32 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-display text-[#2D1F2B] italic mb-4">
            {categoryFilter ? `Colección: ${categoryFilter}` : "Nuestro Catálogo"}
          </h1>
          <p className="text-[#8B6F7F]">Explora prendas únicas seleccionadas con corazón.</p>
        </header>

        {loading ? (
          <p className="text-center py-20 text-[#8B6F7F] animate-pulse">Buscando prendas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                imageUrl={product.imageUrls[0]}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#D4BFC8]/30">
            <p className="text-[#8B6F7F]">No encontramos productos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Next.js requiere Suspense para usar useSearchParams en componentes cliente
export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}