import React, { useState } from "react";
import axios from '../api';
import { useNavigate } from "react-router-dom";
function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            setError("Por favor, ingresa un nombre de usuario.");
            return;
        }
        if (!password.trim()) {
            setError("Por favor, ingresa una contraseña.");
            return;
        }

        try {
            const response = await axios.post('/register', {
                username,
                password,
            });

            setSuccess(response.data.message);
            setError("");
        } catch (err) {
            setError("Error al registrar usuario. Inténtalo de nuevo más tarde.");
            console.error('Error al registrar usuario:', err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-4" style={{ width: '400px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4">Registrar Usuario</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 mt-3">
                        Registrar
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="btn btn-link text-muted">
                        ¿Ya tienes una cuenta? Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
