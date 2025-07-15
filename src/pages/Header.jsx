// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../imagenes/Logo.png';

export default function Header({ sidebarOpen, toggleSidebar, title, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="app-header" style={{
      position: 'fixed',
      top: 0,
      left: sidebarOpen ? 250 : 0,
      right: 0,
      height: 80,
      backgroundColor: 'var(--bg-sidebar)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1rem',
      zIndex: 1001
    }}>
      <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
        {sidebarOpen ? '←' : '→'}
      </button>

      <h2 style={{ flexGrow: 1, color: 'white', margin: 0 }}>
        {title}
      </h2>

      <img
        src={logo}
        alt="InvenStock"
        className="app-logo"
        style={{ height: 40, cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      />

      {/* Opcional: botón de logout en el header */}
      {onLogout && (
        <button
          onClick={onLogout}
          style={{
            marginLeft: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      )}
    </header>
  );
}
