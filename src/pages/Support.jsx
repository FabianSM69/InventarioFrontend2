import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showFAQ, setShowFAQ] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || "user");
  }, []);

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://inventario-backend-i6he.onrender.com/send-email",
        { name, email, message }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("Hubo un error al enviar el mensaje");
    }
  };

  return (
    <div className="container-fluid d-flex" style={{ backgroundColor: "#f4f6fb", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      {/* Menú lateral */}
      <div className="d-flex flex-column align-items-start p-3"
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
        <Link to="/stock" className="btn btn-dark mb-3 w-100">Stock</Link>
        <Link to="/support" className="btn btn-secondary mb-3 w-100">Soporte</Link>
        {role === "admin" && (
          <>
            <Link to="/reports" className="btn btn-secondary mb-3 w-100">Reportes</Link>
            <Link to="/activity-history" className="btn btn-info mb-3 w-100">Historial</Link>
            <Link to="/modify-product" className="btn btn-warning mb-3 w-100">Modificar Producto</Link>
          </>
        )}
        <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
      </div>

      {/* Barra superior */}
      <div className="d-flex justify-content-center align-items-center"
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
        <h2 className="text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>CENTRO DE SOPORTE</h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "120px" }}>
        <p className="text-center text-secondary mb-4">
          ¿Tienes algún problema? Contáctanos o revisa nuestras preguntas frecuentes.
        </p>

        {/* Formulario */}
        <div className="mt-4 mb-5" style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "30px"
        }}>
          <h4 className="text-center mb-4 text-dark">Envíanos un mensaje</h4>
          <form onSubmit={handleSubmit} className="form-soporte">
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="Tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mensaje</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Escribe tu mensaje aquí..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "#2563eb", color: "#fff", fontWeight: "600" }}
            >
              Enviar
            </button>
          </form>
        </div>

        <div className="row mt-4 gap-4 justify-content-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="col-md-5 p-4 rounded shadow-sm" style={{ backgroundColor: "#ffffff", borderLeft: "5px solid #2563eb" }}>
            <h4 className="mb-3" style={{ color: "#1e293b", fontWeight: "600" }}>📞 Contacto</h4>
            <p><strong>Email:</strong> soporte@empresa.com</p>
            <p><strong>Teléfono:</strong> +52 123 456 7890</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</p>
          </div>

          <div className="col-md-5 p-4 rounded shadow-sm" style={{ backgroundColor: "#ffffff", borderLeft: "5px solid #10b981" }}>
            <h4 className="mb-3" style={{ color: "#1e293b", fontWeight: "600" }}>❓ Preguntas Frecuentes</h4>
            <p className="mb-2 text-muted">Consulta nuestras preguntas más comunes.</p>
            <button onClick={toggleFAQ} className="btn btn-outline-success">
              {showFAQ ? "Ocultar preguntas" : "Mostrar preguntas"}
            </button>

            {showFAQ && (
              <ul className="mt-3 text-secondary">
                <li>¿Cómo puedo registrar un nuevo producto?</li>
                <li>¿Cómo modificar un producto existente?</li>
                <li>¿Cómo generar reportes de ventas?</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
