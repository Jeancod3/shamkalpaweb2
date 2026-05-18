"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCatalog from "@/components/store/ProductCatalog";
import { createSupabaseClient } from "../../lib/supabase/supabaseClient";
import type { Category, Product } from "../../lib/types";

type RawProduct = Omit<Product, "price"> & { price: number | string };

export default function ProductosPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setErrorMsg("");

      const [categoriesRes, productsRes] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name, slug, image_url, description, created_at")
          .order("name"),
        supabase
          .from("products")
          .select("id, name, description, price, image_url, category_id, stock, created_at")
          .order("created_at", { ascending: false })
      ]);

      if (!active) return;

      if (categoriesRes.error) {
        setErrorMsg(categoriesRes.error.message);
        setLoading(false);
        return;
      }

      if (productsRes.error) {
        setErrorMsg(productsRes.error.message);
        setLoading(false);
        return;
      }

      const normalizedProducts: Product[] = ((productsRes.data ?? []) as RawProduct[]).map(
        (p) => ({
          ...p,
          price: Number(p.price)
        })
      );

      setCategories((categoriesRes.data ?? []) as Category[]);
      setProducts(normalizedProducts);
      setLoading(false);
    }

    loadData();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-4xl">Tienda de Shamkalpa</h1>
      <p className="mt-2 text-textGlow/80">
        Aceites CBD, cuidado corporal, yoga, ropa y más.
      </p>

      {loading && (
        <div className="surface mt-8 p-6">
          <p className="text-textGlow/80">Cargando productos...</p>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="surface mt-8 p-6">
          <p className="text-red-300">{errorMsg}</p>
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="mt-8">
          <ProductCatalog categories={categories} products={products} />
        </div>
      )}
    </main>
  );
}
