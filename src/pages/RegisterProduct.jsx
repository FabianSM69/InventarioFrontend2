import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import axios from '../api';

function RegisterProduct() {
  const [activeTab, setActiveTab] = useState("entrada");
  const [nombre, setNombre] = useState("");
  const [cantidad_total, setCantidadTotal] = useState("");
  const [cantidad_entrada, setCantidadEntrada] = useState("");
  const [cantidad_devuelta_cliente, setCantidadDevueltaCliente] = useState("");
  const [precio_unitario, setPrecioUnitario] = useState("");
  const [precio_total, setPrecioTotal] = useState("");
  const [imagen, setImagen] = useState(null);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [role, setRole] = useState("");
  const [showModalEntrada, setShowModalEntrada] = useState(false);
  const [showModalSalida, setShowModalSalida] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [productoSalida, setProductoSalida] = useState(null);
  const [unidadesVendidas, setUnidadesVendidas] = useState("");
  const [unidadesDevueltas, setUnidadesDevueltas] = useState("");
  const [motivoDevolucion, setMotivoDevolucion] = useState("");
  const [merma, setMerma] = useState("");
  const [motivoMerma, setMotivoMerma] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
const [productoVerMas, setProductoVerMas] = useState(null);
const [showVerMas, setShowVerMas] = useState(false);
const [productoEditando, setProductoEditando] = useState(null);
const [nuevoPrecioUnitario, setNuevoPrecioUnitario] = useState("");
const [nuevaCantidadTotal, setNuevaCantidadTotal] = useState("");
const [nuevaCantidadDevuelta, setNuevaCantidadDevuelta] = useState("");
const [nuevoPrecioTotal, setNuevoPrecioTotal] = useState ("");
const [showModalEditar, setShowModalEditar] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    fetchProductos();
  }, []);
  useEffect(() => {
  if (!showModalEditar) {
    setImagen(null);
    const input = document.getElementById("input-editar-imagen");
    if (input) input.value = "";
  }
}, [showModalEditar]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("/getproductos");
      setProductos(response.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const handleRegisterEntrada = async (e) => {
  e.preventDefault();
  if (!nombre || !cantidad_total || !cantidad_entrada || !precio_unitario) {
    setError("Por favor, completa todos los campos obligatorios.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    await axios.post("/registerproduct", {
      nombre,
      cantidad_total: parseInt(cantidad_total),
      cantidad_entrada: parseInt(cantidad_entrada),
      cantidad_devuelta_cliente: parseInt(cantidad_devuelta_cliente || 0),
      precio_unitario: parseFloat(precio_unitario),
      precio_total: parseFloat(precio_total || (precio_unitario * cantidad_total)),
      imagen,
    });

    alert("Producto registrado exitosamente");

    // Limpiar campos
    setNombre("");
    setCantidadTotal("");
    setCantidadEntrada("");
    setCantidadDevueltaCliente("");
    setPrecioUnitario("");
    setPrecioTotal("");
    setImagen(null);
    setShowModalEntrada(false);
    fetchProductos();
  } catch (err) {
    setError("Error al registrar producto");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const handleActualizarProducto = async (e) => {
  e.preventDefault();
  if (!productoEditando) return;

  try {
    
    await axios.put(`/updateproduct/${productoEditando.id}`, {
      precio_unitario: parseFloat(nuevoPrecioUnitario),
      cantidad_total: parseInt(nuevaCantidadTotal),
      cantidad_devuelta_cliente: parseInt(nuevaCantidadDevuelta),
      precio_total: parseFloat(nuevoPrecioTotal),
      imagen: imagen || productoEditando.imagen,
    });

    alert("Producto actualizado correctamente");
    setProductoEditando(null);
    setShowModalEditar(false);
    fetchProductos();
  } catch (err) {
    alert("Error al actualizar producto");
    console.error(err);
  }
};


  const handleRegisterSalida = async (e) => {
    e.preventDefault();
    if (!productoSalida) return;

    try {
      await axios.post("/registersalida", {
        id: productoSalida.id,
        unidades_vendidas: parseInt(unidadesVendidas || 0),
        unidades_devueltas: parseInt(unidadesDevueltas || 0),
        motivo_devolucion: motivoDevolucion,
        merma: parseInt(merma || 0),
        motivo_merma: motivoMerma,
        precio_venta: parseFloat(precioVenta || 0),
      });
      alert("Salida registrada exitosamente");
      setProductoSalida(null);
      setUnidadesVendidas("");
      setUnidadesDevueltas("");
      setMotivoDevolucion("");
      setMerma("");
      setMotivoMerma("");
      setPrecioVenta("");
      setShowModalSalida(false);
      fetchProductos();
    } catch (err) {
      alert("Error al registrar salida");
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagen(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const normalizeProductName = (name) => name.toLowerCase().trim();

  const categorizeAndGroupProducts = (productos) => {
    const categories = {
      Carnes: [],
      Frutas: [],
      Verduras: [],
      Lácteos: [],
      'Papas y Snacks': [],
      Mariscos: [],
      Otros: [],
    };

    const grouped = {};

    productos.forEach((producto) => {
      const norm = normalizeProductName(producto.nombre);
      if (!grouped[norm]) {
        grouped[norm] = {
          ...producto,
          cantidad: 0,
          costo: 0,
          originales: [],
        };
      }
      grouped[norm].cantidad += parseInt(producto.cantidad) || 0;
      grouped[norm].costo += parseFloat(producto.costo) || 0;
      grouped[norm].originales.push(producto);
    });

    Object.values(grouped).forEach((producto) => {
      const nombre = normalizeProductName(producto.nombre);
      if (/papa|takis|ruffles|snack|chips|doritos|cheetos/.test(nombre)) categories['Papas y Snacks'].push(producto);
      else if (/leche|queso|yogurt|crema|mantequilla/.test(nombre)) categories['Lácteos'].push(producto);
      else if (/carne|pollo|res|cerdo/.test(nombre)) categories['Carnes'].push(producto);
      else if (/manzana|melon|naranja|limón|mango/.test(nombre)) categories['Frutas'].push(producto);
      else if (/tomate|zanahoria|lechuga|cebolla|pimiento/.test(nombre)) categories['Verduras'].push(producto);
      else if (/pescado|marisco|camaron|tilapia/.test(nombre)) categories['Mariscos'].push(producto);
      else categories['Otros'].push(producto);
    });

    return categories;
  };

  const productosFiltrados = productos.filter((producto) =>
    normalizeProductName(producto.nombre).includes(normalizeProductName(busqueda))
  );

  const categorias = categorizeAndGroupProducts(productosFiltrados);

  const renderCategoria = (nombreCategoria, productos) => (
    <div key={nombreCategoria} className="mb-4">
      <h5 className="text-secondary">{nombreCategoria}</h5>
      <div className="row">
        {productos.map((producto, index) => (
          <div key={`${producto.nombre}-${index}`} className="col-md-4 mb-3">
            <div className="card shadow-sm" style={{ display: "flex", flexDirection: "row" }}>
              <div className="card-body p-2" style={{ flex: 2 }}>
                <h6 className="card-title mb-1">{producto.nombre}</h6>
                <p className="mb-0">Cantidad total: {producto.cantidad_total}</p>
                <p className="mb-0">Costo total: ${producto.precio_total}</p>
                {producto.originales.length > 1 && (
                  <p className="mb-0 text-muted small">{producto.originales.length} entradas combinadas</p>
                )}
                {activeTab === "salida" && (
                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => {
                      setProductoSalida(producto);
                      setShowModalSalida(true);
                    }}
                  >
                    Registrar Salida
                  </button>
                  
                )}
                <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => {
                        setProductoEditando(producto);
                        setNuevoPrecioUnitario(producto.precio_unitario || "");
                        setNuevaCantidadTotal(producto.cantidad_total || "");
                        setNuevaCantidadDevuelta(producto.cantidad_devuelta_cliente || "");
                        setNuevoPrecioTotal(producto.precio_total || "");
                        setShowModalEditar(true);
                      }}
                    >
                  Editar
                </button>

              </div>
              <img
                src={producto.imagen || "/placeholder.png"}
                alt={producto.nombre}
                style={{ width: "100px", objectFit: "cover", borderRadius: "0 5px 5px 0" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderCategoriaSalida = (nombreCategoria, productos) => (
  <div key={nombreCategoria} className="mb-4">
    <h4 className="text-secondary">{nombreCategoria}</h4>
    <div className="row">
      {productos.map((producto) => (
        <div key={producto.id} className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{producto.nombre}</h5>
              <p><strong>Vendidas:</strong> {producto.unidades_vendidas}</p>
              <p><strong>Devueltas:</strong> {producto.unidades_devueltas}</p>
              <p><strong>Merma:</strong> {producto.merma}</p>
              <p><strong>Precio unitario:</strong> ${producto.precio_unitario}</p>
              <div className="d-flex gap-2 mt-2">
  <button
    className="btn btn-outline-danger btn-sm"
    onClick={() => {
      setProductoSalida(producto);
      setShowModalSalida(true);
    }}
  >
    Registrar Salida
  </button>
  <button
    className="btn btn-outline-info btn-sm"
    onClick={() => {
      setProductoVerMas(producto);
      setShowVerMas(true);
    }}
  >
    Ver más
  </button>
</div>

            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

  return (
    <div className="container-fluid d-flex" style={{ backgroundColor: "#fae1dd", minHeight: "100vh" }}>
      <div className="d-flex flex-column align-items-start p-3" style={{ backgroundColor: "#343a40", color: "white", width: "250px", height: "100vh", position: "fixed", top: 0, left: 0 }}>
        <h3 className="mb-4">Menú</h3>
        <Link to="/dashboard" className="btn btn-primary mb-3 w-100">Dashboard</Link>
        <Link to="/register-product" className="btn btn-success mb-3 w-100">Registrar Producto</Link>
        <Link to="/stock" className="btn btn-dark mb-3 w-100">Stock</Link>
        <Link to="/support" className="btn btn-secondary mb-3 w-100">Soporte</Link>
        {role === "admin" && (
          <>
            <Link to="/modify-product" className="btn btn-warning mb-3 w-100">Modificar Producto</Link>
            <Link to="/reports" className="btn btn-info mb-3 w-100">Reportes</Link>
            <Link to="/activity-history" className="btn btn-info mb-3 w-100">Historial</Link>
          </>
        )}
        <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
      </div>

      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "80px" }}>
        <h2 className="text-center text-primary">Catálogo de Productos</h2>

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "entrada" ? "active" : ""}`} onClick={() => setActiveTab("entrada")}>Entrada</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "salida" ? "active" : ""}`} onClick={() => setActiveTab("salida")}>Salida</button>
          </li>
        </ul>

        {activeTab === "entrada" && (
          <>
            <button className="btn btn-warning w-100 mb-4" onClick={() => setShowModalEntrada(true)}>
              Registrar Producto
            </button>
            <input
              type="text"
              className="form-control my-3"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {Object.entries(categorias).map(([nombreCategoria, productos]) =>
              productos.length > 0 ? renderCategoria(nombreCategoria, productos) : null
            )}
          </>
        )}

        {activeTab === "salida" && (
          <>
            <input
              type="text"
              className="form-control my-3"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {Object.entries(categorias).map(([nombreCategoria, productos]) =>
              productos.length > 0 ? renderCategoriaSalida(nombreCategoria, productos) : null
            )}
          </>
        )}
      </div>

      {showModalEntrada && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleRegisterEntrada}>
                <div className="modal-header">
                  <h5 className="modal-title">Registrar Producto</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalEntrada(false)}></button>
                </div>
                <div className="modal-body">
  <div className="mb-2">
    <label className="form-label">Nombre</label>
    <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
  </div>
  <div className="mb-2">
    <label className="form-label">Cantidad Total</label>
    <input type="number" className="form-control" value={cantidad_total} onChange={(e) => setCantidadTotal(e.target.value)} />
  </div>
  <div className="mb-2">
    <label className="form-label">Cantidad Entrada</label>
    <input type="number" className="form-control" value={cantidad_entrada} onChange={(e) => setCantidadEntrada(e.target.value)} />
  </div>
  <div className="mb-2">
    <label className="form-label">Cantidad Devuelta Cliente</label>
    <input type="number" className="form-control" value={cantidad_devuelta_cliente} onChange={(e) => setCantidadDevueltaCliente(e.target.value)} />
  </div>
  <div className="mb-2">
    <label className="form-label">Precio Unitario</label>
    <input type="number" className="form-control" value={precio_unitario} onChange={(e) => setPrecioUnitario(e.target.value)} />
  </div>
  <div className="mb-2">
    <label className="form-label">Precio Total</label>
    <input type="number" className="form-control" value={precio_total} onChange={(e) => setPrecioTotal(e.target.value)} />
  </div>
  <div className="mb-2">
    <label className="form-label">Imagen</label>
    <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
    {imagen && <img src={imagen} alt="preview" className="mt-2" style={{ width: '100%' }} />}
  </div>
</div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Cargando..." : "Registrar"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModalSalida && productoSalida && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleRegisterSalida}>
                <div className="modal-header">
                  <h5 className="modal-title">Registrar Salida para {productoSalida.nombre}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalSalida(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Unidades Vendidas</label>
                    <input type="number" className="form-control" value={unidadesVendidas} onChange={(e) => setUnidadesVendidas(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Unidades Devueltas</label>
                    <input type="number" className="form-control" value={unidadesDevueltas} onChange={(e) => setUnidadesDevueltas(e.target.value)} />
                    <textarea className="form-control mt-1" placeholder="Motivo de devolución" value={motivoDevolucion} onChange={(e) => setMotivoDevolucion(e.target.value)}></textarea>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Merma</label>
                    <input type="number" className="form-control" value={merma} onChange={(e) => setMerma(e.target.value)} />
                    <textarea className="form-control mt-1" placeholder="Motivo de merma" value={motivoMerma} onChange={(e) => setMotivoMerma(e.target.value)}></textarea>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Precio Venta</label>
                    <input type="number" step="0.01" className="form-control" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success" disabled={loading}>{loading ? "Cargando..." : "Registrar Salida"}</button>
                </div>
                
              </form>
            </div>
          </div>
        </div>
        
      )}
      {showVerMas && productoVerMas && (
  <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Detalles de salida: {productoVerMas.nombre}</h5>
          <button type="button" className="btn-close" onClick={() => setShowVerMas(false)}></button>
        </div>
        <div className="modal-body">
          <p><strong>Motivo de devolución:</strong></p>
          <div className="form-control mb-3" style={{ minHeight: "50px" }}>
            {productoVerMas.motivo_devolucion || "N/A"}
          </div>
          <p><strong>Motivo de merma:</strong></p>
          <div className="form-control" style={{ minHeight: "50px" }}>
            {productoVerMas.motivo_merma || "N/A"}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowVerMas(false)}>Cerrar</button>
        </div>
      </div>
    </div>
  </div>
)}
{showModalEditar && productoEditando && (
  <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <form onSubmit={handleActualizarProducto}>
          <div className="modal-header">
            <h5 className="modal-title">Editar: {productoEditando.nombre}</h5>
            <button type="button" className="btn-close" onClick={() => setShowModalEditar(false)}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">Precio Unitario (actual: ${productoEditando.precio_unitario})</label>
              <input type="number" step="0.01" className="form-control" value={nuevoPrecioUnitario} onChange={(e) => setNuevoPrecioUnitario(e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Cantidad Total (actual: {productoEditando.cantidad_total})</label>
              <input type="number" className="form-control" value={nuevaCantidadTotal} onChange={(e) => setNuevaCantidadTotal(e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Cantidad Devuelta por Cliente (actual: {productoEditando.cantidad_devuelta_cliente})</label>
              <input type="number" className="form-control" value={nuevaCantidadDevuelta} onChange={(e) => setNuevaCantidadDevuelta(e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Precio Total (actual: {productoEditando.precio_total})</label>
              <input type="number" className="form-control" value={nuevoPrecioTotal} onChange={(e) => setNuevoPrecioTotal(e.target.value)} />
            </div>
            <div className="mb-2">
  <label className="form-label">Imagen (opcional)</label>
  <input
  id="input-editar-imagen"
  type="file"
  accept="image/*"
  className="form-control"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagen(reader.result);
      reader.readAsDataURL(file);
    }
  }}
/>


  {imagen && (
    <img
      src={imagen}
      alt="preview"
      className="mt-2"
      style={{ width: "100%" }}
    />
  )}
</div>

          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-success">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
}

export default RegisterProduct;
