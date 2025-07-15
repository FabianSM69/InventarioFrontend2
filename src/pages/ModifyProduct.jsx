// src/pages/ModifyProduct.jsx

import React, { useState, useEffect } from "react";
import axios from '../api';

function ModifyProduct() {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get("/getproductos");
        setProductos(data);
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
      // refresca la lista
      const { data } = await axios.get("/getproductos");
      setProductos(data);
    } catch (err) {
      console.error("Error al modificar producto:", err);
      setError("Error al modificar el producto.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deleteproduct/${id}`);
      alert("Producto eliminado exitosamente.");
      setProductos(productos.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("Error al eliminar el producto.");
    }
  };

  return (
    <div className="modify-product-page container py-4">
      <h2 className="mb-4">Modificar Producto</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleModify} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Seleccionar Producto</label>
          <select
            className="form-select"
            value={selectedProducto}
            onChange={e => setSelectedProducto(e.target.value)}
          >
            <option value="">Seleccione un producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Nueva Cantidad</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nuevo Costo</label>
          <input
            type="number"
            className="form-control"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-warning">
          Modificar
        </button>
      </form>

      <h3 className="mb-3">Lista de Productos</h3>
      <div className="table-responsive shadow-sm rounded">
        <table className="table mb-0">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Costo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.cantidad}</td>
                <td>${p.precio}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.id)}
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
  );
}

export default ModifyProduct;
