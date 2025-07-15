// src/pages/Register.jsx

import React, { useState } from "react";
import axios from '../api';
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    ownerName: "",
    phone: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (!form.username.trim()) return setError("Ingresa un nombre de usuario.");
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) 
      return setError("Ingresa un correo válido.");
    if (!form.ownerName.trim()) return setError("Ingresa el nombre del dueño.");
    if (!form.phone.trim() || !/^\d{7,15}$/.test(form.phone)) 
      return setError("Ingresa un número de teléfono válido (solo dígitos).");
    if (!form.password.trim() || form.password.length < 6) 
      return setError("La contraseña debe tener al menos 6 caracteres.");

    try {
      const { data } = await axios.post('/register', form);
      setSuccess(data.message || "Usuario registrado correctamente.");
      setForm({ username: "", email: "", ownerName: "", phone: "", password: "" });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message 
          || "Error al registrar usuario. Inténtalo más tarde."
      );
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight: '100vh' }}
    >
      <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4">Registrar Usuario</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre de Usuario</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre del Dueño</label>
            <input
              name="ownerName"
              type="text"
              className="form-control"
              value={form.ownerName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              name="phone"
              type="tel"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
              placeholder="Solo dígitos"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 mt-3">
            Registrar
          </button>
        </form>

        <div className="mt-3 text-center">
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-link text-muted"
          >
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
