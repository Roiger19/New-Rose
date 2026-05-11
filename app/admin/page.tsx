"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth(); // Obtenemos la función de nuestro contexto
  const router = useRouter();  // Para redirigir al usuario

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // Si el login es exitoso, enviamos al dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      console.error("Error al iniciar sesión:", err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FFF5F7] px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#D4BFC8]/30">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[#2D1F2B] mb-2">Admin Rose Vault</h1>
          <p className="text-sm text-[#8B6F7F]">Ingresa tus credenciales para gestionar el catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#2D1F2B] mb-2">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#D4BFC8]/50 text-[#2D1F2B] outline-none focus:border-[#C05677]"
              placeholder="admin@rosevault.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D1F2B] mb-2">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#D4BFC8]/50 text-[#2D1F2B] outline-none focus:border-[#C05677]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #E8799A 0%, #C05677 100%)",
            }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}