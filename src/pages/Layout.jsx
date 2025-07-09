import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const storedState = localStorage.getItem("menuOpen");
    if (storedState !== null) {
      setMenuOpen(storedState === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  return (
    <div className="container-fluid d-flex" style={{ backgroundColor: "#fae1dd", minHeight: "100vh" }}>
      {/* Menú lateral */}
      <div
        className="d-flex flex-column align-items-start p-3"
        style={{
          backgroundColor: "#343a40",
          color: "white",
          width: "250px",
          height: "100vh",
          overflowY: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
        }}
      >
        <h3
          className="mb-4"
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menú {menuOpen ? "▲" : "▼"}
        </h3>

        <div
          style={{
            overflow: "hidden",
            transition: "max-height 0.4s ease",
            maxHeight: menuOpen ? "1000px" : "0",
            width: "100%"
          }}
        >
          <Link to="/dashboard" className="btn btn-primary mb-3 w-100">Dashboard</Link>
          <Link to="/register-product" className="btn btn-success mb-3 w-100">Registrar Producto</Link>
          <Link to="/modify-product" className="btn btn-warning mb-3 w-100">Modificar Producto</Link>
          <Link to="/reports" className="btn btn-danger mb-3 w-100">Reportes</Link>
          <Link to="/activity-history" className="btn btn-info mb-3 w-100">Historial</Link>
          <Link to="/support" className="btn btn-secondary mb-3 w-100">Soporte</Link>
          <Link to="/stock" className="btn btn-dark mb-3 w-100">Stock</Link>
          <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
