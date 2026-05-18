"use client";


import { useCartStore } from "./cart-store";

interface CartDrawerProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function CartDrawer({
  open,
  setOpen,
}: CartDrawerProps) {
  const items = useCartStore((state: any) => state.items);
  const setQuantity = useCartStore((state: any) => state.setQuantity);
  const removeItem = useCartStore((state: any) => state.removeItem);

  // Calculamos el total aquí mismo para no depender del servidor
  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

      {/* Panel del carrito */}
      <div className="relative w-full max-w-md bg-[#1A1025] text-[#F3E8FF] h-full overflow-y-auto shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-violet-400">Tu Carrito</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 bg-[#2a1f3d] p-3 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">${item.price.toFixed(2)} c/u</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="text-red-400 text-xs hover:underline">
                      Quitar
                    </button>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-violet-800 mt-6 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-violet-400">${total.toFixed(2)}</span>
              </div>
              <a href={`/checkout?items=${encodeURIComponent(JSON.stringify(items))}&total=${total.toFixed(2)}`} className="block w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition text-center">
  Proceder al Pago
</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}