// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api";
import "../App.css";

function Profile() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  // Foto de perfil
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Panel de superadmin
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionError, setActionError] = useState("");

  // Carga inicial de mi perfil
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.replace("/login");

    axios
      .get("/user/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.clear();
        window.location.replace("/login");
      });
  }, []);

  // File input
  const handleFileChange = (e) => {
    setError("");
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // Subir foto
  const handleUpload = async () => {
    if (!file) return setError("Selecciona primero un archivo.");
    setUploading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("profilePhoto", file);

      const res = await axios.post("/user/me/photo", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser((u) => ({ ...u, photoUrl: res.data.photoUrl }));
      setFile(null);
    } catch {
      setError("Error al subir la foto. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  // Cargar usuarios (superadmin)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setActionError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setActionError("No se pudieron cargar usuarios.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Toggle panel admin
  const toggleAdminPanel = () => {
    setShowAdminPanel((sh) => !sh);
    if (!showAdminPanel) fetchUsers();
  };

  // Cambiar rol
  const changeRole = async (id, newRole) => {
    setActionError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((us) =>
        us.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch {
      setActionError("Error al cambiar rol.");
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    setActionError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((us) => us.filter((u) => u.id !== id));
    } catch {
      setActionError("Error al eliminar usuario.");
    }
  };

  // Mientras carga perfil...
  if (!user) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status" />
        <p>Cargando perfil…</p>
      </div>
    );
  }

  return (
    <div className="d-flex app-page" style={{ minHeight: "100vh" }}>
      
        {/* Contenido de perfil */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-light)",
            padding: "2rem",
            maxWidth: 600,
            margin: "0 auto",
            marginTop: "2rem",
            fontFamily: "var(--font-base)",
          }}
        >
          {/* Avatar */}
          <div className="text-center mb-4">
            <img
              src={user.photoUrl || "/imagenes/default-user.png"}
              alt="Perfil"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: "50%",
                border: "3px solid var(--primary)",
              }}
            />
          </div>
          {/* Datos */}
          <p>
            <strong>Usuario:</strong> {user.username}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Dueño:</strong> {user.ownerName}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.phone}
          </p>

          <hr style={{ margin: "2rem 0" }} />

          {/* Subir foto */}
          <h5 style={{ marginBottom: "1rem" }}>
            Actualizar foto de perfil
          </h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <div
            className="d-flex align-items-center"
            style={{ gap: "1rem" }}
          >
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Subiendo…" : "Subir foto"}
            </button>
          </div>

          {/* BOTÓN Y PANEL DE ADMINISTRACIÓN */}
          {user.role === "superadmin" && (
            <>
              <button
                className="btn btn-warning mt-4"
                onClick={toggleAdminPanel}
              >
                {showAdminPanel
                  ? "Ocultar Administrar Usuarios"
                  : "Administrar Usuarios"}
              </button>

              {showAdminPanel && (
                <div className="card bg-card mt-3 p-3">
                  {actionError && (
                    <div className="alert alert-danger">
                      {actionError}
                    </div>
                  )}
                  {loadingUsers ? (
                    <p>Cargando usuarios…</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Usuario</th>
                          <th>Correo</th>
                          <th>Rol</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={u.role}
                                onChange={(e) =>
                                  changeRole(u.id, e.target.value)
                                }
                              >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                                <option value="superadmin">
                                  superadmin
                                </option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteUser(u.id)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    
  );
}

export default Profile;
