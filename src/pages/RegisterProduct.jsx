// src/pages/RegisterProduct.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import axios from "../api";

function RegisterProduct() {
  // — Estados de pestañas, datos y formularios —
  const [activeTab, setActiveTab] = useState("entrada");
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [role, setRole] = useState("");

  // Formulario de registro simplificado
  const [nombre, setNombre] = useState("");
  const [cantidadTotal, setCantidadTotal] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");

  const [imagen, setImagen] = useState(null);

  // Modales y auxiliares
  const [showModalEntrada, setShowModalEntrada] = useState(false);
  const [showModalSalida, setShowModalSalida] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalAjuste, setShowModalAjuste] = useState(false);
  const [productoSalida, setProductoSalida] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);

  // Salida
  const [unidadesVendidas, setUnidadesVendidas] = useState("");
  const [unidadesDevueltas, setUnidadesDevueltas] = useState("");
  const [motivoDevolucion, setMotivoDevolucion] = useState("");
  const [merma, setMerma] = useState("");
  const [motivoMerma, setMotivoMerma] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");

  //Ajustes de Lote
  const [lotes, setLotes] = useState([]);
  const [loteSel, setLoteSel] = useState(null);
  const [nuevaCantidadLote, setNuevaCantidadLote] = useState("");
  const [nuevaFechaLote, setNuevaFechaLote] = useState("");


  // Edición
  const [nuevoPrecioUnitario, setNuevoPrecioUnitario] = useState("");
  const [nuevaCantTotal, setNuevaCantTotal] = useState("");
  const [nuevaCantEntrada, setNuevaCantEntrada] = useState("");
  const [nuevaCantDevuelta, setNuevaCantDevuelta] = useState("");
  const [nuevoPrecioTotal, setNuevoPrecioTotal] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // para saber si estamos creando o ajustando
const [isCreatingLote, setIsCreatingLote] = useState(false);

// el producto seleccionado en el modal de lote
const [productoParaLote, setProductoParaLote] = useState(null);

const defaultFecha = () => new Date().toISOString().slice(0,10);

