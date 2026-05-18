"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "../../lib/supabase/supabaseClient";

export default function AdminDashboard() {
  const supabase = createSupabaseClient();
  const [activeTab, setActiveTab] = useState("categorias");
  
  // Estados para Categorías
  const [categories, setCategories] = useState<any[]>([]);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Estados para Productos (AGREGUÉ prodDescription)
  const [products, setProducts] = useState<any[]>([]);
  const [prodName, setProdName] = useState("");
  const [prodDescription, setProdDescription] = useState(""); // NUEVO
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState("");
  const [editingProdId, setEditingProdId] = useState<string | null>(null);

  useEffect(() => { fetchCategories(); fetchProducts(); }, []);

  const fetchCategories = async () => { const { data } = await supabase.from("categories").select("*"); if (data) setCategories(data); };
  const fetchProducts = async () => { const { data } = await supabase.from("products").select("*"); if (data) setProducts(data); };

  // ================= CATEGORÍAS =================
  const resetCatForm = () => { setCatName(""); setCatSlug(""); setCatDesc(""); setEditingCatId(null); };
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatId) { await supabase.from("categories").update({ name: catName, slug: catSlug, description: catDesc }).eq("id", editingCatId); }
    else { await supabase.from("categories").insert([{ name: catName, slug: catSlug, description: catDesc }]); }
    resetCatForm(); fetchCategories();
  };
  const handleEditCategory = (cat: any) => { setEditingCatId(cat.id); setCatName(cat.name); setCatSlug(cat.slug); setCatDesc(cat.description || ""); };
  const handleDeleteCategory = async (id: string) => { if (confirm("¿Eliminar categoría?")) { await supabase.from("categories").delete().eq("id", id); fetchCategories(); } };

  // ================= PRODUCTOS =================
  const resetProdForm = () => { setProdName(""); setProdDescription(""); setProdPrice(""); setProdStock(""); setProdImage(""); setProdCategoryId(""); setEditingProdId(null); };
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { name: prodName, description: prodDescription, price: parseFloat(prodPrice), stock: parseInt(prodStock), image_url: prodImage, category_id: prodCategoryId };
    if (editingProdId) { await supabase.from("products").update(productData).eq("id", editingProdId); }
    else { await supabase.from("products").insert([productData]); }
    resetProdForm(); fetchProducts();
  };
  const handleEditProduct = (prod: any) => {
    setEditingProdId(prod.id); setProdName(prod.name); setProdDescription(prod.description || ""); setProdPrice(prod.price.toString()); setProdStock(prod.stock.toString()); setProdImage(prod.image_url || ""); setProdCategoryId(prod.category_id || "");
  };
  const handleDeleteProduct = async (id: string) => { if (confirm("¿Eliminar producto?")) { await supabase.from("products").delete().eq("id", id); fetchProducts(); } };

  return (
    <div className="min-h-screen bg-[#1A1025] text-[#F3E8FF] p-8">
      <h1 className="text-3xl font-bold mb-8 text-violet-400">Panel de Administración</h1>
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab("categorias")} className={activeTab === "categorias" ? "btn-primary" : "btn-secondary"}>Categorías</button>
        <button onClick={() => setActiveTab("productos")} className={activeTab === "productos" ? "btn-primary" : "btn-secondary"}>Productos</button>
      </div>

      {activeTab === "categorias" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="surface p-6">
            <h2 className="text-xl font-bold mb-4">{editingCatId ? "Editar Categoría" : "Agregar Nueva Categoría"}</h2>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <input type="text" placeholder="Nombre" value={catName} onChange={(e) => setCatName(e.target.value)} required />
              <input type="text" placeholder="Slug" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} required />
              <textarea placeholder="Descripción" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingCatId ? "Actualizar" : "Guardar"}</button>
                {editingCatId && <button type="button" onClick={resetCatForm} className="btn-secondary">Cancelar</button>}
              </div>
            </form>
          </div>
          <div className="surface p-6">
            <h2 className="text-xl font-bold mb-4">Categorías Actuales</h2>
            {categories.length === 0 ? <p className="text-gray-400">Aún no hay.</p> : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id} className="bg-violet-900/30 p-3 rounded-xl flex justify-between items-center">
                    <div><strong>{cat.name}</strong></div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditCategory(cat)} className="text-xs bg-violet-600 px-3 py-1 rounded-lg">Editar</button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-xs bg-red-600 px-3 py-1 rounded-lg">Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === "productos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="surface p-6">
            <h2 className="text-xl font-bold mb-4">{editingProdId ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <input type="text" placeholder="Nombre del producto" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
              <textarea placeholder="Descripción del producto (ingredientes, beneficios, etc.)" value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} /> {/* NUEVO CAMPO */}
              <input type="number" step="0.01" placeholder="Precio (S/.) " value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
              <input type="number" placeholder="Stock" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required />
              <input type="url" placeholder="URL de la imagen" value={prodImage} onChange={(e) => setProdImage(e.target.value)} required />
              <select value={prodCategoryId} onChange={(e) => setProdCategoryId(e.target.value)} required>
                <option value="">Selecciona Categoría</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingProdId ? "Actualizar" : "Guardar"}</button>
                {editingProdId && <button type="button" onClick={resetProdForm} className="btn-secondary">Cancelar</button>}
              </div>
            </form>
          </div>
          <div className="surface p-6">
            <h2 className="text-xl font-bold mb-4">Productos Actuales</h2>
            {products.length === 0 ? <p className="text-gray-400">Aún no hay.</p> : (
              <ul className="space-y-2">
                {products.map((prod) => (
                  <li key={prod.id} className="bg-violet-900/30 p-3 rounded-xl flex gap-4">
                    {prod.image_url && <img src={prod.image_url} alt={prod.name} className="w-12 h-12 rounded object-cover" />}
                    <div className="flex-1">
                      <strong>{prod.name}</strong> - <span className="text-green-400">S/.{prod.price}</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <button onClick={() => handleEditProduct(prod)} className="text-xs bg-violet-600 px-3 py-1 rounded-lg">Editar</button>
                      <button onClick={() => handleDeleteProduct(prod.id)} className="text-xs bg-red-600 px-3 py-1 rounded-lg">Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}