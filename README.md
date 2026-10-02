## FASE 6 - Asistente virtual

El asistente flotante funciona mediante reglas y respuestas predefinidas, sin IA ni llamadas a servicios externos. Está montado una sola vez en `App`, fuera de las transiciones de rutas: abrir/cerrar y navegar conserva la conversación. Mantiene el estilo anterior y agrega ocho opciones rápidas, texto libre, indicador breve de escritura, Enter para enviar, foco al abrir, scroll al último mensaje y **Nueva conversación**. Motion respeta movimiento reducido.

Arquitectura: `ChatAssistant` (UI y React Router) → `useAssistant` (conversación y adaptadores de contextos) → `chatAssistantService` (motor de reglas y respuesta estructurada). `chatResponses.js` contiene opciones y textos. La interfaz consume mensajes con texto, resultados y acciones, para poder complementar o reemplazar el servicio con un proveedor de IA en otra fase sin reescribir la UI. No se agregó ningún proveedor, API key ni dependencia.

Intents: búsqueda, precios, impresión personalizada, consulta de cotización, entrega, pagos, carrito, contacto y fallback. El texto se normaliza en minúsculas y sin acentos; la búsqueda compara palabras significativas con nombre, categoría y descripción del catálogo vigente de `ProductContext`, ordena por coincidencias y muestra hasta tres resultados con precio real y stock. Un agotado puede verse, pero no ofrece agregarlo al carrito desde el bot. `CartContext` proporciona cantidad total de unidades y total calculado.

La consulta conversacional pide folio y usa únicamente `QuoteContext.getPublicQuoteByFolio`. Muestra folio, fecha, estado amigable y descripción resumida; nunca nombre, correo, teléfono, imagen ni comentarios. El servicio vuelve a seleccionar explícitamente esos cuatro campos. La consulta depende del almacenamiento local del navegador y la descripción sigue siendo pública como en Fase 5.

Estados internos: `IDLE`, `WAITING_FOR_PRODUCT_SEARCH`, `WAITING_FOR_QUOTE_FOLIO`. El siguiente texto responde al flujo pendiente; una opción rápida permite cambiar de tema. Folios escritos directamente también se consultan. Acciones de navegación mediante React Router: `/catalogo`, `/producto/:id`, `/personalizado`, `/carrito` y `/cotizacion`. No hay acciones administrativas, independientemente del rol de sesión.

Historial solo en memoria, limitado a 30 mensajes y entradas de hasta 1000 caracteres. Se conserva durante navegación SPA y al cerrar/reabrir; recargar la página o cerrar la pestaña inicia una conversación nueva. El reinicio cancela cualquier respuesta pendiente, limpia mensajes y estado y restaura el saludo, sin modificar los otros contextos. Los resultados históricos representan los datos al responder; una nueva consulta lee los datos actuales.

Limitaciones: coincidencias simples, sin comprensión general ni tolerancia avanzada a errores. Un mensaje desconocido recibe fallback honesto y las opciones rápidas siguen disponibles. La entrega de 2 a 5 días hábiles es una referencia, no una garantía. El pago en línea y el contacto directo no están habilitados; no se inventan medios de pago, números o correos. No se implementan backend, WhatsApp, correos, pedidos, notificaciones ni IA. Pruebas: `npm test`; compilación: `npm run build`. Consulta `PHASE_6_ASSISTANT.md` para el informe y verificaciones.

## FASE 5 - Cotizaciones personalizadas

`/personalizado` permite solicitar impresiones sin sesión: nombre, correo, teléfono opcional, descripción, medidas, color, cantidad entera desde 1, imagen y comentarios. Reutiliza la compresión de Fase 4.1 (hasta 1200 px y 280 KiB) y verifica que la referencia cargue como imagen. No admite archivos 3D ni documentos. La confirmación y el folio aparecen solo tras guardar correctamente; un fallo de almacenamiento conserva el formulario.

`QuoteContext` centraliza `quotes`, `addQuote`, `getQuoteById`, `getQuoteByFolio`, `getPublicQuoteByFolio`, `updateQuoteStatus`, `deleteQuote` y `getQuoteMetrics`. La lógica comprobable vive en `quoteState.js`. Cada solicitud contiene `id`, `folio`, `fechaCreacion`, `nombre`, `email`, `telefono`, `descripcion`, `medidas`, `color`, `cantidad`, `imagen`, `comentarios` y `estado`. Los folios tienen formato `COT-AAAAMMDD-NNNN`, usando la fecha local del navegador y una secuencia persistente por fecha en `nube3d_quote_sequence`, independiente de las solicitudes actuales. El ID es un UUID. Eliminar una solicitud no reduce el contador ni libera su folio. La secuencia se reserva antes del guardado; si este falla, puede quedar un salto, pero no se reutiliza el número. Los folios existentes inicializan el contador sin modificarse. Si la secuencia está dañada, se bloquea la creación en lugar de reiniciar la numeración; al llegar a 9999 se bloquean nuevas solicitudes para esa fecha para conservar cuatro dígitos.

