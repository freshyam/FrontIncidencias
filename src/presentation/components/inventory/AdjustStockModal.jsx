// src/presentation/components/inventory/AdjustStockModal.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AdjustStockModal = ({ open, product, loading, onClose, onSubmit }) => {
  const [nuevoStock, setNuevoStock] = useState("");
  const [nota, setNota] = useState("");

  useEffect(() => {
    if (product) {
      setNuevoStock(String(product.stock ?? ""));
      setNota("");
    }
  }, [product]);

  if (!open || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmit) return;

    const stockNumber = Number(nuevoStock);
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      Swal.fire({
        title: "Dato inválido",
        text: "El stock debe ser un número mayor o igual a 0.",
        icon: "warning",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    try {
      const updated = await onSubmit({
        id: product.id,
        nuevoStock: stockNumber,
        nota,
      });

      if (updated) {
        await Swal.fire({
          title: "Ajuste aplicado",
          html: `
            <p style="font-size:14px">
              <b>${product.name}</b><br/>
              Stock anterior: <b>${product.stock}</b><br/>
              Nuevo stock: <b>${updated.stock}</b><br/>
            </p>
          `,
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error ajustando stock:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo aplicar el ajuste de stock.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ajustar stock
            </h3>
            <p className="text-sm text-gray-500">
              {product.name} — {product.category || "Sin categoría"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Info actual */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Stock actual</p>
              <p className="text-lg font-semibold text-gray-900">
                {product.stock}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Stock mínimo</p>
              <p className="text-lg font-semibold text-gray-900">
                {product.minStock}
              </p>
            </div>
          </div>

          {/* Nuevo stock */}
          <div className="space-y-1">
            <label
              htmlFor="nuevoStock"
              className="text-sm font-medium text-gray-700"
            >
              Nuevo stock
            </label>
            <input
              id="nuevoStock"
              name="nuevoStock"
              type="number"
              min="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value)}
              required
            />
          </div>

          {/* Nota */}
          <div className="space-y-1">
            <label
              htmlFor="nota"
              className="text-sm font-medium text-gray-700"
            >
              Nota del movimiento
            </label>
            <textarea
              id="nota"
              name="nota"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Ej: Ajuste por conteo físico, corrección, producto dañado, etc."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
            <p className="text-xs text-gray-400">
              Esta nota se guardará en la tabla de ajustes de inventario.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-2 pb-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Aplicar ajuste"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModal;
