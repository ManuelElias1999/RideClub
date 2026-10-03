# Verificación de RideClub

Fecha: 3 de octubre de 2026.

## Comprobaciones de código

- `npm run build`: TypeScript y compilación Vite completadas.
- `npm test`: seis pruebas Vitest completadas.
- `git diff --check`: sin errores de espacios.

Pruebas de dominio: canje atómico de 500 puntos, saldo por marca, conservación del cupón utilizado, segundo uso rechazado, saldo insuficiente, marca incorrecta, autorización requerida, vencimiento, cupos agotados, códigos únicos de ocho dígitos, normalización del correo, códigos inválidos, cuenta duplicada, recompensa al invitador y deduplicación de actividades.

## Recorrido real de navegador

Chrome headless con Playwright. Resultado: **PASS**, sin errores de JavaScript.

1. Nueve motos cargadas; filtros NIU, búsqueda sin resultados y restablecimiento del catálogo.
2. Ficha 703F y su especificación de 699 cc.
3. Ingreso a la demo de Manuel con 1.000 puntos Zontes.
4. Canje de mantenimiento por 500 puntos: saldo resultante 500, un cupón emitido y QR generado.
5. Uso con autorización en el panel del taller.
6. Segundo intento rechazado como ya utilizado; saldo sigue en 500.
7. Cupón conservado en “Utilizados y vencidos”.
8. Registro de una cuenta NIU: rechazo de código inexistente, aceptación de `10002026`, número propio de ocho dígitos y saldo inicial cero.
9. Perfil que indica wallet pendiente, sin dirección o claves ficticias.
10. Confirmación del referido en taller: 200 puntos NIU al invitador, no al invitado.
11. Recarga del navegador conserva saldo y actividad.
12. Exportación CSV descargada como `rideclub-actividad-demo.csv`.
13. Las cuatro vistas principales (`marketplace`, `recompensas`, `club`, `taller`) verificadas a 360, 390, 768 y 1440 px: 16 combinaciones sin desbordamiento horizontal.
14. Imágenes locales cargadas, navegación móvil funcional y enlace de invitación que precarga el código en un contexto nuevo.

Las capturas corresponden al frontend ejecutado, no a maquetas generadas. Se revisaron visualmente escritorio, móvil, Mi club y recompensas.

## Límites de esta verificación

Se verifica una demo local. No hay autenticación de producción, creación de wallet, pagos, contratos o transacciones de Base Sepolia que probar. Los roles y autorizaciones del taller son simulados. No se validó disponibilidad comercial de Kiden en Bolivia ni la aprobación de las recompensas por las marcas.
