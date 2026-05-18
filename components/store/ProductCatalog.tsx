"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "../../lib/types";
import { createSupabaseClient } from "../../lib/supabase/supabaseClient";
import { useCartStore } from "./cart-store";
import ProductQuickViewModal from "./ProductQuickViewModal";
import CartDrawer from "./CartDrawer";

interface ProductCatalogProps {
  categories: Category[];
  products: Product[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2
  }).format(value);
}

export default function ProductCatalog({ categories, products }: ProductCatalogProps) {
  const supabase = createSupabaseClient();
  const router = useRouter();

  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const cartItems = useCartStore((s) => s.items);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");
    // Escuchar el evento del Navbar para abrir el carrito
  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener('open-cart', openCart);
    return () => window.removeEventListener('open-cart', openCart);
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category_id === selectedCategory);
  }, [products, selectedCategory]);

  const total = useMemo(() => cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0), [cartItems]);

  function handleAddToCart(product: Product, quantity: number) {
    if (product.stock <= 0) {
      setMessage("Este producto está agotado.");
      return;
    }

   addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url as any
      }
    );
    setMessage("Producto agregado al carrito.");
  }

  function handleBuyNow(product: Product, quantity: number) {
    handleAddToCart(product, quantity);
    setCartOpen(true);
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    setMessage("");

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setCheckoutLoading(false);
      router.push("/login?next=/productos");
      return;
    }

    const payload = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity
    }));

    const { error } = await supabase.rpc("checkout_cart", { p_items: payload });

    if (error) {
      setMessage(error.message);
      setCheckoutLoading(false);
      return;
    }

    clearCart();
    setCartOpen(false);
    setCheckoutLoading(false);
    setMessage("Compra realizada con éxito.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="surface p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xl px-3 py-2 text-sm transition ${
              selectedCategory === "all"
                ? "bg-violetAura text-textGlow"
                : "bg-night hover:bg-violetAura/20"
            }`}
          >
            Todas
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-xl px-3 py-2 text-sm transition ${
                selectedCategory === category.id
                  ? "bg-violetAura text-textGlow"
                  : "bg-night hover:bg-violetAura/20"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {message && <p className="text-sm text-textGlow/90">{message}</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="surface cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:border-violetAura/70"
          >
            <img
              src={
                product.image_url ??
                "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1200&auto=format&fit=crop"
              }
              alt={product.name}
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="truncate text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 text-mintAura">{formatCurrency(product.price)}</p>
              <p className="mt-1 text-xs text-textGlow/70">
                {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
              </p>
            </div>
          </article>
        ))}
      </div>

      <ProductQuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        open={cartOpen}
        setOpen={setCartOpen}
      />
    </div>
  );
}
