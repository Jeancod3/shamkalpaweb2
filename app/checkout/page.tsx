"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseClient } from "../../lib/supabase/supabaseClient";
import Link from "next/link";

// TUS DATOS - CAMBIA ESTO
const TU_NUMERO_WHATSAPP = "51999888777"; // Tu número real (51 + 999888777)
const numeroYape = "999-888-777";
const numeroPlin = "111-222-333";
const datosBancarios = "Banco BCP - Cuenta de Ahorros\nNro: 193-2847561-0-42\nTitular: Shamkalpa SAC";
const linkQRYape = "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=80";
const linkQRPlin = "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=80";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const supabase = createSupabaseClient();
  
  const itemsString = searchParams.get("items");
  const totalString = searchParams.get("total");
  
  const items = itemsString ? JSON.parse(itemsString) : [];
  const total = totalString ? parseFloat(totalString) : 0;

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [step, setStep] = useState<"form" | "pay">("form");
  const [loading, setLoading] = useState(false);

  const handleContinueToPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Guardar el pedido en Supabase (Ahora enviamos exactamente lo que espera la BD)
    const { error } = await supabase.from("orders").insert([{
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_city: customerCity,
      customer_address: customerAddress,
      items: items,
      total: total,
      status: "pendiente"
    }]);

    if (!error) {
      setStep("pay");
    } else {
      alert("Hubo un error: " + error.message); // Esto te dirá exactamente qué falló si pasa de nuevo
    }
    setLoading(false);
  };

  const generateWhatsAppLink = () => {
    const itemsList = items.map((item: any) => `${item.name} x${item.quantity}`).join(", ");
    const text = `Hola Shamkalpa! Acabo de realizar un pago de S/.${total.toFixed(2)} por: ${itemsList}. 
Mi nombre es ${customerName}.
Ciudad: ${customerCity}.
Dirección: ${customerAddress}.
Adjunto mi comprobante.`;
    return `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#1A1025] text-[#F3E8FF] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-violet-400 text-center">Finalizar Compra</h1>

        {items.length === 0 ? (
          <div className="surface p-6 text-center">
            <p className="text-gray-400 mb-4">No tienes productos en el carrito.</p>
            <Link href="/productos" className="btn-primary">Ir a la tienda</Link>
          </div>
        ) : step === "form" ? (

          /* ================= PASO 1: FORMULARIO ================= */
          <div className="surface p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">1. Datos de Envío y Contacto</h2>
            <p className="text-sm text-gray-400 mb-6">Solo realizamos envíos dentro de Perú.</p>
            <form onSubmit={handleContinueToPay} className="space-y-4">
              <input type="text" placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              <input type="tel" placeholder="Número de WhatsApp (Ej: 999888777)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
              <input type="email" placeholder="Correo electrónico" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
              
              {/* CAMPOS DE DIRECCIÓN SIMPLIFICADOS */}
              <input type="text" placeholder="Ciudad (Ej: Arequipa, Cusco, Lima)" value={customerCity} onChange={(e) => setCustomerCity(e.target.value)} required />
              <input type="text" placeholder="Dirección exacta (Distrito, Calle, Nro, Dpto)" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
              
              <div className="surface bg-violet-900/30 p-4 mt-4">
                <h3 className="font-bold mb-2">Resumen:</h3>
                {items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>S/.{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-violet-500">
                  <span>Total:</span>
                  <span>S/.{total.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-3">
                {loading ? "Guardando..." : "Continuar al Pago"}
              </button>
            </form>
          </div>

        ) : (

          /* ================= PASO 2: PAGAR ================= */
          <div>
            <div className="surface p-4 mb-6 bg-green-900/20 border border-green-500/30 text-center">
              <p className="text-green-400 font-bold">✅ Datos guardados. Envío a {customerCity}. Realiza el pago de S/.{total.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Yape */}
              <div className="surface p-6 text-center flex flex-col items-center">
                <h3 className="text-xl font-bold mb-3 text-purple-500">Yape</h3>
                <img src={linkQRYape} alt="QR Yape" className="w-40 h-40 rounded-xl object-cover mb-3 border-2 border-purple-500" />
                <p className="text-sm text-gray-300">Nro: {numeroYape}</p>
              </div>

              {/* Plin */}
              <div className="surface p-6 text-center flex flex-col items-center">
                <h3 className="text-xl font-bold mb-3 text-green-500">Plin</h3>
                <img src={linkQRPlin} alt="QR Plin" className="w-40 h-40 rounded-xl object-cover mb-3 border-2 border-green-500" />
                <p className="text-sm text-gray-300">Nro: {numeroPlin}</p>
              </div>

              {/* Transferencia */}
              <div className="surface p-6 text-center flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold mb-3 text-blue-400">Transferencia</h3>
                <div className="bg-[#1A1025] p-4 rounded-xl w-full text-left whitespace-pre-line text-sm text-gray-300">
                  {datosBancarios}
                </div>
              </div>
            </div>

            {/* Botón de WhatsApp */}
            <div className="text-center">
              <a 
                href={generateWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition text-lg mb-4"
              >
                📲 Ya Pagué - Enviar Comprobante por WhatsApp
              </a>
              <p className="text-xs text-gray-500">Se abrirá WhatsApp con tu pedido y dirección para que adjuntes tu comprobante.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1A1025] flex items-center justify-center text-violet-400">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}