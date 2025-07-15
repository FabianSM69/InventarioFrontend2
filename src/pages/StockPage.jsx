// src/pages/StockPage.jsx

import React, { useState, useEffect } from "react";
import axios from "../api";
import { Link } from "react-router-dom";

function StockPage() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [conteoFisico, setConteoFisico] = useState({});
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // 1) Recuperar el rol al montar
  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  // 2) Cargar la lista de productos
  useEffect(() => {
    axios.get("/getproductos")
      .then(resp => setProductos(resp.data))
      .catch(err => {
        console.error("Error al obtener productos:", err);
        setError("No se pudo cargar los productos.");
      });
  }, []);

  // 3) Función para traer el conteo físico y guardarlo en el estado
  const fetchConteoFisico = () => {
    axios.get("/getconteofisico")
      .then(resp => {
        const c = {};
        resp.data.forEach(item => {
          c[item.producto_id] = item.cantidad_contada;
        });
        setConteoFisico(c);
      })
      .catch(err => console.error("Error al obtener conteo físico:", err));
  };

  // 4) Arrancar polling cada 2 segundos
  useEffect(() => {
    fetchConteoFisico();
    const id = setInterval(fetchConteoFisico, 2000);
    return () => clearInterval(id);
  }, []);

  // 5) Calcular diferencia de stock
  const calcularDiferencia = (id, registrado) => {
    const fisico = parseInt(conteoFisico[id] || 0, 10);
    const reg = parseInt(registrado, 10);
    if (isNaN(fisico) || isNaN(reg)) return "Dato inválido";
    const diff = fisico - reg;
    if (diff > 0) return `+${diff} sobrante`;
    if (diff < 0) return `${Math.abs(diff)} faltante`;
    return "Correcto";
  };

  return (
    <div className="d-flex app-page" style={{ minHeight: "100vh" }}>
      

     
        
         

        {/* Espacio bajo el header */}
        <div style={{ height: "100px" }} />

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Tabla de comparación */}
        <h4 className="text-center section-title" style={{ marginBottom: "1rem" }}>
          Comparación de Stock
        </h4>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead style={{ backgroundColor: "var(--primary-dark)", color: "white" }}>
              <tr>
                <th>Nombre</th>
                <th>Cantidad Registrada</th>
                <th>Conteo Físico</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(prod => (
                <tr key={prod.id}>
                  <td>{prod.nombre}</td>
                  <td>{prod.cantidad_total}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={conteoFisico[prod.id] || ""}
                      disabled
                    />
                  </td>
                  <td>{calcularDiferencia(prod.id, prod.cantidad_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
   
  );
}

export default StockPage;
