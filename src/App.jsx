// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "@fontsource/merriweather";
import "bootstrap/dist/css/bootstrap.min.css";

import Home            from "./pages/Home";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Layout          from "./components/Layout";

import Dashboard       from "./pages/Dashboard";
import StockPage       from "./pages/StockPage";
import Support         from "./pages/Support";
import RegisterProduct from "./pages/RegisterProduct";
import ModifyProduct   from "./pages/ModifyProduct";
import ActivityHistory from "./pages/ActivityHistory";
import Reports         from "./pages/Reports";
import Profile         from "./pages/Profile";

// lee role/token
const getUserRole = () => localStorage.getItem("role");

// ruta protegida
function ProtectedRoute({ children, allowedRoles }) {
  const role = getUserRole();
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 1. Landing pública */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* 2. Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3. Rutas del sistema bajo /app */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["user","admin","superadmin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="stock"
            element={
              <ProtectedRoute allowedRoles={["user","admin","superadmin"]}>
                <StockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="support"
            element={
              <ProtectedRoute allowedRoles={["user","admin","superadmin"]}>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="register-product"
            element={
              <ProtectedRoute allowedRoles={["user","admin","superadmin"]}>
                <RegisterProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="modify-product"
            element={
              <ProtectedRoute allowedRoles={["admin","superadmin"]}>
                <ModifyProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="activity-history"
            element={
              <ProtectedRoute allowedRoles={["admin","superadmin"]}>
                <ActivityHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["admin","superadmin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={["user","admin","superadmin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 4. Alias: redirige rutas “planas” al prefijo /app */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/stock"     element={<Navigate to="/app/stock" replace />} />
        <Route path="/support"   element={<Navigate to="/app/support" replace />} />
        <Route path="/register-product" element={<Navigate to="/app/register-product" replace />} />
        <Route path="/modify-product"   element={<Navigate to="/app/modify-product" replace />} />
        <Route path="/activity-history" element={<Navigate to="/app/activity-history" replace />} />
        <Route path="/reports"          element={<Navigate to="/app/reports" replace />} />
        <Route path="/profile"          element={<Navigate to="/app/profile" replace />} />

        {/* 5. Cualquier otra ruta → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
