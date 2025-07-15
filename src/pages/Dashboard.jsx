// src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api";
import "../App.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [slides, setSlides] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
useEffect(() => {
  const r = localStorage.getItem('role');
  setRole(r);
}, []);
  useEffect(() => {
    // Creamos primero el slide de bienvenida, luego los de stats
    Promise.all([
      axios.get('/stats/ventas-mensuales'),
      axios.get('/stats/entradas-hoy'),
      axios.get('/stats/stock-bajo'),
    ]).then(([ventas, entradasHoy, stockBajo]) => {
      setSlides([
        { type: 'welcome' },                      // slide 0
        { type: 'ventasMensuales', data: ventas.data },
        { type: 'entradasHoy',     data: entradasHoy.data },
        { type: 'stockBajo',       data: stockBajo.data },
      ]);
    });
  }, []);

  // Auto-rotación del carrusel
  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setCarouselIndex(i => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides]);

  return (
    <div className="d-flex app-page" style={{ minHeight: "100vh" }}>
      

        {/* Stats Carousel */}
        {slides.length > 0 && (
          <div
            style={{
              position: 'relative',
              margin: '2rem auto',
              width: '100%',
              maxWidth: 800
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-light)'
              }}
            >
              {/* slide de bienvenida */}
              {slides[carouselIndex].type === 'welcome' && (
                <div style={{ textAlign: 'center' }}>
                  <h2>¡Bienvenido al Panel de Inventario!</h2>
                  <p>Gestiona entradas, salidas y stock de forma fácil y eficiente.</p>
                  <img
                    src="/imagenes/Bienvenido.png"
                    alt="Bienvenida"
                    style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}
                  />
                </div>
              )}

              {/* slide de ventas mensuales */}
              {slides[carouselIndex].type === 'ventasMensuales' && (
                <>
                  <h3 style={{ textAlign: 'center' }}>Top 5 Vendidos (Mes)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={slides[carouselIndex].data}>
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total_vendidas" fill="var(--primary)" />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* slide de entradas hoy */}
              {slides[carouselIndex].type === 'entradasHoy' && (
                <>
                  <h3 style={{ textAlign: 'center' }}>Entradas Registradas Hoy</h3>
                  <p style={{ fontSize: '3rem', textAlign: 'center', margin: '1rem 0' }}>
                    {slides[carouselIndex].data.total_entradas}
                  </p>
                </>
              )}

              {/* slide de stock bajo */}
              {slides[carouselIndex].type === 'stockBajo' && (
                <>
                  <h3 style={{ textAlign: 'center' }}>Productos con Stock Bajo</h3>
                  <ul style={{ fontSize: '1.1rem', marginLeft: '1rem' }}>
                    {slides[carouselIndex].data.map(p => (
                      <li key={p.nombre}>
                        {p.nombre} — {p.cantidad_total} unidades
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>
   
  );
}

export default Dashboard;
