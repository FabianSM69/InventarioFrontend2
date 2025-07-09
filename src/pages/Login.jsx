import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usuario.trim()) {
      setError("Por favor, ingresa tu usuario.");
      return;
    }
    if (!contrasena.trim()) {
      setError("Por favor, ingresa tu contraseña.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/login", {
        username: usuario,
        password: contrasena,
      });

      if (response.data.token && response.data.role) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        // Redirigir siempre a /dashboard
        navigate("/dashboard");
      } else {
        setError("Error al recibir datos del servidor.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos.");
      } else if (err.message === "Network Error") {
        setError("No se pudo conectar al servidor. Verifica tu conexión a internet.");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo más tarde.");
      }
      console.error('Error al iniciar sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ background: 'url("/imagenes/fondo.jpg") no-repeat center center fixed', backgroundSize: 'cover', minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '15px', backgroundColor: '#ffffff' }}>
        <h2 className="text-center mb-4 text-primary">Iniciar Sesión</h2>

        <div className="text-center mb-4">
          <img 
            src="/imagenes/icono.png" 
            alt="User Icon" 
            className="rounded-circle" 
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)} 
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control shadow-sm"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 mt-3 shadow-sm" disabled={loading}>
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <a href="#" className="text-decoration-none text-muted">¿Olvidaste tu contraseña?</a>
        </div>

        <div className="mt-3 text-center">
          <button 
            onClick={() => navigate('/Register')} 
            className="btn btn-link text-muted">
            ¿No tienes una cuenta? Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
