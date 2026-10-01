# Fase 5 — Informe de implementación

## Análisis

Se revisaron App y rutas, AuthContext, ProductContext, CartContext, ProtectedRoute, AdminLayout, AdminSidebar, dashboard, RouteShell, Toast, ProductForm, imageUpload, estilos y pruebas existentes. Se mantuvieron las credenciales demo y las implementaciones de auth, carrito, productos y categorías. No se añadieron dependencias.

## Archivos creados

- src/context/quoteState.js: modelo, validaciones, creación, búsqueda, estados, métricas, proyección pública y almacenamiento comprobables.
- src/context/QuoteContext.jsx: fuente de ejecución del módulo, guardado automático en cada mutación y toast.
- src/pages/Cotizacion.jsx: consulta pública por folio.
- src/pages/admin/AdminQuotes.jsx: listado adaptable y filtros.
- src/pages/admin/AdminQuoteDetail.jsx: detalle y cambio de estado.
- tests/quoteState.test.js: nueve pruebas adicionales.
- PHASE_5_QUOTES.md: este informe.
- artifacts/phase5/formulario-movil.jpg y artifacts/phase5/cotizaciones-admin.jpg: evidencia visual.

## Archivos modificados

- src/App.jsx: QuoteProvider y rutas públicas/administrativas.
- src/pages/Personalizado.jsx: formulario funcional, imagen, errores y confirmación.
- src/components/admin/AdminSidebar.jsx: enlace Cotizaciones.
- src/pages/admin/AdminDashboard.jsx: métricas reales de solicitudes.
- src/main.css: estilos exclusivos del módulo y adaptación móvil.
- README.md: alcance de Fase 5, persistencia, rutas y limitaciones.

## Rutas

Se convirtió /personalizado en formulario público. Se agregaron /cotizacion, /admin/cotizaciones y /admin/cotizaciones/:id. Las dos rutas administrativas heredan ProtectedRoute para SUPER_USUARIO; sin sesión redirigen a login y el INVITADO ve acceso denegado.

## Contexto y modelo

QuoteContext expone quotes, addQuote, getQuoteById, getQuoteByFolio, getPublicQuoteByFolio, updateQuoteStatus, deleteQuote y getQuoteMetrics. El modelo contiene id UUID, folio, fechaCreacion ISO, nombre, email, telefono, descripcion, medidas, color, cantidad numérica, imagen, comentarios y estado. Estado inicial NUEVA; opciones EN_REVISION, COTIZADA, ACEPTADA y RECHAZADA. Las etiquetas visibles son amigables.

## Funcionamiento y decisiones

El formulario no requiere login. Valida campos obligatorios, correo, teléfono opcional, cantidad entera desde uno y referencia opcional. Los errores aparecen junto a los campos. La confirmación muestra el folio y acciones para inicio, nueva solicitud y consulta. No se vacían los datos antes de guardar.

La imagen de dispositivo usa prepareImageFile sin duplicar la compresión. Se comprueba también que el navegador pueda mostrar la imagen antes de permitir envío. La URL opcional se conserva como referencia externa. No se admiten otros tipos de archivo ni subidas a servidor. Motion anima entrada, errores, confirmación, filas, estados y resultados vacíos, respetando la configuración existente de movimiento reducido.

Los folios usan la fecha local del navegador y una secuencia persistente por fecha en nube3d_quote_sequence. La secuencia nunca se reduce al eliminar solicitudes y se conserva al recargar. Se reserva el número antes de guardar la solicitud: los fallos pueden dejar saltos, nunca reutilizaciones. Los registros existentes inicializan el contador sin modificar sus folios. deleteQuote existe en el contexto pero no se expone en la interfaz. Si la secuencia está dañada, se bloquea la creación; al alcanzar 9999 se bloquean nuevos folios para esa fecha para conservar cuatro dígitos. La búsqueda normaliza espacios y mayúsculas. La proyección pública utiliza una lista explícita de cuatro campos: folio, fechaCreacion, estado y descripcion limitada a 120 caracteres. No incluye información administrativa, identidad, correo, teléfono, imagen o comentarios. El texto de descripción sigue siendo público y así se avisa.

