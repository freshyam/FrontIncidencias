import { useState, useEffect, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { Eye, EyeOff, Shield, User, Lock } from "lucide-react";
import Loading from "../../components/shared/Loading";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";

const INICIO_SESION = gql`
  mutation LoginUser($input: userLoginInput) {
    loginUser(input: $input) {
      token
    }
  }
`;

const LoginForm = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [vContraseña, setVContraseña] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const [iniciarSesion, { loading }] = useMutation(INICIO_SESION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await iniciarSesion({
        variables: {
          input: {
            usuario,
            password: contraseña,
          },
        },
      });

      if (resp?.data?.loginUser?.token) {
        login(resp.data.loginUser);
        navigate("/");
      } else {
        Swal.fire({
          title: "Credenciales inválidas",
          text: "Revisa tu usuario o contraseña.",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#166534",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Ha ocurrido un error",
        text: "Inténtalo más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#166534",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">Cargando</h1>
        <Loading variant="wave" size="lg" color="green" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-blue from-gray-50 via-blue-50 to-white p-4 overflow-hidden">
      {/* blobs decorativos */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-200/40 blur-3xl animate-[float_6s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-56 h-56 rounded-full bg-sky-200/40 blur-3xl animate-[float_7s_ease-in-out_infinite] [animation-delay:1s]" />

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-emerald-100/60 bg-white/90 backdrop-blur-sm shadow-xl">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-blue-600 from-blue-600 to-blue-400 flex items-center justify-center shadow-md">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Sistema de Gestión
          </h1>
          <p className="mt-1 text-gray-500">Incidentes e Inventario</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {/* Usuario */}
          <div className="space-y-2">
            <label
              htmlFor="usuario"
              className="text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Ingresa tu usuario"
                className="h-11 w-full rounded-md border border-gray-300 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <label
              htmlFor="contraseña"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="contraseña"
                name="contraseña"
                type={vContraseña ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className="h-11 w-full rounded-md border border-gray-300 pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={() => setVContraseña((v) => !v)}
                aria-label={vContraseña ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {vContraseña ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          

          {/* Botón */}
          <button
            type="submit"
            className="w-full h-11 rounded-md text-white font-semibold shadow-md bg-blue-600  hover:opacity-95 focus:outline-none focus:ring-2 transition"
          >
            Iniciar sesión
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginForm;
