## Fase 2 — Carrito de compras

Carrito global con React Context, persistencia en `localStorage`, contador del navbar, notificaciones con Motion y página `/carrito`. Los productos se toman exclusivamente de `src/data/products.js`; el almacenamiento guarda solo identificadores y cantidades. Envío: $0. Finalizar compra muestra un aviso informativo, sin pagos ni pedidos.

Se pueden agregar productos desde Home y Catálogo, aumentar o disminuir cantidades (mínimo una unidad), eliminar productos y vaciar el carrito. El diseño aprobado del Home se conserva.

Pruebas de lógica: `node --test tests/cartState.test.js` (7 pruebas). Compilación: `npm run build`. No se agregaron dependencias.

## Fase 1.5 — Animaciones

La interfaz ahora incluye animaciones y microinteracciones con Motion for React. Consulta `PHASE_1_5_ANIMATIONS.md` para el detalle.

# Nube 3D — React + Vite

Migración estructural del prototipo original generado con v0. La apariencia principal de Nube 3D se conserva, pero el proyecto ya no depende de Next.js ni TypeScript.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Compilación

```bash
npm run build
```

Para previsualizar el build:

```bash
npm run preview
```

## Rutas preparadas

- `/` — inicio
- `/catalogo` — catálogo
- `/producto/:id` — detalle de producto (placeholder)
- `/carrito` — carrito funcional con cantidades y persistencia
- `/personalizado` — impresión personalizada (placeholder)
- `/login` — inicio de sesión (placeholder)
- `/admin` — panel administrativo (placeholder)

## Estructura principal

```text
src/
  components/   Componentes visuales reutilizables
  context/      Estado global del carrito y lógica de persistencia
  data/         Datos mock de productos y categorías
  pages/        Páginas asociadas a las rutas
  App.jsx       Configuración de React Router
  main.jsx      Punto de entrada de React
  main.css      Estilos globales y responsive
```

## Alcance de esta fase

La fase 2 incorpora únicamente el carrito de compras sobre la arquitectura y animaciones aprobadas. Autenticación, roles `SUPER_USUARIO` / `INVITADO`, panel administrativo funcional, cotizaciones con persistencia, backend, base de datos, pagos, pedidos y chatbot inteligente quedan para fases posteriores.

## Cambios técnicos

- Next.js 16 + TypeScript/TSX → React 19 + Vite + JavaScript/JSX.
- React Router prepara la navegación entre módulos.
- Se eliminaron dependencias que no participaban en la interfaz visible: Next.js, TypeScript, shadcn, Base UI, Tailwind y utilidades asociadas.
- La interfaz principal conserva el CSS visual del prototipo original, ahora como CSS plano sin dependencias del framework anterior.
