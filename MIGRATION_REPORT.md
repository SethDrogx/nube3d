# Reporte de migración — Fase 1

## Resultado

El proyecto fue migrado de **Next.js 16 + TypeScript/TSX** a **React + Vite + JavaScript/JSX**.

La portada visible de Nube 3D conserva el diseño del prototipo original. Esta fase no implementa todavía lógica real de autenticación, roles, administración, carrito persistente, cotizaciones ni inteligencia artificial.

## Archivos principales creados

- `index.html`
- `vite.config.js`
- `src/main.jsx`
- `src/App.jsx`
- `src/main.css`
- `src/data/products.js`
- `src/components/Brand.jsx`
- `src/components/Navbar.jsx`
- `src/components/Hero.jsx`
- `src/components/Categories.jsx`
- `src/components/ProductCard.jsx`
- `src/components/ProductsSection.jsx`
- `src/components/CustomSection.jsx`
- `src/components/QuoteSection.jsx`
- `src/components/Footer.jsx`
- `src/components/ChatAssistant.jsx`
- `src/pages/Home.jsx`
- `src/pages/Catalogo.jsx`
- `src/pages/Producto.jsx`
- `src/pages/Carrito.jsx`
- `src/pages/Personalizado.jsx`
- `src/pages/Login.jsx`
- `src/pages/Admin.jsx`
- `src/pages/RouteShell.jsx`

## Archivos del scaffold anterior eliminados

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/storefront.tsx`
- `components/ui/button.tsx`
- `lib/utils.ts`
- `next.config.mjs`
- `postcss.config.mjs`
- `tsconfig.json`
- `components.json`
- archivos de lock/workspace de pnpm del scaffold original

## Dependencias

### Se eliminaron del proyecto

- Next.js
- TypeScript y tipos de TypeScript
- Tailwind CSS / PostCSS del scaffold
- shadcn
- Base UI
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react
- Vercel Analytics

Estas dependencias no son necesarias para reproducir la interfaz visible que estaba activa en `app/page.tsx`; esa interfaz utilizaba CSS propio.

### Dependencias actuales

- React
- React DOM
- React Router DOM
- Vite
- `@vitejs/plugin-react`

## Rutas preparadas

- `/`
- `/catalogo`
- `/producto/:id`
- `/carrito`
- `/personalizado`
- `/login`
- `/admin`

Las rutas de producto, carrito, personalizado, login y administración son placeholders intencionales para las fases posteriores.

## Comprobaciones realizadas

- Se comprobó que no quedan archivos `.tsx` ni referencias a Next.js/TypeScript en el código fuente.
- Se comprobó que las rutas requeridas están declaradas en `src/App.jsx`.
- Se pasó el código JavaScript/JSX por el parser de TypeScript para detectar errores sintácticos de JSX; no se detectaron errores de parseo.
- `package.json` fue validado como JSON correcto.

## Validación pendiente en un equipo con acceso al registro npm

El entorno usado para preparar esta migración no pudo resolver `registry.npmjs.org` (`EAI_AGAIN`), por lo que no fue posible completar aquí `npm install` ni ejecutar el build real de Vite.

En el equipo de desarrollo ejecutar:

```bash
npm install
npm run build
npm run dev
```

Si aparece cualquier error al instalar o compilar, debe corregirse antes de comenzar la Fase 2.

## Fases posteriores

1. Carrito real y estado global.
2. Login y roles `SUPER_USUARIO` / `INVITADO`.
3. Panel administrativo.
4. Solicitudes de impresión personalizada / cotizaciones.
5. Asistente virtual funcional.
6. Backend, base de datos e integraciones.
7. Documentación funcional por módulo.
