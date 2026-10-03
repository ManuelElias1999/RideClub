# RideClub · Arquitectura frontend

React 19 + TypeScript + Vite. Interfaz responsive con CSS propio, Lucide y QRCode. Fotografías, logos y tipografía locales; sin dependencias de imágenes remotas al ejecutar la demo.

## Módulos

- `src/data/catalog.ts`: nueve modelos con fuente, mercado, precio cuando está publicado y especificaciones; nueve recompensas propuestas; reglas de puntos.
- `src/lib/demo.ts`: estado local, cuentas, USDT ficticio, compras idempotentes, referidos, puntos por marca, emisión y consumo de cupones. Funciones puras que rechazan operaciones inválidas antes de cambiar el estado.
- `src/lib/phone.ts`: regiones, prefijos y normalización internacional del celular; sin SMS ni verificación real.
- `src/components/Checkout.tsx`: resumen de compra, saldo antes/después y comprobante de simulación.
- `src/components/Marketplace.tsx`: catálogo, filtros, búsqueda, orden, favoritas y ficha del modelo.
- `src/components/Rewards.tsx`: catálogo de propuestas y confirmación de canje.
- `src/components/Auth.tsx`: creación de perfil por correo, celular regional y código opcional, marca vinculada obligatoria, ingreso de demo y resultado del registro.
- `src/components/Club.tsx`: perfil, wallet pendiente, saldo USDT ficticio, puntos por marca, compras, tarjeta visual de beneficio, QR, actividad y referidos.
- `src/components/Workshop.tsx`: acreditar actividades confirmadas, validar cupones y exportar actividad.
- `src/components/Dashboard.tsx`: administración global y workspace empresarial con métricas, filtros, exportaciones, clientes, compras, catálogos, canjes y wallets.
- `src/data/CatalogContext.tsx`: catálogo dinámico derivado de empresas autorizadas y elementos publicados.
- `src/lib/business.ts`: control de alcance por rol, consultas agregadas, auditoría y operaciones de empresas, motos, recompensas y wallets.
- Las reglas de puntuación pertenecen a cada empresa y guardan importe y vigencia para compra, referido, mantenimiento y evento. Cada acreditación registra `expiresAt`; al cargar la aplicación, los vencimientos pendientes descuentan el saldo una sola vez y generan un movimiento trazable.
- La gestión de clientes pertenece a cada empresa: permite altas, edición, bloqueo temporal y baja lógica solo dentro de su marca. La baja conserva compras y canjes; el administrador global mantiene acceso de consulta y el backend deberá aplicar las mismas decisiones mediante RBAC y auditoría persistente.
- `src/components/ui.tsx`: diálogos nativos, logos y componentes comunes.
- `src/App.tsx`: composición, navegación por hash, persistencia y operaciones del usuario.

## Estado y límites

El estado se guarda en `localStorage` (`rideclub-demo-v1`). No es compartido entre dispositivos ni navegadores. El correo se normaliza y no puede duplicarse dentro de la demo. No existe autenticación real ni verificación de correo. Los roles locales son `client`, `company` y `admin`. El administrador consulta toda la plataforma y gestiona altas y permisos de empresas, pero no opera clientes ni catálogos; una empresa solo puede consultar y modificar recursos vinculados a su `companyId`; el cliente no puede ejecutar operaciones administrativas. Esta separación local de vistas y acciones no es autorización segura y deberá repetirse en cada endpoint del backend.

El administrador registra empresas con correo, estado e identidad visual. `active` las publica en landing y registro; `pending` las mantiene fuera del catálogo; `suspended` además bloquea sus escrituras. El primer ingreso con el correo asignado crea una sesión empresarial local. El catálogo dinámico admite nuevas marcas sin modificar las vistas, y la auditoría registra cambios administrativos. Las eliminaciones de motos y recompensas son archivados recuperables para no romper el historial.

Un perfil nuevo empieza con cero puntos. La cuenta de Manuel tiene 1.000 puntos Zontes para el recorrido de demo. Cada perfil recibe un número aleatorio de ocho dígitos que no se repite dentro del estado local y un enlace `?ref=NUMERO#club`. El formulario admite código opcional y precarga el del enlace. Solo acepta códigos existentes en este navegador. Registrar un referido no acredita puntos: su primera compra de prueba premia automáticamente a quien lo invitó una sola vez. La confirmación manual de referido en taller comparte la protección contra duplicados, incluso entre marcas.

