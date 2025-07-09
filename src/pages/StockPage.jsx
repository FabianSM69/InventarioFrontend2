// src/pages/StockPage.jsx
import React, { useState, useEffect } from "react";
import axios from '../api';
import { Link } from "react-router-dom";

function StockPage() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [conteoFisico, setConteoFisico] = useState({});

  // 1) Recuperar el rol al montar
  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  // 2) Cargar la lista de productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('/getproductos');
        setProductos(response.data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No se pudo cargar los productos.");
      }
    };
    fetchProductos();
  }, []);

  // 3) Función para traer el conteo físico y guardarlo en el estado
  const fetchConteoFisico = async () => {
    try {
      const response = await axios.get('/getconteofisico');
      const conteo = {};
      response.data.forEach(item => {
        // item: { producto_id, cantidad_contada }
        conteo[item.producto_id] = item.cantidad_contada;
      });
      setConteoFisico(conteo);
    } catch (err) {
      console.error("Error al obtener conteo físico:", err);
    }
  };

  // 4) Arrancar initial fetch + polling cada 2 segundos
  useEffect(() => {
    fetchConteoFisico();
    const intervalo = setInterval(fetchConteoFisico, 2000);
    return () => clearInterval(intervalo);
  }, []);

  // 5) Calcular diferencia de stock
  const calcularDiferencia = (id, registrado) => {
    const fisico = parseInt(conteoFisico[id] || 0, 10);
    const reg    = parseInt(registrado, 10);
    if (isNaN(fisico) || isNaN(reg)) return "Dato inválido";
    const diff = fisico - reg;
    if (diff > 0)  return `+${diff} sobrante`;
    if (diff < 0)  return `${Math.abs(diff)} faltante`;
    return "Correcto";
  };

  return (
    <>
      <div
        className="container-fluid d-flex"
        style={{ backgroundColor: "#fae1dd", minHeight: "100vh" }}
      >
        {/* Sidebar */}
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
            zIndex: 1000
          }}
        >
          <h3 className="mb-4">Menú</h3>
          <Link to="/dashboard"         className="btn btn-primary mb-3 w-100">Dashboard</Link>
          <Link to="/register-product"  className="btn btn-success mb-3 w-100">Registrar Producto</Link>
          <Link to="/stock"             className="btn btn-dark mb-3 w-100">Stock</Link>
          <Link to="/support"           className="btn btn-secondary mb-3 w-100">Soporte</Link>
          {role === "admin" && (
            <>
              <Link to="/reports"           className="btn btn-danger mb-3 w-100">Reportes</Link>
              <Link to="/activity-history"  className="btn btn-info mb-3 w-100">Historial</Link>
              <Link to="/modify-product"    className="btn btn-warning mb-3 w-100">Modificar Producto</Link>
            </>
          )}
          <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
        </div>

        {/* Header */}
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
            zIndex: 999
          }}
        >
          <h2>STOCK DE PRODUCTOS</h2>
        </div>

        {/* Main content */}
        <div
          className="flex-grow-1 p-4"
          style={{ marginLeft: "250px", marginTop: "120px" }}
        >
          {error && <div className="alert alert-danger">{error}</div>}

          <h4 className="text-center">Comparación de Stock</h4>
          <table className="table table-bordered mt-3">
            <thead style={{ backgroundColor: "#000", color: "white" }}>
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
    </>
  );
}

export default StockPage;
