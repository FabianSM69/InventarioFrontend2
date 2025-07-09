import React, { useState, useEffect } from "react";
import axios from '../api';
import { Link } from "react-router-dom";

function ModifyProduct() {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("/getproductos");
        setProductos(response.data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No se pudo cargar los productos.");
      }
    };

    fetchProductos();
  }, []);

  const handleModify = async (e) => {
    e.preventDefault();

    if (!selectedProducto || !cantidad || !precio) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    try {
      await axios.put("/modifyproduct", {
        id: selectedProducto,
        cantidad,
        precio,
      });

      alert("Producto modificado exitosamente.");
    } catch (err) {
      setError("Error al modificar el producto.");
      console.error("Error al modificar producto:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deleteproduct/${id}`);
      alert("Producto eliminado exitosamente.");
      setProductos(productos.filter(producto => producto.id !== id));
    } catch (err) {
      setError("Error al eliminar el producto.");
      console.error("Error al eliminar producto:", err);
    }
  };

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
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <h3 className="mb-4">Menú</h3>
        <Link to="/dashboard" className="btn btn-primary mb-3 w-100">Dashboard</Link>
        <Link to="/register-product" className="btn btn-success mb-3 w-100">Registrar Producto</Link>
        <Link to="/reports" className="btn btn-danger mb-3 w-100">Reportes</Link>
        <Link to="/activity-history" className="btn btn-info mb-3 w-100">Historial</Link>
        <Link to="/support" className="btn btn-secondary mb-3 w-100">Soporte</Link>
        <Link to="/stock" className="btn btn-dark mb-3 w-100">Stock</Link>
        <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
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
        }}
      >
        <h2 className="text-center">MODIFICAR PRODUCTO</h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "120px" }}>
        <form
          onSubmit={handleModify}
          className="w-100 mx-auto p-4 shadow"
          style={{
            maxWidth: "600px",
            backgroundColor: "#fff8f1",
            border: "1px solid #f0d5c3",
            borderRadius: "16px"
          }}
        >
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="form-label text-dark">Seleccionar Producto</label>
            <select
              className="form-select"
              style={{
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
              value={selectedProducto}
              onChange={(e) => setSelectedProducto(e.target.value)}
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-dark">Nueva Cantidad</label>
            <input
              type="number"
              className="form-control"
              style={{
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
              placeholder="Ingrese la nueva cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-dark">Nuevo Costo</label>
            <input
              type="number"
              className="form-control"
              style={{
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
              placeholder="Ingrese el nuevo costo"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <button
            className="btn w-100"
            style={{
              backgroundColor: "#ffb700",
              color: "#000",
              fontWeight: "bold",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              transition: "background 0.3s ease"
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#ffc832"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#ffb700"}
          >
            Modificar
          </button>
        </form>

        {/* Tabla de productos actualizada con diseño moderno */}
        <div className="mt-5">
          <h4 className="text-center mb-4">Lista de Productos</h4>
          <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: "#212529", color: "#fff", textTransform: "uppercase", fontSize: "14px" }}>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Costo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#ffffff" }}>
                {productos.map((producto) => (
                  <tr key={producto.id} style={{ verticalAlign: "middle" }}>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>${producto.precio}</td>
                    <td>
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                        }}
                        onClick={() => handleDelete(producto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifyProduct;
