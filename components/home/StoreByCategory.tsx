import Link from "next/link";
import type { CategoryWithProducts } from "@/lib/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2
  }).format(value);
}

interface StoreByCategoryProps {
  categories: CategoryWithProducts[];
}

export default function StoreByCategory({ categories }: StoreByCategoryProps) {
  if (!categories.length) {
    return (
      <div className="surface p-6">
        <p className="text-textGlow/80">
          Aún no hay categorías en tienda. Puedes crearlas desde el panel admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <section key={category.id} className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl">{category.name}</h3>
              {category.description && (
                <p className="mt-1 text-sm text-textGlow/80">{category.description}</p>
              )}
            </div>

            <Link href="/productos" className="btn-secondary">
              Ver catálogo completo
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {category.products.map((product) => (
              <article
                key={product.id}
                className="surface overflow-hidden transition hover:-translate-y-1 hover:border-violetAura/70"
              >
                <img
                  src={
                    product.image_url ??
                    "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={product.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="mt-1 text-mintAura">{formatCurrency(product.price)}</p>
                </div>
              </article>
            ))}

            {category.products.length === 0 && (
              <div className="surface p-4 text-sm text-textGlow/75">
                Esta categoría todavía no tiene productos.
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
