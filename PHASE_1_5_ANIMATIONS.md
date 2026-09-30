# Nube 3D — Fase 1.5: Animaciones y microinteracciones

Esta fase añade movimiento a la interfaz sin cambiar su estructura visual ni implementar funcionalidades de negocio nuevas.

## Dependencia añadida

- `motion` — Motion for React.

## Animaciones implementadas

- Transición suave entre rutas.
- Entrada animada del anuncio y navbar.
- Hero con aparición escalonada del texto y CTAs.
- Imagen principal con flotación lenta y glow respirando.
- Tarjeta flotante del hero con movimiento sutil.
- Categorías con reveal al hacer scroll y elevación al hover.
- Productos con stagger, elevación, zoom de imagen y microinteracciones en botones.
- Sección personalizada con entrada desde ambos lados.
- Pasos del proceso con microinteracción al hover.
- Frase y footer con reveal al entrar en viewport.
- Asistente con apertura/cierre animado, pulso suave y mensajes entrantes animados.
- Placeholders de rutas con entrada suave.
- Respeto a `prefers-reduced-motion` mediante `MotionConfig reducedMotion="user"` y CSS.

## Fuera de alcance

No se implementó todavía:

- Carrito funcional.
- Persistencia.
- Login real.
- Roles y permisos.
- Panel administrativo funcional.
- Respuestas reales del chatbot.
- Backend o base de datos.

## Ejecutar

```bash
npm install
npm run dev
```

## Validación recomendada

Revisar visualmente en escritorio y móvil:

1. Carga inicial del hero.
2. Scroll por categorías, productos, personalizado y footer.
3. Hover en tarjetas y botones.
4. Apertura/cierre del asistente.
5. Navegación entre rutas.
6. Consola del navegador sin errores.
