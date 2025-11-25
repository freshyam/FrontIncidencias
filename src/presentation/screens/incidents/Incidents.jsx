
import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Plus } from "lucide-react";
import NewIncidentModal from "../../components/incidents/NewIncidentModal";
import IncidentsTable from "../../components/incidents/IncidentsTable";

const GET_INCIDENTS = gql`
  query GetIncidents {
    GetIncidents {
      id
      titulo
      descripcion
      reporta
      prioridad
      status
      fecha
      idAgente
      agente
    }
  }
`;

const CREATE_INCIDENT = gql`
  mutation CreateIncident($input: IncidentInput!) {
    CreateIncident(input: $input) {
      agente
      descripcion
      fecha
      id
      idAgente
      prioridad
      reporta
      status
      titulo
    }
  }
`;


const UPDATE_INCIDENT_STATUS = gql`
  mutation UpdateIncidentStatus($id: ID!, $status: Int!) {
    UpdateIncidentStatus(id: $id, status: $status) {
      id
      status
      fecha
    }
  }
`;

const Incidentes = () => {
  const { data, loading, error } = useQuery(GET_INCIDENTS);

  const [createIncident, { loading: creatingIncident }] = useMutation(
    CREATE_INCIDENT
  );

  const [updateIncidentStatus] = useMutation(UPDATE_INCIDENT_STATUS);

  const [open, setOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [updatingId, setUpdatingId] = useState(null); 

  useEffect(() => {
    if (data?.GetIncidents) {
      setIncidents(data.GetIncidents);
    }
  }, [data]);

  const handleCreateIncident = async (formValues) => {
    try {
      const { data } = await createIncident({
        variables: { input: formValues },
      });

      if (data?.CreateIncident) {
        setIncidents((prev) => [data.CreateIncident, ...prev]);
        return data.CreateIncident;
      }
    } catch (err) {
      console.error("Error creando incidente:", err);
      throw err;
    }
  };


  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === id ? { ...inc, status: newStatus } : inc
        )
      );

      await updateIncidentStatus({
        variables: { id, status: newStatus },
      });
    } catch (err) {
      console.error("Error actualizando estado:", err);
      
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !incidents.length) {
    return (
      <div className="px-4 py-8 max-w-6xl mx-auto">
        <p className="text-gray-600">Cargando incidentes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 max-w-6xl mx-auto">
        <p className="text-red-600">
          Error al cargar incidentes: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Incidentes
          </h1>
          <p className="text-gray-500 text-sm">
            Registra y da seguimiento a los tickets de soporte
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <Plus className="h-4 w-4" />
          Nuevo incidente
        </button>
      </div>

      {/* Tabla con acciones */}
      <IncidentsTable
        incidents={incidents}
        onStatusChange={handleStatusChange}
        updatingId={updatingId}
      />

      {/* Modal */}
      <NewIncidentModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreateIncident}
        loading={creatingIncident}
      />
    </div>
  );
};

export default Incidentes;
