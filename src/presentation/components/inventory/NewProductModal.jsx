// src/presentation/components/inventory/NewProductModal.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const NewProductModal = ({
  open,
  onClose,
  categories = [],
  onCreateProduct,
  onCreateCategory,
}) => {
  const [activeTab, setActiveTab] = useState("product"); // "product" | "category"
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(String(categories[0].id));
    }
  }, [categories, selectedCategoryId]);

  if (!open) return null;

  const hasCategories = categories.length > 0;

  // 🟦 PRODUCTO
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!onCreateProduct) return;

    // 🔹 Guardar referencia del form ANTES del await
    const form = e.currentTarget;
    const formData = new FormData(form);

    const values = {
      name: formData.get("name"),
      categoryId:
        selectedCategoryId || formData.get("categoryId") || "",
      stock: parseInt(formData.get("stock") || "0", 10),
      minStock: parseInt(formData.get("minStock") || "0", 10),
    };

    if (!values.categoryId) return;

    try {
      setLoading(true);

      const created = await onCreateProduct(values);

      await Swal.fire({
        title: "Producto agregado",
        text: `El producto "${created?.name}" se registró correctamente.`,
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      form.reset(); // ✅ usamos la ref, no e.currentTarget
      setSelectedCategoryId(
        categories.length ? String(categories[0].id) : ""
      );
      onClose();
    } catch (err) {
      console.error("Error creando producto:", err);

      await Swal.fire({
        title: "Error",
        text: "No se pudo crear el producto",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🟩 CATEGORÍA
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!onCreateCategory) return;

    // 🔹 Guardar referencia del form ANTES del await
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nombre_cat = formData.get("nombre_cat")?.toString().trim();

    if (!nombre_cat) return;

    try {
      setLoading(true);

      const created = await onCreateCategory(nombre_cat);

      await Swal.fire({
        title: "Categoría creada",
        text: `La categoría "${created?.nombre_cat}" se agregó correctamente.`,
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      form.reset(); // ✅ usamos la ref guardada

      if (created?.id) {
        setSelectedCategoryId(String(created.id));
        setActiveTab("product");
      }
    } catch (err) {
      console.error("Error creando categoría:", err);

      await Swal.fire({
        title: "Error",
        text: "No se pudo crear la categoría",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Inventario: gestión rápida
            </h3>
            <p className="text-sm text-gray-500">
              Crea productos y categorías desde un solo lugar
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="inline-flex rounded-lg bg-gray-100 p-1 text-xs font-medium">
            <button
              type="button"
              className={`px-3 py-1 rounded-md transition ${
                activeTab === "product"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("product")}
            >
              Nuevo producto
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-md transition ${
                activeTab === "category"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("category")}
            >
              Nueva categoría
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-5">
          {activeTab === "product" ? (
            <form
              onSubmit={handleSubmitProduct}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nombre del Producto
                </label>
                <input
                  id="name"
                  name="name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Ej: Mouse Logitech..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="categoryId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Categoría
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    value={selectedCategoryId}
                    onChange={(e) =>
                      setSelectedCategoryId(e.target.value)
                    }
                    required
                    disabled={!hasCategories}
                  >
                    <option value="" disabled>
                      {hasCategories
                        ? "Selecciona categoría"
                        : "No hay categorías disponibles"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre_cat}
                      </option>
                    ))}
                  </select>
                  {!hasCategories && (
                    <p className="mt-1 text-xs text-red-500">
                      No hay categorías, crea una en la pestaña
                      &quot;Nueva categoría&quot;.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-gray-700"
                  >
                    Stock Actual
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="minStock"
                    className="text-sm font-medium text-gray-700"
                  >
                    Stock Mínimo
                  </label>
                  <input
                    id="minStock"
                    name="minStock"
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 pb-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !hasCategories}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Guardando..." : "Agregar Producto"}
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitCategory}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label
                  htmlFor="nombre_cat"
                  className="text-sm font-medium text-gray-700"
                >
                  Nombre de la categoría
                </label>
                <input
                  id="nombre_cat"
                  name="nombre_cat"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Ej: Periféricos, Monitores..."
                  required
                />
              </div>

              <p className="text-xs text-gray-500">
                Al crear una categoría, se agregará a la lista y podrás
                seleccionarla en la pestaña de &quot;Nuevo
                producto&quot;.
              </p>

              <div className="flex justify-end gap-2 pt-2 pb-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Guardando..." : "Crear categoría"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProductModal;
