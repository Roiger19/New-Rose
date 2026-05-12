import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Importación de componentes globales
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
// Importación del contexto de autenticación de Firebase
import { AuthProvider } from "@/src/context/AuthContext";

// Configuración de fuentes
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

// Configuración de metadatos para SEO
export const metadata: Metadata = {
  title: "New Rose",
  description: "Ropa seleccionada con estilo y corazón",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" }, // Fallback para navegadores antiguos
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="es" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* AuthProvider debe envolver todo lo que necesite saber si hay un usuario logueado */}
        <AuthProvider>
          <NavBar /> 
          
          {/* El main con flex-grow asegura que el footer se mantenga al final de la pantalla */}
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}