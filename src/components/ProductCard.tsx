"use client";

import React from 'react';
import Link from 'next/link';

// EDUCACIÓN: Añadimos 'id' a las propiedades para saber a qué página redirigir
interface ProductCardProps {
  id: string; // <-- ID necesario para la ruta
  title: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ id, title, price, imageUrl }: ProductCardProps) {
  return (
    <Link href={`/producto/${id}`}>
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D4BFC8]/20 cursor-pointer">
        {/* Contenedor de Imagen */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={imageUrl || "/placeholder-rose.jpg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Información del Producto */}
        <div className="p-4 bg-white">
          <h3 className="text-[#2D1F2B] font-medium text-sm mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-[#C05677] font-bold text-base">
            ${price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}