# Fase 6.5 — Rediseño visual premium / UI-UX polish

## Alcance y análisis

Se revisaron Hero, Personalizado, ProductForm, ProductCard, páginas de nuevo/editar, RouteShell y CSS existentes. Esta fase modifica exclusivamente esas interfaces y sus componentes visuales. Se conservan coral, negro, crema, fotografía protagonista y tipografía editorial.

ProductContext, CartContext, AuthContext, QuoteContext, motor del asistente, permisos, credenciales, rutas, folios, persistencia, CRUD y validaciones no se modificaron. No se agregó backend, IA, librería ni ruta de negocio. Carrito, login, dashboard, cotizaciones administrativas, chatbot y catálogo mantienen su diseño.

## Archivos creados

- src/components/HeroVisual.jsx: escena del Hero mediante Motion.
- src/components/FormSection.jsx: fieldset editorial numerado reutilizable.
- src/components/FormProgress.jsx: indicador informativo del formulario.
- src/components/UploadZone.jsx: zona de selección/arrastre, preview y controles; sin compresión propia.
- src/components/admin/ProductLivePreview.jsx: tarjeta de producto en vivo, solo visual.
- src/utils/formProgress.js: cálculo aislado de secciones con información.
- src/styles/visualPolish.css: estilos confinados a las tres áreas de esta fase.
- tests/formProgress.test.js: tres pruebas del nuevo cálculo visual.
- PHASE_6_5_VISUAL_POLISH.md: este informe.
- artifacts/phase6-5/: capturas de Hero, Personalizado, confirmación y Product Studio en escritorio/móvil.

## Archivos modificados

- src/components/Hero.jsx: reemplazo del bloque visual por HeroVisual, conservando copy, fotografía y enlaces.
- src/pages/Personalizado.jsx: encabezado editorial, agrupación, progreso, upload compartido, CTA y confirmación.
- src/components/admin/ProductForm.jsx: dos columnas con preview, agrupación e imagen compartida; mismas reglas y callback de guardado.
- src/components/ProductCard.jsx: prop opcional preview; su comportamiento habitual se conserva. El modo visual evita enlaces y acciones de compra.
- src/pages/admin/AdminProductNew.jsx: eyebrow Product Studio y CTA Publicar producto, con la misma acción previa de creación.
- src/pages/admin/AdminProductEdit.jsx: eyebrow Product Studio y misma acción Guardar cambios.
- src/main.jsx: importa el CSS visual después de los estilos existentes.
- README.md: resumen breve de Fase 6.5.

## Hero: profundidad sin Three.js

Se utiliza useMotionValue para coordenadas normalizadas del cursor, useSpring para suavizarlas y useTransform para tilt y desplazamientos. El movimiento se limita a ±4° horizontal y ±3° vertical. Fondo/cuadrícula, círculo, fotografía y tarjeta utilizan desplazamientos y profundidades diferentes. La imagen conserva su URL original y flota lentamente 6 px en ciclos de ocho segundos. La entrada combina opacity, scale y una rotación de un grado. El reflejo radial tenue sigue al cursor mediante variables CSS.

Los handlers son locales al Hero, sin listeners globales ni setState en cada movimiento. Al salir el cursor vuelve al centro. Los eventos táctiles no activan tilt; en móvil queda el float pequeño. useReducedMotion desactiva seguimiento, float y entrada con transformaciones; CSS elimina transformaciones de las capas bajo prefers-reduced-motion. No se añadieron Three.js ni GSAP.

## Personalizado: crea tu pieza

Encabezado grande con acento serif, subtítulo y figura abstracta decorativa hecha con CSS. Sigue siendo un único formulario:

1. Cuéntanos tu idea: nombre, correo, teléfono y descripción.
2. Define los detalles: medidas, color, cantidad y comentarios.
3. Muéstranos una referencia: URL o imagen desde dispositivo.

Los campos, IDs, obligatoriedad, validaciones, preparación de imágenes y addQuote se mantienen. Se agregó estado visual del nombre del archivo y del botón. La confirmación muestra icono, folio destacado y las acciones de inicio, nueva solicitud y consulta.

FormProgress refleja qué grupos contienen información; no indica validez ni bloquea envío. La cantidad inicial de uno no marca por sí sola información añadida; editar a más de uno sí. La referencia se marca al cargar correctamente el preview y sigue siendo opcional. Los contadores muestran caracteres actuales, sin nuevos límites.

## Product Studio

El formulario permanece a la izquierda y el preview a la derecha en escritorio. El preview lee únicamente los valores locales del formulario: nombre, categoría, precio, stock, etiqueta, descripción e imagen. Reutiliza ProductCard con preview=true y no permite navegar a un producto aún no guardado ni agregarlo al carrito. Stock cero muestra Agotado; stock positivo muestra Disponible. No se guarda hasta enviar el formulario con el callback original.

El preview es sticky en escritorio y estático debajo del formulario en móvil. La URL, archivos y validaciones siguen en ProductForm. Publicar producto, Guardar cambios y Cancelar tienen jerarquía y microinteracciones; Cancelar navega al mismo listado que el enlace Volver ya existente. Los cambios de texto son visuales, sin alterar la acción real.

## Upload compartido

