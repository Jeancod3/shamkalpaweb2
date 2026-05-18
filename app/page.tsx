import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ReservationWidget from "../components/home/ReservationWidget";
import StoreByCategory from "../components/home/StoreByCategory";
import type { CategoryWithProducts, ClassSchedule, WellnessClass } from "../lib/types";

export const dynamic = "force-dynamic";

const practices = [
  {
    title: "Yoga",
    description: "Movimiento consciente, respiración y equilibrio interior.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "Música Medicina",
    description: "Vibración sonora para sanar y expandir la percepción.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "Danza",
    description: "Liberación emocional y conexión profunda con tu cuerpo.",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "Lectura de Tarot",
    description: "Guía simbólica para tu camino espiritual y personal.",
    image:
      "https://images.unsplash.com/photo-1598819714737-5566d8df6b82?q=80&w=1600&auto=format&fit=crop"
  }
];

async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // No-op en page server component
        }
      }
    }
  );
}

export default async function HomePage() {
  const supabase = await getSupabaseServerClient();

  const [{ data: categoriesData }, { data: classesData }, { data: schedulesData }] =
    await Promise.all([
      supabase
        .from("categories")
        .select(
          "id, name, slug, image_url, description, products(id, name, description, price, image_url, category_id, stock)"
        )
        .order("name"),
      supabase.from("classes").select("*").order("name"),
      supabase.from("class_schedules").select("*").order("date").order("start_time")
    ]);

  const categories = (categoriesData ?? []) as CategoryWithProducts[];
  const classes = (classesData ?? []) as WellnessClass[];
  const schedules = (schedulesData ?? []) as ClassSchedule[];

  return (
    <main>
      <section
        className="relative flex min-h-[72vh] items-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(12,8,20,.74), rgba(12,8,20,.82)), url('https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1800&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="animate-fade-up font-display text-5xl leading-tight md:text-7xl">
            Shamkalpa
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-textGlow/85">
            Bienestar espiritual y prácticas holísticas.
          </p>
          <Link href="#reservas" className="btn-primary mt-8 inline-flex animate-floaty">
            Agenda tu Sesión
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-display text-4xl">Nuestras Prácticas</h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {practices.map((practice) => (
            <article
              key={practice.title}
              className="surface overflow-hidden transition hover:-translate-y-1 hover:border-violetAura/70"
            >
              <img
                src={practice.image}
                alt={practice.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{practice.title}</h3>
                <p className="mt-2 text-sm text-textGlow/80">{practice.description}</p>
                <a href="#reservas" className="btn-secondary mt-4 inline-flex">
                  Reservar ahora
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="reservas" className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-display text-4xl">Horario y Reservación</h2>
        <p className="mt-2 text-textGlow/80">
          Selecciona tu práctica, elige fecha y confirma tu cupo.
        </p>

        <div className="mt-6">
          <ReservationWidget classes={classes} schedules={schedules} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <h2 className="font-display text-4xl">Tienda Shamkalpa</h2>
        <p className="mt-2 text-textGlow/80">
          Categorías dinámicas por base de datos. Si el admin crea una nueva categoría,
          aparecerá automáticamente aquí con sus productos.
        </p>

        <div className="mt-8">
          <StoreByCategory categories={categories} />
        </div>
      </section>
    </main>
  );
}
