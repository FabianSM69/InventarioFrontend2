import React from "react";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import axios from '../api';
// componentes pal chartjs
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Reports() {
  // Datos para la gráfica de barras 
  const barData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Productos Vendidos",
        data: [120, 150, 180, 200, 170],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configuración de la gráfica de barras
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  // Datos para la gráfica de pastel 
  const pieData = {
    labels: ["Bebidas", "Dulces", "Enlatados", "Lácteos"],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: ["#FF5733", "#33FF57", "#3375FF", "#FFC300"],
      },
    ],
  };

  return (
    <div className="container-fluid d-flex" style={{ backgroundColor: "#fae1dd", minHeight: "100vh" }}>
      
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
        <Link to="/modify-product" className="btn btn-warning mb-3 w-100">Modificar Producto</Link>
        <Link to="/activity-history" className="btn btn-info mb-3 w-100">Historial</Link>
        <Link to="/support" className="btn btn-secondary mb-3 w-100">Soporte</Link>
                <Link to="/stock" className="btn btn-dark mb-3 w-100">Stock</Link>
        <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
      </div>

      {/* Barra superior con el texto "REPORTES" */}
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
        <h2 className="text-center">REPORTES</h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "120px" }}> {/* Ajuste para el menú fijo y barra superior */}
        <p className="text-center">Aquí puedes generar y visualizar los reportes del sistema.</p>

        {/* Gráfica de Barras */}
        <div className="chart-container" style={{ width: "80%", margin: "auto" }}>
          <h4 className="text-center text-dark">Productos Vendidos por Mes</h4>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* Gráfica de Pastel */}
        <div className="chart-container mt-5" style={{ width: "50%", margin: "auto" }}>
          <h4 className="text-center text-dark">Categorías más Vendidas</h4>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}

export default Reports;
