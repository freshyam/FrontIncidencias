import React, { useEffect, useState } from "react";

const EditProductModal = ({
  open,
  onClose,
  product,
  categories,
  loading,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    minStock: "",
  });

  // Cuando cambia el producto o se abre el modal, llenamos el form
  useEffect(() => {
    if (product && open) {
      // Intentamos hacer match entre product.category y las categorías disponibles
      const matchedCategory = categories?.find(
        (cat) => cat.nombre_cat === product.category
      );

      setForm({
        id: product.id,
        name: product.name || "",
        category: matchedCategory
          ? matchedCategory.nombre_cat
          : product.category || "",
        minStock: product.minStock ?? "",
      });
    }
  }, [product, open, categories]);

  if (!open || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "minStock"
          ? value.replace(/[^\d]/g, "") // solo números
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;
    if (!form.category.trim()) return;

    await onSubmit({
      id: form.id,
      name: form.name.trim(),
      category: form.category.trim(),
      minStock: Number(form.minStock),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Editar producto #{product.id}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {/* Nombre / descripción */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Nombre del producto
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej. Laptop Dell, Monitor 24''..."
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Categoría
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una categoría</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.nombre_cat}>
                    {cat.nombre_cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Solo stock mínimo */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Stock mínimo
              </label>
              <input
                type="number"
                name="minStock"
                value={form.minStock}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
