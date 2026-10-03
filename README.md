# RideClub

Marketplace y club de fidelización para **Zontes, NIU y Kiden**, creado para Hackathon By Paseo 2026.

**Cada compra, una nueva recompensa.** Descubre nueve motos reales, gana puntos por marca y canjéalos por cupones de beneficios de un solo uso.

![RideClub en escritorio](docs/preview-desktop.jpg)

[Vista móvil](docs/preview-mobile.jpg) · [Mi club](docs/preview-club.jpg) · [Recompensas](docs/preview-rewards.jpg) · [Compra](docs/preview-checkout.jpg) · [Beneficio](docs/preview-benefit.jpg) · [Club móvil](docs/preview-mobile-club.jpg) · [Verificación](docs/QA.md)

## Ejecutar

Node.js 22.12+ y npm.

```bash
git clone https://github.com/ManuelElias1999/RideClub.git
cd RideClub/frontend
npm ci
npm run dev
```

Abre la URL que muestra Vite, normalmente `http://localhost:5173`.

```bash
npm test
npm run build
npm run preview
```

Para entornos con interfaces de red restringidas:

```bash
npm run dev -- --host 127.0.0.1
```

## Esta entrega

- Marketplace de nueve modelos reales: **703F, GK350, GK200**; **NQi Sport MY26, NQiX 300 MY26, NQiX 500 MY26**; **KD150-Z, KD250-V, KD150-GK**.
- Fotografías y logos de las marcas, tipografía local, filtros por marca/estilo, búsqueda, orden por precio/nombre y favoritas.
- Fichas con características, fuente y precios publicados en USDT cuando existen. Compra simulada con saldo USDT ficticio para Zontes y NIU; Kiden requiere cotización. Las consultas comerciales llevan al sitio de origen; no se procesan pagos reales.
- Registro local por nombre, correo, **celular con región y prefijo (+591 por defecto)** y **número de referido opcional**; ingreso por correo para cuentas del mismo navegador.
- Cada cuenta recibe un **número único de ocho dígitos** y un enlace de invitación. El enlace precarga el código al registrarse.
- Perfil con wallet **pendiente de creación** y configuración preparada para Base Sepolia. No se genera una wallet ficticia ni se guardan claves.
- “Mi club”: saldo USDT de prueba, puntos separados por marca, compras con comprobante, beneficios disponibles/usados/vencidos, favoritas, referidos y actividad.
- Nueve **recompensas propuestas**: mantenimiento o diagnóstico eléctrico, descuento en repuestos/accesorios y limpieza/revisión visual.
- Canje local por tarjeta visual de beneficio con foto de mantenimiento, estado, vigencia y QR desplegable. El beneficio se valida una sola vez; se conserva en el historial sin descontar puntos nuevamente.
- Taller demo para acreditar compras, mantenimientos, referidos y eventos, validar cupones y exportar CSV.
- Prevención de duplicados de referencias por marca y de recompensas repetidas al mismo referido.
- Diseño responsive, diálogos nativos, navegación por teclado y reducción de movimiento.

## Recorrido de demo

1. Pulsa **Iniciar sesión** e ingresa con tu correo de demo en este navegador, o elige **Entrar a la demo de Manuel**.
2. En **Mi club**, tienes **20.000 USDT de prueba**. Las cuentas existentes reciben este saldo una vez al actualizar, conservando sus puntos, referidos y beneficios. También puedes usar **Recargar 20.000 USDT demo**.
3. En **Marketplace**, abre **Zontes 703F → Comprar con USDT de prueba → Confirmar compra de prueba**.
4. El saldo queda en **8.510 USDT**, recibes **1.000 puntos Zontes** adicionales y se guarda un comprobante en **Mi club → Mis compras**. Recargar la página conserva los cambios.
5. En **Recompensas**, abre **Mantenimiento básico** Zontes y canjea 500 puntos. Aparece la tarjeta con foto; **Mostrar QR para el taller** despliega el identificador.
6. Pulsa **Probar validación en taller** y confirma la autorización del cliente y el uso. El beneficio pasa a **Utilizados y vencidos**, marcado **Consumido · quema simulada**.
7. Un segundo uso se rechaza. Se conserva el historial sin volver a descontar puntos.

Una compra de prueba es una transición local, sin pagos ni reserva comercial. El comprobante tiene una clave de operación para evitar cobrar o acreditar puntos dos veces al repetir una confirmación.

### Probar referidos

1. Copia el código de Manuel (**10002026**) o su enlace desde Mi club.
2. Sal de la demo y crea otra cuenta con un correo de prueba y ese código. La nueva cuenta empieza con cero puntos.
3. Compra una moto con precio en el marketplace usando el saldo de prueba.
4. La primera compra acredita **200 puntos de esa marca al invitador**, una sola vez por invitado. También puedes probar la confirmación manual en el taller; comparte la misma protección contra duplicados.
5. Ingresa a la demo de Manuel para consultar sus referidos y el saldo actualizado.

La opción **Sobre la demo y sus fuentes → Reiniciar datos de esta demo** restablece los datos locales.

## Estado de backend y blockchain

**Esta etapa es frontend.** No incluye backend, verificación de correo, autenticación segura, contratos, pagos, wallets, tokens ni NFTs reales. El saldo USDT ficticio, las compras, los puntos y cupones se guardan en `localStorage` del navegador actual; no se comparten entre dispositivos.

El taller demo tiene acceso libre para probar el flujo. Su casilla de autorización no sustituye una verificación de titularidad; el QR solo identifica el cupón local.

La siguiente etapa integrará **EVM en Base Sepolia (chain ID 84532)**: registro por correo con creación automática de wallet, puntos tokenizados y cupones ERC-721 que se consumen y queman con autorización del cliente y del taller. Se prevé descontar puntos y emitir el NFT en una sola transacción. Los cupones usados conservarán su historial.

## Datos de las marcas

Zontes y NIU usan catálogos locales de Bolivia. Kiden usa referencias de MotoFun Argentina y del catálogo oficial internacional; **su disponibilidad en Bolivia no está confirmada**. Los beneficios, descuentos, reglas, cupos y vigencias son propuestas para la hackathon, pendientes de aprobación comercial.

Consulta de fuentes: 3 de octubre de 2026. Ver [modelos, fuentes y recursos visuales](docs/SOURCES.md) y [arquitectura e integración futura](docs/ARCHITECTURE.md).

## Estructura

```text
frontend/
  public/assets/       Fotos, logos y tipografía locales
  src/components/      Marketplace, recompensas, registro, club y taller
  src/data/catalog.ts  Modelos, fuentes, beneficios y reglas propuestas
  src/lib/demo.ts      Cuentas, compras, USDT demo, referidos y cupones
  src/lib/phone.ts     Regiones, prefijos y validación del celular
  src/lib/demo.test.ts Pruebas del flujo de demo
  src/App.tsx          Navegación, composición y persistencia
  src/styles.css       Diseño responsive
docs/                  Arquitectura, fuentes, capturas y verificación
```
