# Fase 6.6 — Ajustes visuales y flujo por pasos

## Alcance

Refinamiento de Hero, Personalizado y consulta pública. No se modificaron contextos, reglas de negocio, folios, almacenamiento, autenticación, permisos, carrito, catálogo ni asistente. Sin dependencias nuevas. Los cambios pendientes de la Fase 6.5 se conservaron.

## Hero

Se retiró la tarjeta “Hecho para ti / Personalización disponible”, también en móvil. La fotografía, composición, tilt, parallax, float y reflejo conservan su implementación. La tarjeta era absoluta: retirarla no deja espacio vacío en el flujo.

## Stepper

Un único formulario con tres pasos y una sola sección montada a la vez:

1. Tu idea: nombre, correo, teléfono y descripción.
2. Detalles: medidas, color, cantidad y comentarios.
3. Referencia: URL, selección de archivo y preview opcionales.

Siguiente reutiliza validateQuote y filtra los errores del paso actual. No se añaden reglas de negocio. Anterior conserva todos los valores y la imagen. Enter en los primeros pasos avanza; addQuote solo se invoca al enviar desde el último. Se mantiene la validación completa y el control de carga de imagen al enviar.

La barra 01/02/03 usa el paso real, aria-current y progreso 33/67/100 %. AnimatePresence en modo wait anima el cambio durante 180 ms. Durante la transición se bloquea la navegación repetida; al terminar, el foco y la vista se sitúan al inicio del nuevo paso. Enviar otra solicitud reinicia el stepper. La confirmación conserva composición, folio, acciones y animación aprobadas.

## Círculo y Motion

Los anillos decorativos giran juntos una vuelta cada 100 segundos con MotionValue, sin actualizar React en cada frame. El texto decorativo permanece fijo. La animación se detiene al desmontar y con useReducedMotion; CSS también elimina la transformación bajo prefers-reduced-motion. Se conserva MotionConfig reducedMotion=user. La rotación se comprobó después de recargar. La preferencia reducida se revisó en código; no se cambió la configuración del sistema para probarla.

## Consulta de cotización

Encabezado editorial, formulario con folio y CTA, estado inicial, folio inexistente y tarjeta de resultado. Transición discreta de resultados. Se mantienen getPublicQuoteByFolio, normalización, búsqueda y privacidad existentes: solo folio, fecha, estado y descripción resumida. El aviso local original se conserva.

## Responsive y comprobaciones

Revisión visual en 1440×1000 y 390×844. Home, Personalizado, consulta y Product Studio dieron scrollWidth igual a clientWidth (1425 px en escritorio y 375 px en móvil, descontando la barra vertical). Una columna en móvil, campos de 16 px y acciones accesibles.

Comprobado en navegador: Hero sin tarjeta; paso 1 vacío bloqueado; avance con campos válidos y Enter; cantidad cero bloqueada; regreso con datos conservados; paso 3; archivo de prueba y preview optimizado a 1200×900; regreso conservando imagen; envío y confirmación; consulta del folio generado y uno inexistente; consulta después de recargar. Product Studio nuevo mantiene validación y preview; editar mantiene los campos y permite guardar los mismos valores. Sus componentes y estilos no se modificaron en esta fase.

## Tests y build

- npm test: 60/60, incluidos los 54 anteriores sin eliminar ni modificar y seis nuevos en quoteStepper.test.js para paso actual, validación, conservación de valores y progreso al avanzar/retroceder.
- npm run build: correcto.
- Sin errores ni advertencias de tests, build o consola en la revisión final.
- git diff --check: sin errores de espacios; avisos de conversión LF a CRLF en Hero.jsx y main.jsx, archivos pendientes de la fase anterior.
- Evidencia visual: artifacts/phase6-6/.

## Archivos de esta fase

Creados: src/utils/quoteStepper.js, tests/quoteStepper.test.js, este documento y capturas en artifacts/phase6-6/.

Modificados: src/components/HeroVisual.jsx, src/components/FormProgress.jsx, src/pages/Personalizado.jsx, src/pages/Cotizacion.jsx y src/styles/visualPolish.css.
