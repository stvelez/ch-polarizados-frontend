import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components";
import { Button } from "../../components";
import { authUtils } from "../../utils/auth";
import "./LoginPage.scss";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const success = authUtils.login(email, password);

    if (success) {
      navigate("/products");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">
            Ingresa tus credenciales para acceder
          </p>
          <div className="login-info">
            <p>El login está simulado. Usa cualquier email y contraseña de más de 6 caracteres:</p>
            <ul>
              <li><strong>Email:</strong> admin@chpolarizados.com</li>
              <li><strong>Password:</strong> 123456</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-actions">
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" variant="primary" size="large">
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
