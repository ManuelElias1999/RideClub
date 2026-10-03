# RideClub

Frontend de fidelización multimarca para **Zontes, Kiden y NIU**, creado para Hackathon By Paseo 2026.

**Cada compra, una nueva recompensa.** Descubre motos reales, acumula puntos por marca y explora un catálogo de beneficios que se obtienen como cupones NFT de un solo uso.

![Vista de RideClub](docs/preview-desktop.jpg)

[Vista móvil](docs/preview-mobile.jpg) · [Verificación de esta entrega](docs/QA.md)

## Ejecutar

Requisitos: Node.js 22.12 o superior y npm.

```bash
cd frontend
npm ci
npm run dev
```

Abre la URL que muestra Vite, normalmente `http://localhost:5173`.

```bash
npm test
npm run build
npm run preview
```

Si el entorno restringe la enumeración de interfaces de red:

```bash
npm run dev -- --host 127.0.0.1
```

## Qué incluye esta etapa

- Catálogo de nueve motos: tres por marca, con fotografías originales y fuentes enlazadas.
- Filtros por marca, estilo, búsqueda, orden y favoritas.
- Fichas de producto con especificaciones, precios publicados en USDT cuando existen y enlaces al modelo de origen.
- Catálogo de nueve **recompensas propuestas**, con reglas, costos, cupos y vigencia de demo.
- “Mi club”: saldo separado por marca, perfil local, favoritas, referidos, cupones y actividad.
- Canje de puntos por un cupón NFT **simulado**, con QR legible y código único.
- Vista de taller/admin para acreditar actividades confirmadas, validar cupones, exportar CSV y reiniciar la demo.
- Historial que conserva los cupones utilizados, rechaza un segundo uso y valida vencimientos.
- Diseño responsive, navegación por hash, diálogos accesibles, foco de teclado y reducción de movimiento.
- Fotos, logos y fuentes alojados dentro del frontend para evitar dependencias de imágenes externas durante la demo.

## Recorrido de demostración

1. Abre **Mi club**: saldo inicial de **1.000 puntos Zontes**. NIU y Kiden comienzan en cero.
2. Ve a **Recompensas** y elige **Mantenimiento básico Zontes**, por **500 puntos**.
3. Confirma: quedan **500 puntos** y un cupón disponible con QR.
4. Abre el cupón y pulsa **Probar validación en taller**.
5. En **Validar cupón**, selecciona el cupón y su marca; confirma la autorización del cliente y registra su uso.
6. En **Mi club → Utilizados y vencidos**, el cupón sigue visible como utilizado. No se descuentan más puntos.
7. Intenta validar el mismo código nuevamente: la demo lo rechaza.
8. Para probar NIU o Kiden, registra una compra confirmada de demo en la vista de taller. Cada referencia única se acredita una sola vez por marca.

## Estado de la integración

**Esta entrega es exclusivamente frontend.** No contiene backend, contratos, autenticación real, pagos ni conexión a una wallet. No procesa compras ni emite tokens/NFTs en ninguna red.

Los saldos y cupones se guardan en `localStorage`, únicamente en el navegador actual. El panel administrativo es una simulación accesible para demostrar el flujo; no es un control de permisos de producción. El QR identifica un cupón de demo, no es una prueba criptográfica de titularidad.

La siguiente etapa usará **EVM sobre Base Sepolia (chain ID 84532)**. Se prevén puntos tokenizados y cupones ERC-721 que se consumen en una función autorizada de canje, con confirmación del cliente y del taller. Esa integración debe reemplazar los estados locales, validar roles y actividades en el servidor y registrar eventos verificables.

## Datos comerciales y marcas

Zontes y NIU tienen fuentes locales de Bolivia. Los tres modelos Kiden son referencias de distribuidores en Argentina y Sudáfrica, **sin afirmar disponibilidad local**. Las recompensas, porcentajes de descuento, saldos, existencias y reglas de acumulación son propuestas de hackathon que requieren aprobación de las marcas.

Precios y especificaciones son referencias de las páginas consultadas el **3 de octubre de 2026**. No se realiza conversión entre USDT y bolivianos. Algunos sitios fuente tienen inconsistencias: se omiten las cifras ambiguas en vez de presentarlas como especificaciones confirmadas.

Ver [fuentes y recursos visuales](docs/SOURCES.md) y [arquitectura de frontend](docs/ARCHITECTURE.md).

## Estructura

```text
frontend/
  public/assets/       Fotografías, logos y tipografías locales
  src/components/      Catálogo, recompensas, club, taller y diálogos
  src/data/catalog.ts  Productos, fuentes y recompensas propuestas
  src/lib/demo.ts      Transiciones de la demo y persistencia
  src/lib/demo.test.ts Pruebas del flujo de puntos y cupones
  src/App.tsx          Navegación y composición de la aplicación
  src/styles.css       Identidad visual y diseño responsive
docs/
```
