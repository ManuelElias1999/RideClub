# Verificación de RideClub

Fecha: 3 de octubre de 2026. Actualización de registro, compras y tarjeta de beneficio.

## Comprobaciones de código

- `npm run build`: TypeScript y compilación Vite completadas.
- `npm test`: diez pruebas Vitest completadas.
- `git diff --check`: sin errores de espacios.

Las pruebas cubren canje y consumo de un solo uso, saldo por marca, vigencia, consentimiento, cupos, registro y referido, teléfonos regionales, compras con descuento USDT y puntos atómicos, saldo insuficiente, modelos sin precio, reintentos idempotentes, recargas y migración de cuentas anteriores. Comprueban que no se repone saldo gastado al recargar y que un referido no se premia dos veces, incluso entre marcas o después de una confirmación manual del taller.

## Recorrido real de navegador

Chromium headless con Playwright. Resultado: **PASS**, sin errores de JavaScript.

1. El botón superior **Iniciar sesión** abre el ingreso por correo. El registro no pide una marca.
2. Cambio de región Estados Unidos (+1) a Bolivia (+591); registro con celular local de ocho dígitos y referido `10002026`.
3. La cuenta nueva guarda `+59170000000`, recibe 20.000 USDT ficticios y empieza con cero puntos.
4. En una pantalla de 1.978 px, el margen lateral de Mi club mide 48 px.
5. Compra de Zontes 703F por 11.490 USDT de prueba: saldo 8.510, 1.000 puntos Zontes al comprador y 200 al invitador.
6. Comprobante mostrado en **Mis compras**. Recargar el navegador conserva compra y saldos.
7. Recarga demo: el saldo pasa de 8.510 a 28.510 USDT ficticios.
8. Canje de mantenimiento por 500 puntos: saldo resultante 500. Tarjeta con foto cargada, marca y estado. El QR está oculto inicialmente y se despliega al solicitarlo.
9. Uso autorizado en el taller, segundo intento con nueva autorización rechazado, sin otro descuento de puntos.
10. El beneficio sigue en **Utilizados y vencidos**, marcado **Consumido · quema simulada**, sin un QR reutilizable.
11. Migración de un estado anterior sin saldo USDT ni compras: añade 20.000 USDT de prueba y conserva cuenta, puntos y cupón usado.
12. Las cuatro vistas (`marketplace`, `club`, `recompensas`, `taller`) revisadas a 360, 390, 768 y 1.978 px: 16 combinaciones sin desbordamiento horizontal ni imágenes locales rotas.
13. Perfil móvil: el celular y la información de wallet ocupan filas separadas. La pestaña de compras muestra el comprobante y los totales sin desbordamiento.

Capturas del frontend ejecutado: [escritorio](preview-desktop.jpg), [móvil](preview-mobile.jpg), [club](preview-club.jpg), [club móvil](preview-mobile-club.jpg), [recompensas](preview-rewards.jpg), [compra](preview-checkout.jpg) y [beneficio](preview-benefit.jpg). La foto ilustrativa del mantenimiento se generó con imagegen; las capturas muestran la aplicación real.

## Límites

Es una demo local. No hay autenticación de producción, verificación de celular o correo, creación de wallet, fondos reales, pagos, contratos o transacciones de Base Sepolia. Los roles, la autorización del taller y la quema se simulan. Disponibilidad comercial de Kiden en Bolivia y aprobación de las recompensas pendientes.
