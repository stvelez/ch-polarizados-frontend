import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components";
import { Button } from "../../components";
import "./LoginPage.scss";
import { authService } from "../../services";

export const LoginPage = () => {
  const [email, setEmail] = useState("admin@chpolarizados.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    authService
      .login({ email, password })
      .then((response) => {
        console.log("Login exitoso", response);
        navigate("/products");
      })
      .catch((err: Error) => {
        console.error("Error en login:", err);
        setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
      });

    // if (!email || !password) {
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
            <p>
              El login está simulado. Usa cualquier email y contraseña de más de
              6 caracteres:
            </p>
            <ul>
              <li>
                <strong>Email:</strong> test@correo.com
              </li>
              <li>
                <strong>Password:</strong> 123456
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="admin@chpolarizados.com"
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
