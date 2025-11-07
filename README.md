# CH Polarizados - Sistema de Gestión Frontend

Sistema de gestión de productos construido con React, TypeScript, Vite y SASS.

## 🚀 Inicio Rápido

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 🔐 Login

El login está simulado. Usa cualquier email y contraseña de más de 6 caracteres:

- **Email:** `admin@chpolarizados.com`
- **Password:** `123456`

## 📁 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables (Button, Input, Header, Sidebar, Layout)
├── features/        # Features por dominio (components específicos de negocio)
│   └── products/    # Feature de productos
│       ├── api/             # Llamadas a la API
│       ├── components/      # ProductCard (componente específico)
│       └── types/           # Tipos TypeScript
├── pages/          # Páginas de la aplicación
│   ├── LoginPage/          # Página de login
│   ├── Dashboard/          # Dashboard con estadísticas
│   └── ProductsPage/       # Página de gestión de productos
└── utils/          # Utilidades (axios, auth)
```

### 📝 Convención de Nomenclatura

**IMPORTANTE:** Las páginas principales deben estar en `src/pages/` con el sufijo `Page`:
- ✅ `pages/ProductsPage/ProductsPage.tsx` - Correcto
- ❌ `features/products/ProductList.tsx` - Incorrecto para páginas completas

**Diferencia entre `pages/` y `features/`:**
- **`pages/`**: Páginas completas que representan rutas (ProductsPage, Dashboard, LoginPage)
- **`features/`**: Componentes específicos de negocio reutilizables (ProductCard, API, tipos)

## 🎯 Features

- ✅ Sistema de autenticación con rutas protegidas
- ✅ Sidebar con navegación completa
- ✅ Layout responsivo (Desktop + Móvil)
- ✅ Gestión de productos (lista, búsqueda, filtros)
- ✅ Dashboard con estadísticas
- ✅ Componentes reutilizables con variantes
- ✅ Diseño responsive y moderno
- ✅ Integración con Axios (interceptores configurados)
- ✅ Mock data para desarrollo

## 📚 Documentación

- **[GUIA_DE_USO.md](./GUIA_DE_USO.md)** - Guía completa de uso
- **[RESUMEN.md](./RESUMEN.md)** - Resumen del proyecto
- **[PROJECT_README.md](./PROJECT_README.md)** - Documentación técnica
- **[CONVENCIONES.md](./CONVENCIONES.md)** - ⚠️ Convenciones de nomenclatura y estructura (LEER ANTES DE CREAR ARCHIVOS)
- **[SIDEBAR_LAYOUT.md](./SIDEBAR_LAYOUT.md)** - Documentación del Sidebar y Layout

## 🛠️ Tecnologías

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- SASS

## 📝 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

## 🔧 Configuración

Edita `.env` para configurar la URL de la API:

```env
VITE_API_URL=http://localhost:8080/api
```

## 🎨 Rutas

- `/login` - Página de inicio de sesión (pública)
- `/dashboard` - Dashboard con estadísticas (protegida)
- `/products` - Gestión de productos (protegida)

## 📄 Licencia

Proyecto privado - CH Polarizados