// justo debajo de tu useState para los lotes y la fecha
const [isDuplicate, setIsDuplicate] = useState(false);
const resetAjusteState = () => {
  setShowModalAjuste(false);
  setIsCreatingLote(false);
  setProductoParaLote(null);
  setLoteSel(null);
  setNuevaCantidadLote("");
  setNuevaFechaLote(defaultFecha());
};
// cada vez que lotes o nuevaFechaLote cambien...
useEffect(() => {
  if (!isCreatingLote || !productoParaLote) {
    setIsDuplicate(false);
    return;
  }
  const dup = lotes.some(l => {
    const d = new Date(l.fecha_lote).toISOString().slice(0,10);
    return d === nuevaFechaLote;
  });
  setIsDuplicate(dup);
}, [lotes, nuevaFechaLote, isCreatingLote, productoParaLote]);

  // Cargar rol y productos
  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
    fetchProductos();
  }, []);

  // Limpiar imagen al cerrar editar
  useEffect(() => {
    if (!showModalEditar) {
      setImagen(null);
      const inp = document.getElementById("input-editar-imagen");
      if (inp) inp.value = "";
    }
  }, [showModalEditar]);

  // Recalcular precio Total en registro
  useEffect(() => {
    const c = parseFloat(cantidadTotal) || 0;
    const u = parseFloat(precioUnitario) || 0;
    setPrecioTotal((c * u).toFixed(2));
  }, [cantidadTotal, precioUnitario]);

  // Recalcular totales en edición
  useEffect(() => {
    const pu = parseFloat(nuevoPrecioUnitario) || 0;
    const base = parseInt(nuevaCantTotal, 10) || 0;
    const ent = parseInt(nuevaCantEntrada, 10) || 0;
    const dev = parseInt(nuevaCantDevuelta, 10) || 0;
    const tot = base + ent;
    setNuevoPrecioTotal((pu * tot).toFixed(2));
  }, [nuevoPrecioUnitario, nuevaCantTotal, nuevaCantEntrada, nuevaCantDevuelta]);

  // API
  const fetchProductos = async () => {
    try {
      const res = await axios.get("/getproductos");
      setProductos(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagen(reader.result);
    reader.readAsDataURL(file);
  };

  // Registrar entrada
  // Registrar entrada
const handleRegisterEntrada = async (e) => {
  e.preventDefault();
  if (!nombre || !cantidadTotal || !precioUnitario) {
    setError("Completa todos los campos obligatorios.");
    return;
  }
  setLoading(true);

  try {
    // 1) registro en productos
    const res = await axios.post("/registerproduct", {
      nombre,
      cantidad_entrada: parseInt(cantidadTotal, 10),
      precio_unitario: parseFloat(precioUnitario),
      precio_total: parseFloat(precioTotal),
      imagen,
    });

    // suponemos que la API nos devuelve el id del producto recién creado:
    const productoId = res.data.id;

    // 2) registramos lote para FIFO
    await axios.post("/lotes", {
      producto_id: productoId,
      cantidad: parseInt(cantidadTotal, 10),
      costo_unitario: parseFloat(precioUnitario),
      fecha_lote: new Date().toISOString().slice(0,10), // opcional
    });

    alert("Entrada registrada correctamente");
    // limpiar
    setNombre("");
    setCantidadTotal("");
    setPrecioUnitario("");
    setPrecioTotal("");
    setImagen(null);
    setShowModalEntrada(false);
    fetchProductos();

  } catch (err) {
    console.error(err);
    setError("Error al registrar la entrada");
  } finally {
    setLoading(false);
  }
};
const handleSubmitLote = async e => {
  e.preventDefault();

  // --- NUEVO: si estamos en modo CREAR pero no hay producto seleccionado, 
  //   forzamos que el usuario elija uno primero y salimos.
  if (isCreatingLote && !productoParaLote) {
    return alert("Selecciona primero el producto para el nuevo lote.");
  }
const formatYMD = dateLike => {
  // si te llega un string ISO o un objeto Date, convertirlo a “YYYY-MM-DD”
  const d = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  return d.toISOString().slice(0, 10);
};
  // 1) Carga los lotes actuales
  // 1) Carga los lotes actuales
let lotesActuales = lotes;
if (productoParaLote) {
  const { data } = await axios.get(
    `/lotes?producto_id=${productoParaLote.id}`
  );
  lotesActuales = data;
  setLotes(data);
}

// 2) Sólo si estamos creando comprobamos duplicados
// 2) Sólo si estamos creando comprobamos duplicados
if (isCreatingLote) {
  const existe = lotesActuales.find(l => {
    const fechaAPI = formatYMD(l.fecha_lote);
    return (
      l.producto_id === productoParaLote.id &&
      fechaAPI === nuevaFechaLote    // ambas ya en “YYYY-MM-DD”
    );
  });
  if (existe) {
    const ok = window.confirm(
      "Ya existe un lote para esta fecha. ¿Quieres ajustarlo?"
    );
    if (ok) {
      setIsCreatingLote(false);
      setLoteSel(existe);
      return;   // volvemos a mostrar modal en modo ajuste
    } else {
      setShowModalAjuste(false);
      return;   // cerramos sin crear
    }
  }
}

// 3) Aquí sigue tu lógica de creación o ajuste...


  // 3) Al no haber duplicado (o ya estar en modo ajuste) creamos o ajustamos:
  if (isCreatingLote) {
    await axios.post("/lotes", {
      producto_id: productoParaLote.id,
      cantidad: +nuevaCantidadLote,
      costo_unitario: parseFloat(productoParaLote.precio_unitario),
      fecha_lote: nuevaFechaLote,
    });
    alert("Lote creado correctamente");
  } else {
    await axios.put(`/lotes/${loteSel.id}`, {
      cantidad: +nuevaCantidadLote,
      fecha_lote: nuevaFechaLote,
    });
    alert("Lote ajustado correctamente");
  }

  // 4) Refresca y cierra
  fetchProductos();
  setShowModalAjuste(false);
};


 // Ajustar lote
  const fetchLotes = async productoId => {
    const { data } = await axios.get(`/lotes?producto_id=${productoId}`);
    setLotes(data);
  };
  const handleAjusteLote = async e => {
    e.preventDefault();
    if (!loteSel) return;
    await axios.put(`/lotes/${loteSel.id}`, {
      cantidad: +nuevaCantidadLote,
      fecha_lote: nuevaFechaLote,
    });
    setShowModalAjuste(false);
    fetchProductos();
  };
  const handleRegisterSalida = async (e) => {
  e.preventDefault();
  if (!productoSalida) return;

  setLoading(true);
  try {
    await axios.post("/salidas-fifo", {
      producto_id: productoSalida.id,
      unidadesVendidas: parseInt(unidadesVendidas, 10),
      unidadesDevueltas: parseInt(unidadesDevueltas, 10),
      merma: parseInt(merma, 10),
      precioVenta: parseFloat(precioVenta),
      motivoDevolucion,
      motivoMerma,
      tipo_salida: "venta" // o según checkbox
    });
    alert("Salida registrada correctamente");
    // limpiar estado de salida
    setUnidadesVendidas("");
    setUnidadesDevueltas("");
    setMerma("");
    setPrecioVenta("");
    setMotivoDevolucion("");
    setMotivoMerma("");
    setShowModalSalida(false);
    fetchProductos();
  } catch (err) {
    console.error(err);
    alert("Error al registrar la salida");
  } finally {
    setLoading(false);
  }
};

  // Actualizar producto
  const handleActualizarProducto = async (e) => {
    e.preventDefault();
    if (!productoEditando) return;
    try {
      await axios.put(`/updateproduct/${productoEditando.id}`, {
        precio_unitario: parseFloat(nuevoPrecioUnitario),
        cantidad_total: parseInt(nuevaCantTotal, 10) + parseInt(nuevaCantEntrada, 10),
        cantidad_devuelta_cliente: parseInt(nuevaCantDevuelta, 10),
        precio_total: parseFloat(nuevoPrecioTotal),
        imagen: imagen || productoEditando.imagen,
      });
      alert("Producto actualizado");
      setShowModalEditar(false);
      fetchProductos();
    } catch {
      alert("Error al actualizar");
    }
  };

  // Helpers para categorías
  const normalize = (s) => s.toLowerCase().trim();
  const categorias = React.useMemo(() => {
    const groups = {};
    productos.forEach((p) => {
      const key = normalize(p.nombre);
      if (!groups[key]) groups[key] = { ...p, cantidad: 0, originales: [] };
      groups[key].cantidad += p.cantidad_total;
      groups[key].originales.push(p);
    });
    return Object.values(groups).reduce((acc, p) => {
      let cat = "Otros";
      const nm = normalize(p.nombre);
      if (/carne|pollo|cerdo/.test(nm)) cat = "Carnes";
      else if (/manzana|mango|naranja/.test(nm)) cat = "Frutas";
      else if (/tomate|lechuga|zanahoria/.test(nm)) cat = "Verduras";
      acc[cat] = acc[cat] || [];
      acc[cat].push(p);
      return acc;
    }, {});
  }, [productos]);
const abrirAjuste = async (prod) => {
  setIsCreatingLote(false);       // ← aquí reseteas el modo
  setProductoParaLote(prod);      // ← aquí guardas el producto activo
  const { data } = await axios.get(`/lotes?producto_id=${prod.id}`);
  setLotes(data);
  setShowModalAjuste(true);
};
  const renderCategoria = (nombreCat, items) => (
    <section key={nombreCat} className="mb-4">
      <h5 className="section-title">{nombreCat}</h5>
      <div className="catalogo-grid">
        {items.map((prod, i) => (
          <div key={i} className="card">
            <img
              src={prod.imagen || "/placeholder.png"}
              alt={prod.nombre}
              className="card-img-top"
            />
            <div className="card-body d-flex flex-column">
              <h6 className="card-title">{prod.nombre}</h6>
              <p className="card-text mb-1">Total: {prod.cantidad_total}</p>
              <p className="card-text mb-3">
                Costo: ${(parseFloat(prod.precio_total) || 0).toFixed(2)}
              </p>
              {prod.originales.length > 1 && (
                <p className="mb-0 text-muted small">
                  {prod.originales.length} entradas
                </p>
              )}
              {activeTab === "salida" && (
                <button
                  className="btn btn-outline-danger btn-sm mb-2"
                  onClick={() => {
                    setProductoSalida(prod);
                    setShowModalSalida(true);
                  }}
                >
                  Registrar Salida
                </button>
              )}
               <div className="mt-auto d-flex justify-content-center">
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => {
                  setProductoEditando(prod);
                  setNuevoPrecioUnitario(parseFloat(prod.precio_unitario).toFixed(2));
                  setNuevaCantTotal (parseFloat(prod.cantidad_total.toString()));
                  setNuevaCantEntrada("");
                  setNuevaCantDevuelta("");
                  setNuevoPrecioTotal(parseFloat(prod.precio_total).toFixed(2));
                  setShowModalEditar(true);
                }}
              >
                Editar
              </button>
              <button
                className="btn btn-outline-secondary btn-sm ms-2"
                
                onClick={() => abrirAjuste(prod)}
              >
                Ajustar Lote
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="d-flex app-page" style={{ minHeight: "100vh" }}>
     
     

      {/* Contenido */}
      <main
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isSidebarOpen ? 250 : 0,
          transition: "margin-left 0.3s ease",
          background: "var(--bg-page)",
        }}
      >
        <h2 className="text-center text-primary">Catálogo de Productos</h2>

        {/* Tabs */}
        <ul className="nav nav-pills mb-3 justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "entrada" ? "active" : ""}`}
              onClick={() => setActiveTab("entrada")}
            >
              Entradas
            </button>
          </li>
          <li className="nav-item ms-3">
            <button
              className={`nav-link ${activeTab === "salida" ? "active" : ""}`}
              onClick={() => setActiveTab("salida")}
            >
              Salidas
            </button>
          </li>
        </ul>

        {activeTab === "entrada" && (
          <>
            <div className="d-flex justify-content-between mb-4 align-items-center">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsCreatingLote(true);
                  setProductoParaLote(null);
                  setLoteSel(null);
                  setNuevaCantidadLote("");
                  setNuevaFechaLote(new Date().toISOString().slice(0,10));
                  setShowModalAjuste(true);
                }}
              >
                + Nuevo Lote
              </button>

              <button
                className="btn-add"
                onClick={() => setShowModalEntrada(true)}
              >
                + Nuevo Producto
              </button>
            </div>
            <input
              type="text"
              className="form-control mb-4"
              placeholder="🔍 Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {Object.entries(categorias).map(
              ([cat, items]) => items.length > 0 && renderCategoria(cat, items)
            )}
          </>
        )}

        {activeTab === "salida" && (
          <>
            <input
              type="text"
              className="form-control mb-4"
              placeholder="🔍 Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {Object.entries(categorias).map(
              ([cat, items]) => items.length > 0 && renderCategoria(cat, items)
            )}
          </>
        )}
{/* Modal Ajuste de Lote */}
        {showModalAjuste && (
  <div className="modal show d-block" style={{ backgroundColor:"rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <form onSubmit={handleSubmitLote}>
          <div className="modal-header">
            <h5 className="modal-title">
              {isCreatingLote 
                ? "Registrar Nuevo Lote" 
                : `Ajustar Lote: ${productoParaLote?.nombre}`}
            </h5>
            <button type="button" className="btn-close" onClick={resetAjusteState}/>
          </div>
          <div className="modal-body">
            {isCreatingLote ? (
              // selector de producto
              <div className="mb-2">
                <label>Producto</label>
                <select
                  className="form-select"
                  value={productoParaLote?.id||""}
                  onChange={e => {
                    const p = productos.find(x=> x.id=== +e.target.value);
                    setProductoParaLote(p);
                    // opcional: precarga de lotes para comprobaciones
                    axios.get(`/lotes?producto_id=${p.id}`)
                         .then(res=> setLotes(res.data));
                  }}
                  required
                >
                  <option value="">Seleccione...</option>
                  {productos.map(p=>(
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            ) : (
              // selector de lote a ajustar
              <div className="mb-2">
                <label>Lote a ajustar</label>
                <select
                  className="form-select"
                  value={loteSel?.id||""}
                  onChange={e=>{
                    const l = lotes.find(x=>x.id=== +e.target.value);
                    setLoteSel(l);
                    setNuevaCantidadLote(l.cantidad.toString());
                     setNuevaFechaLote(l.fecha_lote.slice(0,10)); 
                  }}
                  required
                >
                  <option value="">Seleccione...</option>
                  {lotes.map(l => {
                    // extraemos sólo la parte YYYY-MM-DD
                    const fechaSolo = l.fecha_lote.split("T")[0];
                    return (
                      <option key={l.id} value={l.id}>
                        {fechaSolo} — {l.cantidad}u
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Campos comunes */}
            <div className="mb-2">
              <label>Cantidad</label>
              <input
                type="number"
                className="form-control"
                value={nuevaCantidadLote}
                onChange={e=>setNuevaCantidadLote(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Fecha de Lote</label>
              <input
                type="date"
                className="form-control"
                value={nuevaFechaLote}
                onChange={e=>setNuevaFechaLote(e.target.value)}
                readOnly  
                required
              />
            </div>
            {isDuplicate && (
              <div className="alert alert-warning">
                Ya existe un lote para esta fecha. Si quieres ajustarlo, abre el modal de ajuste.
              </div>
            )}
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isDuplicate}
              >
                Crear Lote
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
)}


        {/* Modal Entrada */}
        {showModalEntrada && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleRegisterEntrada}>
                  <div className="modal-header">
                    <h5 className="modal-title">Registrar Producto</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModalEntrada(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Cantidad Total</label>
                      <input
                        type="number"
                        className="form-control"
                        value={cantidadTotal}
                        onChange={(e) => setCantidadTotal(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Precio Unitario</label>
                      <input
                        type="number"
                        className="form-control"
                        value={precioUnitario}
                        onChange={(e) => setPrecioUnitario(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Precio Total</label>
                      <input
                        type="number"
                        className="form-control"
                        value={precioTotal}
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageChange}
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
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Cargando..." : "Registrar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Salida */}
        {showModalSalida && productoSalida && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleRegisterSalida}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Registrar Salida: {productoSalida.nombre}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModalSalida(false)}
                    />
                  </div>
                  <div className="modal-body">
                    
                    {/* ————— */}
                    <div className="mb-2">
                      <label className="form-label">Unidades Vendidas</label>
                      <input
                        type="number"
                        className="form-control"
                        value={unidadesVendidas}
                        onChange={(e) => setUnidadesVendidas(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Unidades Devueltas</label>
                      <input
                        type="number"
                        className="form-control"
                        value={unidadesDevueltas}
                        onChange={(e) => setUnidadesDevueltas(e.target.value)}
                      />
                      <textarea
                        className="form-control mt-1"
                        placeholder="Motivo de devolución"
                        value={motivoDevolucion}
                        onChange={(e) => setMotivoDevolucion(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Merma</label>
                      <input
                        type="number"
                        className="form-control"
                        value={merma}
                        onChange={(e) => setMerma(e.target.value)}
                      />
                      <textarea
                        className="form-control mt-1"
                        placeholder="Motivo de merma"
                        value={motivoMerma}
                        onChange={(e) => setMotivoMerma(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Precio Venta</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? "Cargando..." : "Registrar Salida"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {showModalEditar && productoEditando && (
          <div
          className="modal show d-block"
           style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
             >
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleActualizarProducto}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Editar: {productoEditando.nombre}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModalEditar(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="mb-2">
                      <label className="form-label">
                        Precio Unitario (actual: $
                        ${parseFloat(productoEditando.precio_total).toFixed(2)})
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={nuevoPrecioUnitario}
                        onChange={(e) =>
                          setNuevoPrecioUnitario(e.target.value)
                        }
                      />
                    </div>
                    
                    <div className="mb-2">
                      <label className="form-label">
                        Cantidad Devuelta Cliente
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={nuevaCantDevuelta}
                        onChange={(e) =>
                          setNuevaCantDevuelta(e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Cantidad Total</label>
                      <input
                        type="number"
                        className="form-control"
                        value={nuevaCantTotal}
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Precio Total</label>
                      <input
                        type="number"
                        className="form-control"
                        value={nuevoPrecioTotal}
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Imagen (opcional)</label>
                      <input
                        id="input-editar-imagen"
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageChange}
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
                    <button type="submit" className="btn btn-success">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default RegisterProduct;
