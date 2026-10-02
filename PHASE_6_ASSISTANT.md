# Fase 6 — Asistente virtual por reglas

## Análisis realizado

Se revisaron ChatAssistant, montaje en Home y Catálogo, App/React Router, ProductContext, CartContext y su resumen, QuoteContext y la proyección pública, Toast, Motion y estilos existentes. El bot anterior solo acumulaba textos enviados y se desmontaba al cambiar de página. Se conservó el diseño visual y se movió una única instancia a App, dentro de los proveedores existentes y fuera de AnimatedRoutes.

No se modificaron los contextos de auth, productos, carrito o cotizaciones, las credenciales demo, el CRUD ni la secuencia persistente de folios aprobada en Fase 5. No se añadieron dependencias.

## Archivos creados

- src/data/chatResponses.js: saludo, ocho opciones rápidas y respuestas predefinidas.
- src/services/chatAssistantService.js: normalización, búsqueda, intents, respuestas estructuradas, estados y reducer de historial.
- src/hooks/useAssistant.js: adaptación de contextos, conversación, temporizador y reinicio.
- tests/chatAssistant.test.js: once pruebas del módulo.
- PHASE_6_ASSISTANT.md: este informe.
- artifacts/phase6/asistente-escritorio.jpg y artifacts/phase6/asistente-movil.jpg: evidencia visual.

## Archivos modificados

- src/components/ChatAssistant.jsx: mensajes bot/usuario, resultados, acciones, escritura, foco, scroll, reinicio y accesibilidad.
- src/App.jsx: instancia global del asistente.
- src/pages/Home.jsx y src/pages/Catalogo.jsx: eliminación de las instancias duplicadas.
- src/main.css: altura y scroll del chat, resultados, acciones, foco y adaptación móvil.
- README.md: documentación acotada de Fase 6.

## Arquitectura e integraciones

UI → useAssistant → chatAssistantService → reglas y respuestas. El servicio es comprobable sin React y recibe solo dependencias de lectura: products, resumen del carrito y getPublicQuoteByFolio. Retorna una respuesta estructurada y el siguiente estado conversacional. Esta separación permite integrar posteriormente otro motor sin rehacer los mensajes ni las acciones de UI.

ProductContext sigue siendo la fuente del catálogo. Se busca en nombre, categoría y descripción con texto normalizado sin acentos, palabras significativas y coincidencia simple de plurales. Los resultados se ordenan por cantidad de coincidencias, hasta tres; el precio y stock provienen del catálogo en ejecución. La respuesta contiene únicamente ID, nombre, precio y etiqueta de disponibilidad. No se ofrece agregar desde el bot.

CartContext proporciona totalQuantity y total: la cantidad corresponde a unidades, igual que en la tienda. El bot muestra resumen o carrito vacío y enlaces; no modifica el carrito.

QuoteContext se integra exclusivamente mediante getPublicQuoteByFolio; no se pasa al motor la lista completa ni métodos administrativos. Una selección explícita adicional conserva solo folio, fechaCreacion, estado y descripcion de hasta 120 caracteres. El estado reutiliza las etiquetas existentes de Fase 5. No aparecen identidad, correo, teléfono, imágenes ni comentarios.

## Intents, estados y acciones

SEARCH, PRICES, CUSTOM, QUOTE, DELIVERY, PAYMENT, CART, CONTACT y FALLBACK. Los estados IDLE, WAITING_FOR_PRODUCT_SEARCH y WAITING_FOR_QUOTE_FOLIO controlan el siguiente texto. Las opciones rápidas llevan un intent explícito para cambiar de tema aunque haya un flujo pendiente. Un folio completo escrito directamente también consulta la proyección pública.

Las acciones usan useNavigate hacia /catalogo, /producto/:id, /personalizado, /carrito y /cotizacion. No se crearon rutas nuevas ni se usa window.location.href. El bot permanece público y de atención al cliente incluso si la sesión es SUPER_USUARIO: no tiene funciones de crear/editar/eliminar productos, cambiar estados o roles.

## Historial y experiencia

Se eligió estado en el nivel global del asistente, sin AssistantContext adicional ni localStorage. El historial dura durante la navegación SPA y cerrar/reabrir el panel; recargar o cerrar la pestaña lo reinicia. Máximo 30 mensajes, 1000 caracteres de entrada. Las respuestas históricas son instantáneas del dato al responder; solicitudes siguientes leen los contextos actuales.

