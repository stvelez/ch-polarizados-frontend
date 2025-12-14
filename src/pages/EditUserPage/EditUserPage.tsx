import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input } from "../../components";
import "./EditUserPage.scss";
import { usersService } from "../../services";
import type { User } from "../../types/user.type";

export const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        navigate("/users");
        return;
      }

      try {
        setLoading(true);
        const response = await usersService.getById(id);
        const user = response.data;
        setFormData({
          name: user.name,
          email: user.email,
          password: "",
          confirmPassword: "",
          role: user.role,
          isActive: user.isActive,
        });
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        toast.error("Error al cargar el usuario");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpiar error del campo
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

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
      isValid = false;
    }

    // Validar contraseña solo si se está cambiando
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        isValid = false;
      }

      // Validar confirmación de contraseña
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      return;
    }

    try {
      const updatedUser: Partial<User> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      };

      // Solo incluir la contraseña si se está cambiando
      if (formData.password) {
        updatedUser.password = formData.password;
      }

      await usersService.update(id, updatedUser);
      toast.success('Usuario actualizado exitosamente');
      navigate("/users");
    } catch (error: any) {
      console.error("Error al actualizar el usuario:", error);
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el usuario';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (loading) {
    return (
      <div className="edit-user-page">
        <div className="edit-user-page__content">
          <div className="loading-spinner">Cargando usuario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-user-page">
      <div className="edit-user-page__header">
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
          <h1 className="header-title">Editar Usuario</h1>
          <p className="header-subtitle">
            Actualiza la información del usuario
          </p>
        </div>
      </div>

      <div className="edit-user-page__content">
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
                  label="Nueva Contraseña (opcional)"
                  name="password"
                  type="password"
                  placeholder="Dejar en blanco para mantener la actual"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <small style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                  Solo completa este campo si deseas cambiar la contraseña
                </small>
              </div>

              <div className="form-field">
                <Input
                  label="Confirmar Nueva Contraseña"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  disabled={!formData.password}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Rol <span className="required">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
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
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Actualizar Usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
