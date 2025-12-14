import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input } from "../../components";
import "./AddUserPage.scss";
import { usersService } from "../../services/users.service";

export const AddUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    isActive: true,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        isActive: formData.isActive,
      };

      await usersService.create(newUser);
      toast.success('Usuario creado exitosamente');
      navigate("/users");
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast.error('Error al crear el usuario');
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div className="add-user-page">
      <div className="add-user-page__header">
        <div className="header-content">
          <button className="back-button" onClick={handleCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Volver
          </button>
          <h1 className="header-title">Agregar Usuario</h1>
          <p className="header-subtitle">
            Completa la información del nuevo usuario
          </p>
        </div>
      </div>

      <div className="add-user-page__content">
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-section">
            <h2 className="section-title">Información del Usuario</h2>

            <div className="form-grid">
              <div className="form-field">
                <Input
                  label="Nombre Completo"
                  name="name"
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
              </div>

              <div className="form-field">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
              </div>

              <div className="form-field">
                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
              </div>

              <div className="form-field">
                <Input
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="role" className="form-label">
                  Rol <span className="required">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="form-field form-field--checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span>Usuario activo</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={handleCancel} type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
