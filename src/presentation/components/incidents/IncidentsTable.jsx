// src/presentation/components/incidents/IncidentsTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Search, Filter, Play, Check, RotateCcw } from "lucide-react";

const getStatusBadge = (status) => {
  const value =
    typeof status === "number" ? status : String(status).toLowerCase();

  if (value === 1 || value === "abierto") {
    return {
      label: "Abierto",
      className: "bg-red-100 text-red-700 border border-red-200",
    };
  }
  if (value === 2 || value === "en_proceso") {
    return {
      label: "En proceso",
      className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    };
  }
  if (value === 0 || value === "resuelto") {
    return {
      label: "Resuelto",
      className: "bg-green-100 text-green-700 border border-green-200",
    };
  }
  return {
    label: String(status),
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  };
};

const getPriorityBadge = (priority) => {
  const value = String(priority || "").toLowerCase();
  if (value === "alta" || value === "3") {
    return {
      label: "Alta",
      className: "bg-red-50 text-red-700 border border-red-200",
    };
  }
  if (value === "media" || value === "2") {
    return {
      label: "Media",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    };
  }
  return {
    label: "Baja",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
};

// helper para normalizar status a número
const getNumericStatus = (status) => {
  if (typeof status === "number") return status;
  const value = String(status).toLowerCase();
  if (value === "abierto") return 1;
  if (value === "en_proceso") return 2;
  if (value === "resuelto") return 0;
  return Number(status) || 0;
};

const renderActions = (incident, numericStatus, onStatusChange, isUpdating) => {
  if (!onStatusChange) return null;

  // 1 = abierto, 2 = en proceso, 0 = resuelto
  if (numericStatus === 1) {
    // Abierto → Tomar (2) y Finalizar (0)
    return (
      <div className="flex flex-wrap justify-end gap-1">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onStatusChange(incident.id, 2)}
          className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Play className="h-3 w-3" />
          Tomar
        </button>
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onStatusChange(incident.id, 0)}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Check className="h-3 w-3" />
          Finalizar
        </button>
      </div>
    );
  }

  if (numericStatus === 2) {
    // En proceso → Finalizar (0)
    return (
      <div className="flex justify-end">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onStatusChange(incident.id, 0)}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Check className="h-3 w-3" />
          Finalizar
        </button>
      </div>
    );
  }

  // 0 = resuelto → opcional: Reabrir (1)
  return (
    <div className="flex justify-end">
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => onStatusChange(incident.id, 1)}
        className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600 border border-gray-200 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RotateCcw className="h-3 w-3" />
        Reabrir
      </button>
    </div>
  );
};

const IncidentsTable = ({ incidents, onStatusChange, updatingId }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // resetear a la página 1 cuando cambia la búsqueda
  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredIncidents = useMemo(() => {
    if (!search.trim()) return incidents;
    const q = search.toLowerCase();
    return incidents.filter((inc) =>
      [
        inc.titulo,
        inc.descripcion,
        inc.reporta,
        inc.agente,
        inc.prioridad,
        inc.status,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [incidents, search]);

  const totalItems = filteredIncidents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIncidents.slice(start, start + pageSize);
  }, [filteredIncidents, currentPage, pageSize]);

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header card + filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">
          Lista de incidentes ({totalItems})
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar incidentes..."
              className="h-9 w-64 rounded-md border border-gray-300 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
          </button>
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
                Título / Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reportado por
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Agente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Prioridad
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Fecha
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedIncidents.map((incident) => {
              const statusBadge = getStatusBadge(incident.status);
              const priorityBadge = getPriorityBadge(incident.prioridad);
              const numericStatus = getNumericStatus(incident.status);
              const isUpdating = updatingId === incident.id;

              return (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{incident.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {incident.titulo}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {incident.descripcion}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {incident.reporta}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {incident.agente || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityBadge.className}`}
                    >
                      {priorityBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {incident.fecha?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    {renderActions(
                      incident,
                      numericStatus,
                      onStatusChange,
                      isUpdating
                    )}
                  </td>
                </tr>
              );
            })}

            {paginatedIncidents.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No hay incidentes que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 text-xs text-gray-600">
        <div>
          {totalItems > 0 ? (
            <span>
              Mostrando{" "}
              <span className="font-semibold">
                {startItem}-{endItem}
              </span>{" "}
              de <span className="font-semibold">{totalItems}</span>{" "}
              incidentes
            </span>
          ) : (
            <span>No hay registros</span>
          )}
        </div>

        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span>
            Página{" "}
            <span className="font-semibold">
              {currentPage}
            </span>{" "}
            de{" "}
            <span className="font-semibold">
              {totalPages}
            </span>
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages || totalItems === 0}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentsTable;
