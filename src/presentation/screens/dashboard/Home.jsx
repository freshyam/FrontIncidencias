// src/presentation/screens/dashboard/Dashboard.jsx
import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// 🔹 Query de incidentes (reusa lo que ya tienes en Incidentes)
const GET_INCIDENTS = gql`
  query GetIncidents {
    GetIncidents {
      id
      titulo
      prioridad
      status
      fecha
    }
  }
`;

// 🔹 Query de inventario (la misma que usas en Inventory)
const GET_INVENTORY = gql`
  query GetInventory {
    GetInventory {
      id
      nombre
      categoria
      status
      stockActual
      stockMinimo
    }
  }
`;

// 🔹 Normalizar status (num/string → 0/1/2)
const getNumericStatus = (status) => {
  if (typeof status === "number") return status;
  const value = String(status).toLowerCase();
  if (value === "abierto") return 1;
  if (value === "en_proceso") return 2;
  if (value === "resuelto") return 0;
  return Number(status) || 0;
};

const getStatusBadge = (status) => {
  const num = getNumericStatus(status);

  if (num === 1) {
    return {
      label: "Abierto",
      className:
        "bg-red-100 text-red-700 border border-red-200",
    };
  }
  if (num === 2) {
    return {
      label: "En proceso",
      className:
        "bg-amber-100 text-amber-700 border border-amber-200",
    };
  }
  // 0 resuelto
  return {
    label: "Resuelto",
    className:
      "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
};

const getPriorityBadge = (priority) => {
  const value = String(priority || "").toLowerCase();

  if (value === "alta" || value === "3") {
    return {
      label: "Alta",
      className:
        "bg-red-50 text-red-700 border border-red-200",
    };
  }
  if (value === "media" || value === "2") {
    return {
      label: "Media",
      className:
        "bg-amber-50 text-amber-700 border border-amber-200",
    };
  }
  return {
    label: "Baja",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
};

// 🔹 Tarjeta pequeña de stats
const StatCard = ({ title, value, icon: Icon, accentClass, description }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex items-center gap-4">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center ${accentClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-500">
          {title}
        </span>
        <span className="text-2xl font-bold text-gray-900">
          {value}
        </span>
        {description && (
          <span className="text-xs text-gray-400 mt-1">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const {
    data: incidentsData,
    loading: loadingIncidents,
    error: errorIncidents,
  } = useQuery(GET_INCIDENTS);

  const {
    data: inventoryData,
    loading: loadingInventory,
    error: errorInventory,
  } = useQuery(GET_INVENTORY);

  const incidents = incidentsData?.GetIncidents || [];
  const products = inventoryData?.GetInventory || [];

  // 🔹 Contadores de estados
  const { abiertos, enProceso, resueltosMes } = useMemo(() => {
    let abiertos = 0;
    let enProceso = 0;
    let resueltosMes = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    incidents.forEach((inc) => {
      const numStatus = getNumericStatus(inc.status);

      if (numStatus === 1) abiertos++;
      else if (numStatus === 2) enProceso++;
      else if (numStatus === 0) {
        // contar solo resueltos del mes actual
        if (inc.fecha) {
          const d = new Date(inc.fecha);
          if (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          ) {
            resueltosMes++;
          }
        } else {
          // si no tuvieras fecha, igual lo cuentas
          resueltosMes++;
        }
      }
    });

    return { abiertos, enProceso, resueltosMes };
  }, [incidents]);

  // 🔹 Productos con stock bajo/crítico
  const lowStockItems = useMemo(() => {
    return products.filter(
      (p) => p.stockActual <= p.stockMinimo
    );
  }, [products]);

  // 🔹 Incidentes recientes (top 3)
  const recentIncidents = useMemo(() => {
    return incidents.slice(0, 3);
  }, [incidents]);

  if (loadingIncidents || loadingInventory) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-600">
          Cargando datos del dashboard...
        </p>
      </div>
    );
  }

  if (errorIncidents) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-600">
          Error al cargar incidentes: {errorIncidents.message}
        </p>
      </div>
    );
  }

  if (errorInventory) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-600">
          Error al cargar inventario: {errorInventory.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Dashboard de Soporte
        </h1>
        <p className="text-sm text-gray-500">
          Vista general de incidentes e inventario
        </p>
      </div>

      {/* Cards de stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Incidentes Abiertos"
          value={abiertos}
          icon={AlertCircle}
          accentClass="bg-red-100 text-red-700"
        />
        <StatCard
          title="En Proceso"
          value={enProceso}
          icon={Clock}
          accentClass="bg-amber-100 text-amber-700"
        />
        <StatCard
          title="Resueltos (mes)"
          value={resueltosMes}
          icon={CheckCircle}
          accentClass="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          title="Productos Bajo Stock"
          value={lowStockItems.length}
          icon={TrendingUp}
          accentClass="bg-amber-100 text-amber-700"
          description="Requieren reabastecimiento"
        />
      </div>

      {/* Dos columnas: incidentes recientes + alertas inventario */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Incidentes recientes */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Incidentes recientes
                </h2>
                <p className="text-xs text-gray-500">
                  Últimos tickets reportados
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 space-y-4">
            {recentIncidents.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay incidentes registrados aún.
              </p>
            )}

            {recentIncidents.map((incident) => {
              const statusBadge = getStatusBadge(
                incident.status
              );
              const priorityBadge = getPriorityBadge(
                incident.prioridad
              );

              return (
                <div
                  key={incident.id}
                  className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      {incident.titulo}
                    </p>
                    <div className="flex gap-2 items-center flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityBadge.className}`}
                      >
                        {priorityBadge.label}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-3 whitespace-nowrap">
                    {incident.fecha
                      ? incident.fecha.slice(0, 10)
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas de inventario */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Alertas de inventario
                </h2>
                <p className="text-xs text-gray-500">
                  Productos con stock bajo o crítico
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 space-y-4">
            {lowStockItems.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay productos con stock bajo. Todo bajo
                control 
              </p>
            )}

            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">
                    {item.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock actual:{" "}
                    <span className="text-red-600 font-semibold">
                      {item.stockActual}
                    </span>{" "}
                    / Mínimo: {item.stockMinimo}
                  </p>
                  {item.categoria && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.categoria}
                    </p>
                  )}
                </div>
                <Package className="h-5 w-5 text-amber-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
