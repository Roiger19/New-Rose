"use client";

import Link from "next/link"; // Usamos el Link de Next.js para navegación interna

export default function Footer() {
  return (
    <footer className="bg-[#2D1F2B] text-white">
      <div className="flex justify-center pt-0">
        <div className="w-16 h-0.5 bg-[#D4A853]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="font-display italic text-xl text-[#FFB6C8]">New</span>
              <span className="font-display italic text-xl text-[#D4A853]">Rose</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Ropa usada con historia, estilo y corazón.
            </p>
          </div>

          {/* Quick Links - Cambiados a Next.js */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">
              Links Rápidos
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
                Inicio
              </Link>
              <Link href="/catalogo" className="text-sm text-white/50 hover:text-white transition-colors">
                Catálogo
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">
              Contacto del Desarrollador Web
            </h4>
            <p className="text-sm text-white/50">juanpabloroig@hotmail.com</p>
            <p className="text-sm text-white/50">Resistencia - Chaco</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#D4A853]/20 text-center">
          <p className="text-xs text-white/30 mb-4">
            &copy; 2026 New Rose. Todos los derechos reservados. 
          </p>
          
          {/* CRÉDITO DEL CREADOR */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            Desarrollado por{" "}
            <a 
              href="https://www.linkedin.com/in/juanpablosotoroig/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#D4A853] hover:text-[#FFB6C8] transition-colors font-semibold"
            >
              Juan Pablo Roig
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}