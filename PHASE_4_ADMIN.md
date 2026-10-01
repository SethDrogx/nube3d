# Fase 4 — Panel administrativo y catálogo local

La Fase 4 convierte `/admin` en un panel funcional para el rol `SUPER_USUARIO` sin añadir backend ni base de datos. Toda la gestión sigue siendo una simulación local de desarrollo.

## Funciones implementadas

- Dashboard con métricas calculadas desde el catálogo real.
- Gestión de productos: alta, edición, eliminación y stock.
- Gestión de categorías: alta, renombrado y eliminación de categorías vacías.
- Confirmación antes de eliminar productos o restaurar datos demo.
- Persistencia en `localStorage`.
- Catálogo público conectado a `ProductContext`.
- Cambios de nombre, precio, imagen y stock reflejados inmediatamente en la tienda.
- Carrito compatible con el catálogo dinámico; elimina referencias de productos que ya no existen y usa los datos actuales del producto.
- Restauración del catálogo de demostración incluido en `src/data/products.js`.

## Rutas administrativas

Todas requieren `SUPER_USUARIO` mediante `ProtectedRoute`:

- `/admin`
- `/admin/productos`
- `/admin/productos/nuevo`
- `/admin/productos/:id/editar`
- `/admin/categorias`

## Almacenamiento local

- Productos: `nube3d.products.v1`
- Categorías: `nube3d.categories.v1`
- Carrito: `nube3d.cart.v1`
- Sesión demo: `nube3d.auth.demo.v1`

`localStorage` no es una base de datos ni una barrera de seguridad. Esta fase existe para validar la arquitectura y la experiencia del administrador antes de conectar una API y una base de datos reales.

## Pruebas

`npm test` ejecuta las pruebas de autenticación, carrito y lógica del catálogo. La Fase 4 agrega pruebas de inicialización, CRUD, persistencia, métricas, categorías y restauración de datos demo.

## Ajuste de imágenes de producto

El formulario de productos permite ahora dos fuentes de imagen:

- URL `http(s)`.
- Archivo de imagen seleccionado desde el equipo o dispositivo móvil.

En navegadores móviles, el selector de archivos puede permitir elegir una foto existente o tomar una nueva con la cámara. Antes de guardarse en el catálogo local, la imagen se redimensiona y comprime en el navegador para reducir el consumo de `localStorage`.

La opción visual **Color de fondo** se retiró del formulario de alta/edición. Los productos existentes conservan internamente su color actual y los productos nuevos reciben el color neutro predeterminado del catálogo. Este campo ya no requiere intervención del administrador.

> Nota: la imagen subida se guarda temporalmente como `data URL` dentro del almacenamiento local del navegador. Es adecuada para esta etapa de demostración, no para producción. En una fase posterior deberá reemplazarse por subida real a backend/almacenamiento de archivos.
