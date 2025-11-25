import { Route, Routes, useLocation } from "react-router-dom";
import LoginForm from "../screens/auth/Login";
import Home from "../screens/dashboard/Home";
import Incidents from "../screens/incidents/Incidents";
import Inventory from "../screens/inventory/Inventory";
import Navbar from "../components/shared/Navbar";
import ProtectedRoutes from "./guards/ProtectedRoutes";

const MainNavigation = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/Login"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen flex-col">
      {!shouldHideNavbar && <Navbar />}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/Login" element={<LoginForm />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/incidentes" element={<Incidents />} />
            <Route path="/inventario" element={<Inventory />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default MainNavigation;
