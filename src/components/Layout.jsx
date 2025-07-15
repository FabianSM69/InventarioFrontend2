// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // recupera estado de localStorage si lo deseas
  useEffect(() => {
    const stored = localStorage.getItem("menuOpen");
    if (stored != null) setSidebarOpen(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("menuOpen", sidebarOpen);
  }, [sidebarOpen]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    // Si guardas algo más, elimínalo aquí
    navigate("/login", { replace: true });
  };

const titleMap = {
    "/dashboard": "Dashboard",
    "/stock":     "Stock",
    "/support":   "Soporte",
    "/profile":   "Mi Perfil",
    "/register-product": "Registrar Producto",
    "/modify-product":   "Modificar Producto",
    "/activity-history": "Historial de Actividad",
    "/reports":          "Reportes",
    // …añade aquí todas tus rutas
  };
  const title = titleMap[location.pathname] || "";
  const toggleSidebar = () => {
    setSidebarOpen(o => !o);
  };

  return (
    <div className="app-page" style={{ minHeight: "100vh" }}>
      {/* Sidebar fijo */}
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />

      {/* Header fijo */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido dinámico */}
      <main
        style={{
          marginTop: 80,                // deja espacio para el header
          marginLeft: sidebarOpen ? 250 : 0,
          padding: "1rem",
          transition: "margin-left 0.3s ease"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
