# RideClub · Arquitectura frontend

React 19 + TypeScript + Vite. Interfaz responsive con CSS propio, Lucide y QRCode. Fotografías, logos y tipografía locales; sin dependencias de imágenes remotas al ejecutar la demo.

## Módulos

- `src/data/catalog.ts`: nueve modelos con fuente, mercado, precio cuando está publicado y especificaciones; nueve recompensas propuestas; reglas de puntos.
- `src/lib/demo.ts`: estado local, cuentas, referidos, puntos por marca, emisión y consumo de cupones. Funciones puras que rechazan operaciones inválidas antes de cambiar el estado.
- `src/components/Marketplace.tsx`: catálogo, filtros, búsqueda, orden, favoritas y ficha del modelo.
- `src/components/Rewards.tsx`: catálogo de propuestas y confirmación de canje.
- `src/components/Auth.tsx`: creación de perfil por correo y código opcional, ingreso de demo y resultado del registro.
- `src/components/Club.tsx`: perfil, wallet pendiente, saldos por marca, beneficios, QR, actividad y referidos.
- `src/components/Workshop.tsx`: acreditar actividades confirmadas, validar cupones y exportar actividad.
- `src/components/ui.tsx`: diálogos nativos, logos y componentes comunes.
- `src/App.tsx`: composición, navegación por hash, persistencia y operaciones del usuario.

## Estado y límites

El estado se guarda en `localStorage` (`rideclub-demo-v1`). No es compartido entre dispositivos ni navegadores. El correo se normaliza y no puede duplicarse dentro de la demo. No existe autenticación real ni verificación de correo. El panel de taller es una simulación sin control de roles.

Un perfil nuevo empieza con cero puntos. La cuenta de Manuel tiene 1.000 puntos Zontes para el recorrido de demo. Cada perfil recibe un número aleatorio de ocho dígitos que no se repite dentro del estado local y un enlace `?ref=NUMERO#club`. El formulario admite código opcional y precarga el del enlace. Solo acepta códigos existentes en este navegador. Registrar un referido no acredita puntos: la confirmación de su primera compra por el taller premia a quien lo invitó una sola vez.

El perfil contiene `wallet: {status: 'pending', chainId: 84532}`. **No contiene una dirección inventada, claves privadas ni una wallet real.** En producción, el proveedor de cuentas por correo debe provisionar la wallet y devolver su dirección antes de indicar que existe.

El canje comprueba usuario, saldo de la marca y cupos; en una sola transición local descuenta puntos, crea el cupón y registra la actividad. El uso comprueba existencia, marca, vigencia, uso previo, nombre del taller y la casilla de autorización del cliente. No vuelve a descontar puntos. El cupón usado sigue en el historial. El QR solo codifica su identificador; no prueba titularidad ni consentimiento criptográfico.

## Etapa siguiente: backend + EVM

Red prevista: Base Sepolia, chain ID 84532. No hay contratos desplegados en esta entrega.

1. Autenticación por correo con verificación y sesiones seguras; proveedor de wallet embebida que preserve las garantías de custodia acordadas.
2. API de catálogo, cuentas, actividades, referidos, saldos y cupones; validación de roles y claves de idempotencia de facturas/actividades.
3. Registro de compras confirmado por la tienda o CRM. La cadena no puede comprobar por sí sola una compra física.
4. Puntos ERC-20 por marca o contabilidad por marca equivalente; restricciones de transferencia y política de vencimiento por definir con la empresa.
5. Cupones ERC-721 personales: consumo de puntos y emisión en una sola transacción; expiración, autorización del cliente y rol del taller para consumir y quemar el cupón.
6. Desafío de uso firmado, nonce y vigencia corta; evitar que una captura del QR autorice el uso. El servidor debe verificar la titularidad y no confiar en una casilla del frontend.
7. Base de datos para datos personales, catálogo e historial. Eventos on-chain para emisión y consumo; indexación y conciliación de operaciones pendientes, fallidas o reorganizadas.

Los componentes actuales pueden conservar su presentación al sustituir la persistencia local y las transiciones por llamadas a la API con estados de carga y error. No se debe reutilizar la demo como autenticación o autorización de producción.
