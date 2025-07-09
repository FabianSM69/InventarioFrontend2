import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from '../api';

function Dashboard() {
  const [imageIndex, setImageIndex] = useState(0);
  const [role, setRole] = useState(null);

  const images = [
    "/imagenes/Bienvenido.png",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <div
      className="container-fluid d-flex"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Menú lateral */}
      <div
        className="d-flex flex-column align-items-start p-3"
        style={{
          backgroundColor: "#343a40",
          color: "white",
          width: "250px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          overflowY: "auto"
        }}
      >
        <h3 className="mb-4">Menú</h3>

        <Link to="/register-product" className="btn btn-success mb-3 w-100">
          Registrar Producto
        </Link>

        {role === "admin" && (
          <>
            <Link to="/modify-product" className="btn btn-warning mb-3 w-100">
              Modificar Producto
            </Link>
            <Link to="/reports" className="btn btn-info mb-3 w-100">
              Ver Reportes
            </Link>
            <Link to="/activity-history" className="btn btn-primary mb-3 w-100">
              Historial de Actividad
            </Link>
          </>
        )}

        <Link to="/support" className="btn btn-light mb-3 w-100">
          Soporte
        </Link>
        <Link to="/stock" className="btn btn-dark mb-3 w-100">
          Stock
        </Link>
        <Link to="/" className="btn btn-danger w-100">
          Cerrar Sesión
        </Link>
      </div>

      {/* Barra superior */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 250,
          right: 0,
          height: "80px",
          backgroundColor: "#343a40",
          color: "white",
          zIndex: 999,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2
          className="text-center"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "26px",
            letterSpacing: "1px",
            margin: 0
          }}
        >
          DASHBOARD
        </h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "120px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            padding: "30px",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#2c3e50",
          }}>
            ¡Bienvenido al Panel de Inventario!
          </h2>

          <p style={{
            fontSize: "18px",
            color: "#555",
            marginTop: "10px",
            marginBottom: "30px",
          }}>
            Gestiona entradas, salidas y stock de productos de forma fácil y eficiente.
          </p>

          <img
            src={images[imageIndex]}
            alt="Bienvenida"
            style={{ width: "100%", maxWidth: "500px", height: "auto", marginBottom: "20px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
