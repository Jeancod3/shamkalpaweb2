"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "../../store/cart-store"; // Importamos el carrito

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((state: any) => state.items); // Leemos los items del carrito
  
  // Calculamos cuántos productos hay en total (sumando las cantidades)
  const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // Función para abrir el carrito (necesitamos comunicarnos con ProductCatalog o usar un estado global, por ahora haremos que al darle click vaya a la página de productos y abra el carrito automáticamente)
  const handleCartClick = () => {
    // Esto disparará un evento para abrir el carrito si estamos en /productos
    window.dispatchEvent(new Event('open-cart'));
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#1A1025]/90 backdrop-blur-md border-b border-violet-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-violet-400 hover:text-violet-300 transition">
            Shamkalpa
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-violet-400 transition">Inicio</Link>
            <Link href="/productos" className="text-gray-300 hover:text-violet-400 transition">Productos</Link>
            <Link href="/reservas" className="text-gray-300 hover:text-violet-400 transition">Reservas</Link>
            <Link href="/login" className="text-gray-300 hover:text-violet-400 transition">Login</Link>
            
            {/* ICONO DEL CARRITO NUEVO */}
            <button onClick={handleCartClick} className="relative text-gray-300 hover:text-violet-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {/* Contador rojo si hay productos */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

          </div>

          {/* Menú Móvil (Hamburguesa) */}
          <div className="md:hidden flex items-center gap-4">
            
            {/* Carrito Móvil */}
            <button onClick={handleCartClick} className="relative text-gray-300 hover:text-violet-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-violet-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Dropdown Móvil */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A1025] border-t border-violet-900/40 px-4 pb-4 space-y-2">
          <Link href="/" className="block py-2 text-gray-300 hover:text-violet-400">Inicio</Link>
          <Link href="/productos" className="block py-2 text-gray-300 hover:text-violet-400">Productos</Link>
          <Link href="/reservas" className="block py-2 text-gray-300 hover:text-violet-400">Reservas</Link>
          <Link href="/login" className="block py-2 text-gray-300 hover:text-violet-400">Login</Link>
        </div>
      )}
    </nav>
  );
}