Escritura simulada de 350 ms, sin conexión externa. El envío concurrente se bloquea con una referencia; el texto del input se conserva si se intenta enviar durante una respuesta pendiente. Nueva conversación cancela el temporizador, restaura el saludo y limpia los estados internos sin tocar otras funcionalidades. El temporizador se limpia al desmontar la app.

Se mantienen aviso cerrado, esquina inferior derecha, colores, avatar y burbujas; se agregan acciones, registro accesible con aria-live, foco al abrir, Enter, Escape para cerrar y scroll automático. Motion usa transiciones discretas y la configuración global de movimiento reducido; se evita la animación repetida del botón cuando se solicita movimiento reducido. El panel tiene altura acotada a la ventana y scroll interno.

## Tests y build

npm test: 51 pruebas aprobadas, 0 fallos: las 40 anteriores se mantienen y se agregan 11 sobre intents, búsqueda y ranking, ausencia de resultados, precios reales/stock, consulta válida y privacidad, folio inexistente, carrito vacío/con artículos, fallback y ausencia de acciones administrativas, cambio de flujo con opciones rápidas, reinicio y límite de historial.

npm run build: correcto con Vite, sin advertencias de compilación. npm run dev -- --host 127.0.0.1: iniciado correctamente en http://127.0.0.1:5174/ porque 5173 ya estaba ocupado. No se detuvo el servidor existente.

## Pruebas manuales realizadas

1. Abrir: saludo y ocho opciones visibles; input enfocado.
2. Cerrar y reabrir: aviso cerrado y continuidad de los mensajes.
3. Texto libre y Enter: búsqueda «quiero un soporte para audífonos».
4. Resultados: soporte para audífonos $24.90 Disponible y soporte control gamer $21.00 Agotado, procedentes del catálogo.
5. Búsqueda sin resultados mediante el flujo de búsqueda: mensaje previsto y Ver catálogo.
6. Ver producto: navegación a /producto/3 sin perder el chat.
7. Personalizado: respuesta y botón a /personalizado.
8. Cotización válida: creación de solicitud ficticia en /personalizado y consulta de COT-20261001-0001 en el bot; se mostraron solo los cuatro campos públicos.
9. Cotización inválida COT-20261001-9999: mensaje previsto, reintento y nueva solicitud.
10. Tiempo de entrega: referencia de 2–5 días y aclaración de estimación sin garantía.
11. Métodos de pago: ausencia de pago en línea; sin métodos inventados.
12. Carrito vacío: mensaje y Explorar productos.
13. Carrito con artículos: se agregó un soporte desde la tienda; el bot reflejó una unidad y $24.90. Después se eliminó el artículo de prueba y quedó vacío.
14. Botones: se recorrieron catálogo, detalle de producto, personalizado, carrito y consulta pública por folio.
15. Texto libre de precios: precios actuales del soporte.
16. Fallback «astronomía»: mensaje honesto con opciones disponibles.
17. Nueva conversación: saludo y ausencia del historial previo, confirmado visualmente.
18. Navegación SPA conserva chat y estado abierto; montaje único comprobado en código y recorridos.
19. Vista móvil 390×844 y escritorio: panel, scroll, acciones e input visibles; se restauró el viewport al finalizar.
20. Consola capturada: sin errores ni advertencias.

Quedó una cotización ficticia para la prueba en el origen local 5174; no se usaron datos personales reales. No se cambió el almacenamiento de la tienda en el origen 5173. La prueba del límite de 30 mensajes se realizó automáticamente. El movimiento reducido se verificó en la configuración y código; no se cambió la preferencia del sistema operativo.

## Errores, advertencias y límites

No quedan errores conocidos en los recorridos comprobados. Durante la validación, una recarga de la página dejó cerrado el chat y una acción del controlador no encontró el input; se reabrió y continuó la prueba. No constituye persistencia entre recargas, que deliberadamente no se implementó. Git advirtió de la conversión automática LF a CRLF de ChatAssistant.jsx según la configuración local; no afecta el build.

No hay comprensión general: las reglas son coincidencias simples, y las búsquedas pueden incluir resultados relacionados por palabras compartidas. No se garantizan tiempos de entrega. Pagos y contacto directo no están habilitados. La consulta de folios conserva los límites de privacidad y localStorage de Fase 5; la descripción resumida es pública. No se agregó IA, API, backend, base de datos, pagos, soporte real, WhatsApp, correo, pedidos o notificaciones. No se continuó con fases posteriores.