## Almacenamiento y límites

Clave independiente nube3d_quotes. Cada mutación guarda primero y luego actualiza el estado React; un fallo no produce confirmación ni cambios en memoria. Se usa una referencia al estado vigente para operaciones consecutivas. Al cargar se ignoran registros inválidos y duplicados. Restaurar productos demo mantiene las solicitudes, comprobado automáticamente.

La información solo existe en el navegador y origen actuales. No hay sincronización entre pestañas/dispositivos, cifrado ni protección de servidor; localStorage y roles mock son modificables. La cuota puede agotarse y limpiar el navegador elimina los datos. La consulta no autentica al cliente. Las imágenes externas pueden caducar. No se implementó ninguna fase posterior.

## Verificación automatizada y compilación

npm test: 40 pruebas aprobadas, 0 fallos. Se mantuvieron las 36 anteriores y se añadieron cuatro sobre crear/eliminar/recargar/crear sin reutilizar folios, migración de registros existentes, reserva ante fallos y secuencia dañada, e historial por fecha con límite de cuatro dígitos.

npm run build: finalizó correctamente con Vite; no emitió advertencias de compilación. npm run dev -- --host 127.0.0.1: servidor iniciado correctamente en http://127.0.0.1:5173/.

## Verificación manual en navegador

- Formulario visible sin sesión, con INVITADO y SUPER_USUARIO.
- Envío vacío muestra errores debajo de nombre, correo y descripción.
- Creación como INVITADO, confirmación y folio COT-20261001-0001.
- Consulta pública tras recargar conserva la solicitud y no muestra campos personales.
- INVITADO bloqueado en /admin/cotizaciones; sin sesión redirige a /login.
- Login SUPER_USUARIO, listado y detalle correctos.
- Cambio a EN_REVISION muestra toast y conserva el estado tras recargar.
- Dashboard refleja una solicitud, cero nuevas y una en revisión en ese momento.
- Imagen de prueba de 1600×1200 comprimida a 1200×900; preview cargado con data URL de 3383 caracteres; segunda solicitud guardada con imagen, folio COT-20261001-0002.
- Búsqueda inexistente muestra el estado vacío de filtros.
- Formulario y tarjetas administrativas revisados a 390×844 y escritorio; viewport restaurado.
- CRUD anterior: producto temporal creado, editado de $10 a $12 y eliminado; quedaron los cuatro productos originales.
- Carrito anterior: cantidad subió de dos a tres y volvió a dos, con totales correctos ($25.80 y $38.70).
- Consola capturada: sin errores ni advertencias durante el recorrido.

Se conservaron dos solicitudes de prueba en el almacenamiento del navegador utilizado. El archivo de imagen de prueba se generó en el directorio temporal del sistema. No se utilizó información personal real.

No se simuló manualmente una cuota llena ni todos los formatos inválidos de imagen; el fallo de persistencia se cubre con pruebas automatizadas y los formatos se validan mediante la utilidad existente y la carga de preview. Tampoco se ensayó una restauración destructiva del catálogo en el navegador: su independencia se verificó automáticamente. El estado vacío con cero solicitudes se implementó y revisó en código; el recorrido manual comprobó el estado vacío de filtros.

## Errores y advertencias

No quedan errores conocidos en los flujos comprobados. Dos intentos del controlador de pruebas no encontraron etiquetas exactas durante la inspección; se continuó mediante IDs/roles y se verificó el resultado visible. Se corrigió la asociación de la etiqueta del selector administrativo de estado. Git avisó de la conversión automática LF a CRLF de Personalizado.jsx según la configuración local; no afecta la compilación.
