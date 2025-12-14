import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input } from "../../components";
import "./EditProductPage.scss";
import { productsService } from "../../services";

export const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    sku: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate("/products");
        return;
      }

      try {
        setLoading(true);
        const product = await productsService.getById(id);
        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          stock: product.stock.toString(),
          sku: product.sku || "",
          isActive: product.isActive,
        });
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al escribir
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
      price: "",
      stock: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = "El precio es requerido";
      isValid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "El precio debe ser un número mayor a 0";
      isValid = false;
    }

    if (formData.stock && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
      newErrors.stock = "El stock debe ser un número mayor o igual a 0";
      isValid = false;
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
      const updatedProduct = {
        name: formData.name,
        description: formData.description || null,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sku: formData.sku || null,
        isActive: formData.isActive,
      };

      await productsService.update(id, updatedProduct);
      toast.success('Producto actualizado exitosamente');
      navigate("/products");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-page__content">
          <div className="loading-spinner">Cargando producto...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-page__header">
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
          <h1 className="header-title">Editar Producto</h1>
          <p className="header-subtitle">
            Actualiza la información del producto
          </p>
        </div>
      </div>

      <div className="edit-product-page__content">
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
                <Input
                  label="Descripción"
                  name="description"
                  placeholder="Descripción del producto (opcional)"
                  value={formData.description}
                  onChange={handleChange}
                />
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

              <div className="form-field">
                <Input
                  label="Stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  error={errors.stock}
                />
              </div>

              <div className="form-field">
                <Input
                  label="SKU (opcional)"
                  name="sku"
                  placeholder="Ej: PROD-001"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="field-label">
                  Estado <span className="required">*</span>
                </label>
                <select
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                  className="field-select"
                  required
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
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
              Actualizar Producto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
