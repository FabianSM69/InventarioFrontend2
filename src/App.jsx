// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "@fontsource/merriweather";
import "bootstrap/dist/css/bootstrap.min.css";

import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Layout           from "./components/Layout";

import Dashboard        from "./pages/Dashboard";
import StockPage        from "./pages/StockPage";
import Support          from "./pages/Support";
import RegisterProduct  from "./pages/RegisterProduct";
import ModifyProduct    from "./pages/ModifyProduct";
import ActivityHistory  from "./pages/ActivityHistory";
import Reports          from "./pages/Reports";
import Profile          from "./pages/Profile";

// Saco el role desde localStorage
const getUserRole = () => localStorage.getItem("role");

// Ruta protegida: si no hay token/role o no coincide → redirige
function ProtectedRoute({ element, allowedRoles }) {
  const role = getUserRole();
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return element;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout envuelve todas estas rutas */}
        <Route path="/" element={<Layout />}>
          {/* Al entrar a “/” vamos a “/dashboard” */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<Dashboard />}
                allowedRoles={["user","admin","superadmin"]}
              />
            }
          />

          <Route
            path="stock"
            element={
              <ProtectedRoute
                element={<StockPage />}
                allowedRoles={["user","admin","superadmin"]}
              />
            }
          />

          <Route
            path="support"
            element={
              <ProtectedRoute
                element={<Support />}
                allowedRoles={["user","admin","superadmin"]}
              />
            }
          />

          <Route
            path="register-product"
            element={
              <ProtectedRoute
                element={<RegisterProduct />}
                allowedRoles={["user","admin","superadmin"]}
              />
            }
          />

          <Route
            path="modify-product"
            element={
              <ProtectedRoute
                element={<ModifyProduct />}
                allowedRoles={["admin","superadmin"]}
              />
            }
          />

          <Route
            path="activity-history"
            element={
              <ProtectedRoute
                element={<ActivityHistory />}
                allowedRoles={["admin","superadmin"]}
              />
            }
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<Reports />}
                allowedRoles={["admin","superadmin"]}
              />
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute
                element={<Profile />}
                allowedRoles={["user","admin","superadmin"]}
              />
            }
          />
        </Route>

        {/* Cualquier otra ruta la redirige a /dashboard o /login según corresponda */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
