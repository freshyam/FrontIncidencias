import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, AlertCircle, Package, LogOut, Shield } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

// mini util para clases (evita depender de "@/lib/utils")
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/incidentes", label: "Incidentes", icon: AlertCircle },
  { to: "/inventario", label: "Inventario", icon: Package },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  return (
    <nav className="sticky top-0 z-40  bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sistema de Soporte</span>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User / Logout */}
          <div className="flex items-center gap-3">
            {user?.nombre && (
              <span className="hidden sm:inline text-sm text-gray-600">
                Hola, <b className="text-gray-900">{user.nombre}</b>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-300 transition"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Links móviles (scroll-x) */}
        <div className="sm:hidden pb-2 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