El perfil contiene `wallet: {status: 'pending', chainId: 84532}`. **No contiene una dirección inventada, claves privadas ni una wallet real.** En producción, el proveedor de cuentas por correo debe provisionar la wallet y devolver su dirección antes de indicar que existe.

El canje comprueba usuario, saldo de la marca y cupos; en una sola transición local descuenta puntos, crea el cupón y registra la actividad. El uso comprueba existencia, marca, vigencia, uso previo, nombre del taller y la casilla de autorización del cliente. No vuelve a descontar puntos. El cupón usado sigue en el historial. El QR solo codifica su identificador; no prueba titularidad ni consentimiento criptográfico.

## Compras y compatibilidad con cuentas anteriores

`balanceUSDT` es saldo ficticio independiente de los puntos y de una wallet. Las cuentas nuevas reciben 20.000 USDT de prueba. `loadDemo` conserva la clave y versión anteriores y agrega ese importe únicamente cuando falta el campo; no repone saldo gastado al recargar. Conserva cuentas, puntos, referidos, favoritas, cupones e historial anteriores. El celular queda opcional para perfiles antiguos y es obligatorio en registros nuevos. La marca también es obligatoria en nuevos registros. Se conserva la marca previamente guardada; las cuentas sin marca pueden elegirla en Mi club, sin cambiar puntos ni saldo USDT. `role` se normaliza a `client` cuando no existía; nuevos registros siempre son clientes. `enterAdminDemo` crea o reutiliza una cuenta pública de administrador de pruebas sin modificar el perfil del cliente.

`buy` consulta el precio del catálogo, comprueba cuenta y saldo, descuenta USDT, agrega 1.000 puntos de la marca, guarda el comprobante y acredita el referido elegible en una transición inmutable. Repetir el mismo `operationId` y modelo devuelve el resultado anterior. No se compran modelos sin precio publicado. `fundDemo` permite añadir 20.000 USDT ficticios desde Mi club.

La tarjeta visual incluye foto ilustrativa, beneficio, marca, número, estado, vigencia y condiciones. El QR se despliega solo para beneficios vigentes y disponibles. Tras validar el servicio, se marca consumido con una quema simulada y permanece el comprobante. El QR actual no es un NFT.

## Etapa siguiente: backend + EVM

Red prevista: Base Sepolia, chain ID 84532. No hay contratos desplegados en esta entrega.

1. [Sincronización con la base de clientes existente y roles](CUSTOMER_INTEGRATION.md). Autenticación por correo con verificación y sesiones seguras; proveedor de wallet embebida que preserve las garantías de custodia acordadas.
2. API de catálogo, cuentas, actividades, referidos, saldos y cupones; validación de roles y claves de idempotencia de facturas/actividades.
3. Registro de compras confirmado por la tienda o CRM. La cadena no puede comprobar por sí sola una compra física.
4. Puntos ERC-20 por marca o contabilidad por marca equivalente; restricciones de transferencia y política de vencimiento por definir con la empresa.
5. Cupones ERC-721 personales: consumo de puntos y emisión en una sola transacción; expiración, autorización del cliente y rol del taller para consumir y quemar el cupón.
6. Desafío de uso firmado, nonce y vigencia corta; evitar que una captura del QR autorice el uso. El servidor debe verificar la titularidad y no confiar en una casilla del frontend.
7. Base de datos para datos personales, catálogo e historial. Eventos on-chain para emisión y consumo; indexación y conciliación de operaciones pendientes, fallidas o reorganizadas.

Los componentes actuales pueden conservar su presentación al sustituir la persistencia local y las transiciones por llamadas a la API con estados de carga y error. No se debe reutilizar la demo como autenticación o autorización de producción.

Para el NFT real recomendamos consumir y quemar después de confirmar el servicio, con autorización del titular y permiso del taller. La imagen describe el beneficio; los atributos deben incluir servicio, marca y vigencia, sin correo ni celular públicos. El historial del servicio permanece en el backend tras la quema. Referencia técnica: [OpenZeppelin ERC721Burnable](https://docs.openzeppelin.com/contracts/5.x/api/token/erc721#ERC721Burnable).
