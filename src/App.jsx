import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import RegisterProduct from "./pages/RegisterProduct";
import ModifyProduct from "./pages/ModifyProduct";
import Support from "./pages/Support";
import Reports from "./pages/Reports";
import ActivityHistory from "./pages/ActivityHistory";
import StockPage from "./pages/StockPage";

import "@fontsource/merriweather";

// Función para obtener el rol del usuario
const getUserRole = () => localStorage.getItem("role");

// Componente para proteger rutas
const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <div
        style={{
          backgroundColor: "#fae1dd",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas para usuario normal */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["user", "admin"]} />} />
          <Route path="/register-product" element={<ProtectedRoute element={<RegisterProduct />} allowedRoles={["user", "admin"]} />} />
          <Route path="/stock" element={<ProtectedRoute element={<StockPage />} allowedRoles={["user", "admin"]} />} />
          <Route path="/support" element={<ProtectedRoute element={<Support />} allowedRoles={["user", "admin"]} />} />

          {/* Rutas exclusivas para admin */}
          <Route path="/modify-product" element={<ProtectedRoute element={<ModifyProduct />} allowedRoles={["admin"]} />} />
          <Route path="/activity-history" element={<ProtectedRoute element={<ActivityHistory />} allowedRoles={["admin"]} />} />
          <Route path="/reports" element={<ProtectedRoute element={<Reports />} allowedRoles={["admin"]} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