UploadZone gestiona solo presentación y selección: borde discontinuo, símbolo, instrucciones, botón accesible, arrastre de una imagen, preview grande, nombre y reemplazar/quitar. Ambos padres siguen usando prepareImageFile de Fase 4.1. No contiene lector de archivos, canvas, compresión ni almacenamiento. El drop y el selector invocan el mismo callback; durante procesamiento se bloquean reemplazo/quitar. El input se limpia tras procesar para poder seleccionar nuevamente el mismo archivo.

## Motion, responsive y accesibilidad

Entradas suaves de fieldsets al entrar en pantalla, entrada del preview y success, hover/press en botones y tarjeta, transición del progreso y tilt/parallax del Hero. No se añadieron animaciones repetidas fuera del float pequeño del Hero. Se conserva MotionConfig reducedMotion=user.

Grid adaptable en escritorio y tablet; una columna y preview debajo a 820 px o menos. Se revisó 390×844 y el escritorio disponible (aproximadamente 1265×712). Las medidas DOM de Personalizado, Product Studio y Home dieron scrollWidth igual a clientWidth: sin overflow horizontal de página. La navegación móvil administrativa conserva su desplazamiento horizontal interno previo. Los inputs usan 16 px en móvil y textarea redimensionable verticalmente.

Fieldsets con legend, labels, IDs de Personalizado, alt de previews, anuncios de errores/status y focus visible. Se añadió aria-invalid en campos administrativos y nombres accesibles estables para que errores o contadores no alteren el nombre del campo. El upload tiene botón y selector de teclado como alternativa al arrastre. Los elementos abstractos/reflejos son decorativos y no interceptan interacción. Se oscureció el coral de textos pequeños y se usa texto oscuro sobre el CTA coral en las áreas nuevas. No se modificaron estilos del header: los inputs nuevos se acotan a sus formularios.

## Validaciones realizadas

### Automatizadas

npm test: 54 pruebas aprobadas, 0 fallos. Se mantuvieron las 51 anteriores sin modificar y se añadieron tres sobre progreso vacío, secciones con información/imagen lista y referencia opcional sin mutar datos ni alterar validación.

npm run build: finalizó correctamente con Vite, sin advertencias de compilación. npm run dev -- --host 127.0.0.1: inició correctamente en http://127.0.0.1:5175/ al estar ocupados 5173 y 5174; no se detuvieron los servidores previos.

### Manuales

- Hero: composición, fotografía, float y profundidad revisados en escritorio y móvil. Un movimiento real del cursor produjo matrix3d en la escena, confirmando tilt. Se revisaron las capas y límites en código. No se activó la preferencia reducida del sistema durante el recorrido; sus ramas y CSS se verificaron en código. El navegador usado reportó prefers-reduced-motion=false.
- Personalizado: envío vacío produjo los errores anteriores; se completaron nombre, correo, descripción y color; se subió una PNG, se mostró preview y nombre, y los tres grupos cambiaron a Con información. Envío creó COT-20261002-0001 y mostró la nueva tarjeta de confirmación. Referencia opcional y validaciones originales se mantienen por pruebas existentes.
- Product Studio: envío vacío mostró errores; se editaron todos los campos, se cargó una imagen y se comprobó preview en vivo, Agotado para cero y Disponible para tres unidades. Se publicó el producto temporal a $35, se abrió editar y se guardó a $39; ambos mostraron los toasts existentes. Después se eliminó únicamente ese producto de prueba y quedaron los cuatro originales.
- Mobile: Personalizado, Hero y Product Studio revisados a 390×844; preview debajo del formulario confirmado visualmente. Se restauró el viewport al finalizar.
- Regresiones: el asistente encontró la nueva cotización por folio y mostró únicamente la proyección pública. El carrito recibió un llavero, mostró una unidad y $12.90, y después se retiró el artículo de prueba. La consulta pública y CRUD mantienen sus pruebas aprobadas.
- Consola capturada: sin errores ni advertencias del sitio durante los recorridos.

Se dejó una solicitud ficticia con imagen en el origen de prueba 5175. No se usaron datos personales reales. La selección mediante botón fue probada en ambos uploads; el evento nativo de arrastre de archivo no se ejercitó con el controlador, aunque comparte el mismo callback y se revisó en código. No se cambió la preferencia de movimiento del sistema ni se probó físicamente una tablet independiente.

## Errores, advertencias y decisiones

No quedan errores conocidos en los flujos comprobados. Durante una navegación rápida de prueba, el controlador esperaba el carrito mientras aún estaba en Home; se inspeccionó la página, se repitió el enlace y se verificó el carrito. No se modificó el router por ese intento.

Git advirtió de la conversión automática LF a CRLF de Hero.jsx, main.jsx y Personalizado.jsx según la configuración local. No hubo errores de whitespace en git diff --check ni advertencias de compilación.

Los estados Guardando de los botones se vinculan a la operación existente, que es síncrona y local: pueden ser breves. Preparando imagen es visible durante la compresión. No se añadieron retrasos artificiales ni cambios al guardado para hacer durar una animación.

Las fotografías externas siguen dependiendo de sus URLs previas. El progreso es informativo, no un wizard ni una comprobación de completitud. La tarjeta en vivo representa el borrador, no modifica ProductContext. Los estilos se importan en una hoja nueva y se acotan al alcance autorizado. No se continuó con otra fase.
