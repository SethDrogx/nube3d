## Fase 3 — Login, sesión y roles

Autenticación local con `AuthContext`, comprobación centralizada de roles y permisos, login y menú de usuario. `/admin` requiere `SUPER_USUARIO` y conserva únicamente un placeholder. Un visitante sin sesión va al login; un `INVITADO` ve acceso denegado. La tienda sigue abierta sin login y el carrito conserva su contexto y almacenamiento independientes.

## Autenticación de desarrollo

**Esto NO es autenticación segura para producción.** Las cuentas son mock y sus contraseñas están en el frontend, en `src/data/users.js`, visibles para cualquiera que descargue la aplicación. Solo deben utilizarse para desarrollo y pruebas; no introduzcas información sensible real. No se ocultan ni cifran estas credenciales.

| Cuenta | Correo | Contraseña demo | Rol |
| --- | --- | --- | --- |
| Administrador | admin@nube3d.local | Admin123! | SUPER_USUARIO |
| Invitado | invitado@nube3d.local | Invitado123! | INVITADO |

La sección «Credenciales de demostración» de `/login` muestra estas mismas cuentas. El formulario valida correo y contraseña y permite ver/ocultar la contraseña. El menú de usuario muestra el rol y permite cerrar sesión; solo el administrador ve el enlace al panel.

La clave `nube3d.auth.demo.v1` de `localStorage` guarda únicamente `{ userId }`, nunca la contraseña. Al recargar se recupera la cuenta del catálogo demo. Cerrar sesión elimina esa clave y redirige a `/`, sin tocar `nube3d.cart.v1`. Si el navegador bloquea el almacenamiento, la sesión funciona en memoria y el login informa que no podrá restaurarse al recargar.

Los roles se restauran desde las cuentas demo, pero cualquier persona puede modificar el identificador guardado o el código del cliente y simular otra cuenta. `ProtectedRoute` y `can(PERMISSIONS.ACCESS_ADMIN)` organizan la interfaz; **no son una barrera de seguridad**. En una fase posterior se reemplazarán por backend, hash de contraseñas, sesiones/tokens reales y autorización del lado del servidor. Esta fase no implementa ninguno de esos servicios.

Pruebas: `node --test tests/*.test.js` (autenticación, permisos, persistencia, logout e independencia del carrito, además de las pruebas existentes). Compilación: `npm run build`. Sin dependencias nuevas.

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
- `/login` — inicio de sesión mock
- `/admin` — placeholder protegido para SUPER_USUARIO

## Estructura principal

```text
src/
  components/   Componentes visuales reutilizables
  context/      Contextos independientes de carrito y sesión; lógica comprobable
  data/         Datos mock de productos, categorías y usuarios demo
  pages/        Páginas asociadas a las rutas
  App.jsx       Configuración de React Router
  main.jsx      Punto de entrada de React
  main.css      Estilos globales y responsive
```

## Alcance de esta fase

La fase 3 incorpora únicamente login, sesión y roles locales de demostración sobre el carrito, diseño y animaciones aprobados. El panel administrativo funcional, cotizaciones con persistencia, backend, base de datos, autenticación real, pagos, pedidos y chatbot inteligente quedan para fases posteriores.

## Cambios técnicos

- Next.js 16 + TypeScript/TSX → React 19 + Vite + JavaScript/JSX.
- React Router prepara la navegación entre módulos.
- Se eliminaron dependencias que no participaban en la interfaz visible: Next.js, TypeScript, shadcn, Base UI, Tailwind y utilidades asociadas.
- La interfaz principal conserva el CSS visual del prototipo original, ahora como CSS plano sin dependencias del framework anterior.
