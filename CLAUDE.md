# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Type-check + build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

There is no test setup in this project.

## Environment

Copy `.env.example` to `.env` and set:
```
VITE_API_URL=http://localhost:4000/api
```

Demo credentials: `admin@chpolarizados.com` / `123456`

## Architecture

Admin dashboard for CH Polarizados (product/sales management). React 19 + TypeScript + Vite, with React Router v7, Axios, SASS, and React Toastify.

**Source layout:**
- `src/components/` — Shared UI components (Button, Input, Layout, Sidebar, ProtectedRoute)
- `src/features/` — Domain modules: `products/`, `sales/`, `users/` — each with `types/`, `components/`, and `index.ts` barrel
- `src/pages/` — One component per route, barrel-exported from `index.ts`
- `src/services/` — All API/business logic lives here (not `utils/`)
- `src/types/` — Shared TypeScript interfaces

**Routing (`src/App.tsx`):**
- Public: `/login`
- Protected (auth required): all other routes, wrapped by `Layout` (Sidebar + Outlet)
- Admin-only: `/users/*`
- Catch-all redirects to `/login`

**Auth pattern:**
- `ProtectedRoute` reads `localStorage.authToken`; accepts optional `requiredRole` prop (`admin` | `user`)
- `authService.login()` stores token + user object in localStorage; 401 responses in the Axios interceptor clear them automatically

**API layer (`src/services/api.service.ts`):**
- Axios instance, base URL from `VITE_API_URL`, 10s timeout
- Request interceptor injects `Authorization: Bearer <token>`
- Response interceptor clears localStorage on 401
- Services (`products`, `sales`, `users`, `auth`) normalize inconsistent API responses (e.g., converting string prices to numbers, unwrapping array-vs-object shapes)

**Data fetching pattern (no query library):**
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

const fetch = useCallback(async () => {
  try {
    setLoading(true);
    setData(await someService.getAll());
  } catch {
    toast.error('...');
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => { fetch(); }, [fetch]);
```

Toast notifications use `react-toastify` (configured bottom-right in `main.tsx`).

TypeScript is in strict mode with `noUnusedLocals` and `noUnusedParameters` enforced.