Estados: `NUEVA`, `EN_REVISION`, `COTIZADA`, `ACEPTADA`, `RECHAZADA`. `/admin/cotizaciones` ofrece filtros por estado y búsqueda por folio, nombre o correo; `/admin/cotizaciones/:id` muestra el detalle y permite actualizar el estado con toast. Ambas rutas reutilizan `ProtectedRoute` y requieren `SUPER_USUARIO`. El dashboard calcula total, nuevas y en revisión sin alterar las métricas de productos.

`/cotizacion` consulta por folio y muestra solo folio, fecha, estado y los primeros 120 caracteres de la descripción. No muestra nombre, correo, teléfono, imágenes ni comentarios. La descripción es texto público y no debe contener datos personales. Esta vista prepara la consulta futura del bot, sin integrarlo todavía.

Persistencia automática en la clave independiente `nube3d_quotes`: cada mutación se escribe antes de actualizar el contexto. Restaurar el catálogo demo no borra cotizaciones. Datos dañados o inválidos se ignoran al leer. Si localStorage falla o agota su cuota, se informa el error sin confirmar un guardado inexistente.

**Solo demostración y desarrollo:** las solicitudes existen en este navegador y origen; no se envían a Nube 3D ni se sincronizan entre dispositivos o pestañas abiertas. Borrar los datos del navegador las elimina. localStorage es editable y accesible desde el cliente; roles mock y folios no constituyen seguridad, autorización real ni privacidad de producción. No uses datos sensibles. Las URLs de imágenes dependen de servidores externos y pueden dejar de funcionar. No se implementan backend, correo, pagos, pedidos ni IA.

Validación: `npm test` incluye creación, validaciones, folios, persistencia, búsquedas, estados, métricas, proyección pública e independencia del catálogo, junto con todas las pruebas anteriores. `npm run build` compila la aplicación.

## Fase 4 — Panel administrativo y gestión de productos

El rol `SUPER_USUARIO` dispone ahora de un panel administrativo funcional bajo `/admin`. El catálogo se centraliza en `ProductContext`, usa `src/data/products.js` como seed inicial y persiste cambios en `localStorage`. Los cambios administrativos se reflejan inmediatamente en Home, Catálogo, detalle de producto y carrito.

Rutas administrativas protegidas:

- `/admin` — dashboard con métricas reales
- `/admin/productos` — listado de productos
- `/admin/productos/nuevo` — alta de producto
- `/admin/productos/:id/editar` — edición
- `/admin/categorias` — gestión de categorías

Claves locales de esta fase: `nube3d.products.v1` y `nube3d.categories.v1`. No constituyen una base de datos ni almacenamiento seguro. La opción **Restaurar catálogo demo** vuelve a cargar los datos originales de `src/data/products.js`. Consulta `PHASE_4_ADMIN.md` para el alcance técnico.

Pruebas: `npm test`.

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
- `/producto/:id` — detalle de producto conectado al catálogo
- `/carrito` — carrito funcional con cantidades y persistencia
- `/personalizado` — formulario público de cotización
- `/cotizacion` — consulta pública por folio
- `/admin/cotizaciones` y `/admin/cotizaciones/:id` — gestión y detalle protegidos
- `/login` — inicio de sesión mock
- `/admin` y `/admin/*` — panel administrativo protegido para SUPER_USUARIO

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

La fase 5 agrega cotizaciones con persistencia local sobre las fases anteriores. Backend, base de datos, autenticación real, pagos, pedidos y chatbot inteligente quedan para fases posteriores.

## Cambios técnicos

- Next.js 16 + TypeScript/TSX → React 19 + Vite + JavaScript/JSX.
- React Router prepara la navegación entre módulos.
- Se eliminaron dependencias que no participaban en la interfaz visible: Next.js, TypeScript, shadcn, Base UI, Tailwind y utilidades asociadas.
- La interfaz principal conserva el CSS visual del prototipo original, ahora como CSS plano sin dependencias del framework anterior.

### Imágenes desde equipo o celular

En la administración de productos se puede conservar una URL de imagen o seleccionar una foto desde el dispositivo. El navegador optimiza las fotos antes de almacenarlas localmente para evitar guardar directamente archivos de cámara demasiado pesados. En móvil, el selector puede ofrecer galería o cámara según el navegador/sistema operativo.

Esta solución sigue siendo de desarrollo: los archivos quedan representados como imágenes embebidas en `localStorage`. Cuando exista backend, deben migrarse a almacenamiento real de archivos.
