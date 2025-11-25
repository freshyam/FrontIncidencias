// src/presentation/components/inventory/Adjustment.jsx
import React, { useState, useMemo, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_AJUSTES_INVENTARIO = gql`
  query GetAjustesInventario {
    GetAjustesInventario {
      id
      idUsuario
      idProducto
      fecha
      agente
      nombreProducto
      nota
      nuevoStock
      stock
    }
  }
`;

const PAGE_SIZE = 10;

const AdjustmentModal = ({ open, onClose }) => {
  // La query se dispara solo si el modal está abierto
  const { data, loading, error } = useQuery(GET_AJUSTES_INVENTARIO, {
    skip: !open,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const ajustes = data?.GetAjustesInventario || [];
  const totalItems = ajustes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // Asegurar que la página actual no se salga de rango cuando cambie la data
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAjustes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return ajustes.slice(start, end);
  }, [ajustes, currentPage]);

  const getDiffInfo = (stock, nuevoStock) => {
    const diff = Number(nuevoStock) - Number(stock);
    if (diff === 0) {
      return { label: "0", className: "text-gray-500" };
    }
    if (diff > 0) {
      return {
        label: `+${diff}`,
        className: "text-emerald-600 font-semibold",
      };
    }
    return {
      label: `${diff}`,
      className: "text-red-600 font-semibold",
    };
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);

  // 👇 OJO: el return condicional va HASTA ABAJO de los hooks
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-5xl max-h-[85vh] rounded-xl bg-white shadow-lg border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Historial de ajustes de inventario
            </h3>
            <p className="text-sm text-gray-500">
              Movimientos de stock registrados (alta, baja y correcciones).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="p-6">
              <p className="text-sm text-gray-600">
                Cargando historial de ajustes...
              </p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <p className="text-sm text-red-600">
                Error al cargar ajustes: {error.message}
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Stock anterior
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Nuevo stock
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Diferencia
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Nota
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {paginatedAjustes.map((aj) => {
                      const diffInfo = getDiffInfo(aj.stock, aj.nuevoStock);

                      return (
                        <tr key={aj.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                            {aj.fecha}
                          </td>
                          <td className="px-4 py-3 text-gray-900 font-medium">
                            {aj.nombreProducto}{" "}
                           
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {aj.stock}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {aj.nuevoStock}
                          </td>
                          <td className="px-4 py-3">
                            <span className={diffInfo.className}>
                              {diffInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 max-w-xs">
                            {aj.nota ? (
                              <span className="line-clamp-2">{aj.nota}</span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {aj.agente || (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {ajustes.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-6 text-center text-sm text-gray-500"
                        >
                          No hay ajustes de inventario registrados todavía.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginado */}
              {ajustes.length > 0 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 text-xs text-gray-600">
                  <p>
                    Mostrando{" "}
                    <span className="font-semibold">
                      {startItem}–{endItem}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold">{totalItems}</span>{" "}
                    ajustes
                  </p>

                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    <span>
                      Página{" "}
                      <span className="font-semibold">{currentPage}</span> de{" "}
                      <span className="font-semibold">{totalPages}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(totalPages, p + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer: botón cerrar */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentModal;
