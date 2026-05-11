"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Hooks oficiales de Next.js
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const pathname = usePathname(); // Detecta la ruta actual (ej: "/catalogo")
  const router = useRouter(); // Permite navegar programáticamente

  // Efecto para cambiar el estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerramos el menú móvil si cambia la ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin");

  // Función para scroll suave en la misma página o navegar al home primero
  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-14 shadow-md bg-[#FFF5F7]/90 backdrop-blur-xl"
            : "h-16 bg-[#FFF5F7]/85 backdrop-blur-xl"
        }`}
        style={{ borderBottom: "1px solid rgba(212,191,200,0.4)" }}
      >
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="font-display italic text-xl text-[#FFB6C8]">New</span>
            <span className="font-display italic text-xl text-[#D4A853]">Rose</span>
          </Link>

          {/* Desktop Nav */}
          {!isAdminRoute && (
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("hero")} className="text-sm font-medium text-[#2D1F2B] hover:text-[#D4A853]">
                Inicio
              </button>
              <Link href="/catalogo" className="text-sm font-medium text-[#2D1F2B] hover:text-[#D4A853]">
                Catálogo
              </Link>
            </div>
          )}

          {/* Acciones derecha */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hidden md:flex items-center gap-2 text-sm font-medium text-[#8B6F7F] hover:text-[#D4A853]">
              <UserIcon className="w-5 h-5" />
              <span>Mi Cuenta</span>
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1 text-[#2D1F2B]">
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#FFF5F7] pt-20 px-6">
           <div className="flex flex-col gap-4">
              <Link href="/" className="text-base font-medium text-[#2D1F2B] py-2 border-b">Inicio</Link>
              <Link href="/catalogo" className="text-base font-medium text-[#2D1F2B] py-2 border-b">Catálogo</Link>
              <Link href="/admin" className="text-base font-medium text-[#8B6F7F] py-2">Admin</Link>
           </div>
        </div>
      )}
    </>
  );
}