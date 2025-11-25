
import React from "react";

const NewIncidentModal = ({ open, onClose, onCreate, loading = false }) => {
  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onCreate) return;

   
    const form = e.currentTarget;
    const formData = new FormData(form);

    const input = {
      titulo: formData.get("titulo")?.trim(),
      descripcion: formData.get("descripcion")?.trim(),
      prioridad: formData.get("prioridad"),
      reporta: formData.get("reporta")?.trim(),
      status: 1, 
    };

    try {
      await onCreate(input); // el padre hace la mutation
      form.reset();          // ahora sí, form nunca es null
      onClose();
    } catch (err) {
      console.error("Error al crear incidente:", err);
      // aquí podrías mostrar un toast si quieres
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Registrar nuevo incidente
            </h3>
            <p className="text-sm text-gray-500">
              Completa la información del incidente
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
            type="button"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="titulo"
              className="text-sm font-medium text-gray-700"
            >
              Título del incidente
            </label>
            <input
              id="titulo"
              name="titulo"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Ej: Error en impresora..."
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="descripcion"
              className="text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Describe el problema en detalle..."
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="prioridad"
                className="text-sm font-medium text-gray-700"
              >
                Prioridad
              </label>
              <select
                id="prioridad"
                name="prioridad"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                defaultValue=""
                required
                disabled={loading}
              >
                <option value="" disabled>
                  Selecciona prioridad
                </option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="reporta"
                className="text-sm font-medium text-gray-700"
              >
                Reportado por
              </label>
              <input
                id="reporta"
                name="reporta"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Nombre del usuario"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Registrar incidente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIncidentModal;
