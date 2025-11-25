// src/presentation/components/inventory/InventoryTable.jsx
import React, { useMemo, useState } from "react";
import { Search, Package } from "lucide-react";

const getStockStatus = (stock, minStock) => {
  if (stock <= minStock * 0.3) {
    return {
      label: "Crítico",
      className: "bg-red-100 text-red-700 border border-red-200",
    };
  } else if (stock < minStock) {
    return {
      label: "Bajo",
      className: "bg-amber-100 text-amber-700 border border-amber-200",
    };
  }
  return {
    label: "Normal",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
};

const InventoryTable = ({ products, onOpenAdjust }) => {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) =>
      [p.name, p.category, p.location]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(q)
        )
    );
  }, [products, search]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Lista de Productos
          </h2>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="h-9 w-64 rounded-md border border-gray-300 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Stock Actual
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Stock Mínimo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(
                product.stock,
                product.minStock
              );

              return (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{product.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {product.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.stock < product.minStock
                          ? "text-red-600 font-semibold"
                          : "text-gray-800"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {product.minStock}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${stockStatus.className}`}
                    >
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenAdjust && onOpenAdjust(product)
                      }
                      className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Ajustar
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No hay productos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
