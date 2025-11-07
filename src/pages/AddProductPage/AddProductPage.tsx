import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components";
import type { Product } from "../../features/products/types/product.types";
import "./AddProductPage.scss";
import { productsService } from "../../services";

export const AddProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      category: "",
      price: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida";
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = "El precio es requerido";
      isValid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "El precio debe ser un número mayor a 0";
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

    const newProduct: Omit<Product, "id"> = {
      name: formData.name,
      category: formData?.category,
      price: Number(formData.price),
      status: "active",
    };

    await productsService.create(newProduct);
    navigate("/products");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="add-product-page">
      <div className="add-product-page__header">
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
          <h1 className="header-title">Agregar Producto</h1>
          <p className="header-subtitle">
            Completa la información del nuevo producto
          </p>
        </div>
      </div>

      <div className="add-product-page__content">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h2 className="section-title">Información del Producto</h2>

            <div className="form-grid">
              <div className="form-field">
                <Input
                  label="Nombre del Producto"
                  name="name"
                  placeholder="Ej: Toalla Microfibra"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">
                  Categoría <span className="required">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`field-select ${
                    errors.category ? "field-select--error" : ""
                  }`}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Cuidado automotriz">Cuidado automotriz</option>
                  <option value="Lujo">Lujo</option>
                  <option value="Servicio">Servicio</option>
                </select>
                {errors.category && (
                  <span className="field-error">{errors.category}</span>
                )}
              </div>

              <div className="form-field">
                <Input
                  label="Precio"
                  name="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Guardar Producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
