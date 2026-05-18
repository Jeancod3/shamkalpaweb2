"use client";

import { useEffect, useState } from "react";
import type { Product } from "../../lib/types";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2
  }).format(value);
}

export default function ProductQuickViewModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}: ProductQuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const maxQty = Math.max(1, product.stock);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="surface w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          <img
            src={
              product.image_url ??
              "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1200&auto=format&fit=crop"
            }
            alt={product.name}
            className="h-72 w-full object-cover md:h-full"
          />

          <div className="p-6">
            <h3 className="font-display text-3xl">{product.name}</h3>
            <p className="mt-2 text-sm text-textGlow/80">{product.description}</p>
            <p className="mt-4 text-lg text-mintAura">{formatCurrency(product.price)}</p>
            <p className="mt-1 text-sm text-textGlow/70">
              {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className="btn-secondary px-3"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                type="button"
                className="btn-secondary px-3"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              >
                +
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => onAddToCart(product, quantity)}
                disabled={product.stock <= 0}
              >
                Agregar al carrito
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onBuyNow(product, quantity)}
                disabled={product.stock <= 0}
              >
                Comprar ahora
              </button>

              <button type="button" className="btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
