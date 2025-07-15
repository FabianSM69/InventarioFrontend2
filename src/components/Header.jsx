// src/components/Header.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function Header({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const titleMap = {
    "/dashboard":        "Dashboard",
    "/stock":            "Stock",
    "/support":          "Soporte",
    "/register-product": "Registrar Producto",
    "/modify-product":   "Modificar Producto",
    "/activity-history": "Historial",
    "/reports":          "Reportes",
    "/profile":          "Mi Perfil",
  };
  const title = titleMap[location.pathname] || "";

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="toggle-sidebar-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? "←" : "→"}
        </button>
      </div>

      <div className="header-center">
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-right">
        <img
          src={logo}
          alt="InvenStock"
          className="app-logo"
          onClick={() => navigate("/dashboard")}
        />
      </div>
    </header>
  );
}
