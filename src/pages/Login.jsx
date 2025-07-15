// src/pages/Login.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api";
import "../App.css"; // tus estilos generales, incluyendo .login-page, .login-visual, .login-panel, etc.

const carouselImages = [
  "/imagenes/Login1.webp",
  "/imagenes/login2.jpg",
  "/imagenes/login2.avif",
];

function Login() {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // índice para el carrusel
  const [idx, setIdx] = useState(0);

  // auto-rotación
  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // avanzar/retroceder manualmente
  const prevSlide = () =>
    setIdx(i => (i - 1 + carouselImages.length) % carouselImages.length);
  const nextSlide = () =>
    setIdx(i => (i + 1) % carouselImages.length);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginValue.trim()) {
      return setError("Por favor, ingresa tu usuario o correo.");
    }
    if (!contrasena.trim()) {
      return setError("Por favor, ingresa tu contraseña.");
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/login", {
        login: loginValue,
        password: contrasena,
      });
      const { token, role, user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo más tarde.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Logo que hace de home-button */}
      <Link to="/" className="login-logo">
        <img src="/imagenes/Logo.png" alt="Home" />
      </Link>

      {/* Columna izquierda: carrusel de imágenes */}
      <div className="login-visual">
        <span className="arrow prev" onClick={prevSlide}>‹</span>
        <img src={carouselImages[idx]} alt={`Slide ${idx + 1}`} />
        <div className="overlay" />
        <span className="arrow next" onClick={nextSlide}>›</span>

        <div className="dots">
          {carouselImages.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === idx ? "active" : ""}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </div>

      {/* Columna derecha: formulario de login */}
      <div className="login-panel">
        <div className="login-card">
          <h1 className="login-title">Iniciar Sesión</h1>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Usuario o correo"
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                disabled={loading}
              />
            </div>
            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Entrar"}
            </button>
          </form>

          <div className="login-links">
            <a onClick={() => navigate("/forgot-password")}>
              ¿Olvidaste tu contraseña?
            </a>
            <span> | </span>
            <a onClick={() => navigate("/register")}>Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
