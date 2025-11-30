# Diccionario de Datos — Backend (nomenclatura: español, snake_case)

**Última actualización:** 25-11-2025

Objetivo: proporcionar un Diccionario de Datos ordenado por uso/recurso y una sección de Endpoints separada. El documento describe qué campos aceptar y devolver, la convención de nombres (minúscula + `_`), ejemplos y reglas de compatibilidad entre formatos (español snake_case ↔ inglés camelCase).

Índice
- Diccionario de Datos (por recurso)
- Mapeo rápido (camelCase → snake_case)
- Notas de compatibilidad
- Endpoints (listado separado)
- Checklist de QA y próximos pasos

---

## Diccionario de Datos (por recurso)

Cada subsección contiene los campos principales usados internamente (español, snake_case), su tipo, obligatoriedad y ejemplo. Para cada recurso se indica si el backend realiza mapeo automático desde el frontend en camelCase.

### 1) Usuarios
- Compatibilidad de entrada: **no mapeado automáticamente** por defecto (puedo habilitarlo si se solicita).
- Campos (crear usuario):
  - `nombre` (string) — R — Ej: `"Juan"`
  - `apellido` (string) — R — Ej: `"Pérez"`
  - `correo` (string, email) — R — Ej: `"juan@ejemplo.com"`
  - `contrasena` (string) — R — Ej: `"Secreto123"` (se almacenará hasheada)

### 2) Direcciones
- Compatibilidad de entrada: **mapeo automático habilitado**. El backend acepta camelCase desde frontend y lo traduce a español snake_case.
- Campos (interno):
  - `calle` (string) — R — Ej: `"Av. Libertador"`  (equiv: `street`)
  - `numero` (string) — R — Ej: `"123"`  (equiv: `number`)
  - `comuna_id` (string) — R — Ej: `"13101"`  (equiv: `communeId`)
  - `codigo_comuna` (string) — O — Ej: `"13101"`  (equiv: `countyCode`)
  - `region_id` (string) — O — Ej: `"LIBERTADOR GRAL BERNARDO O HIGGINS"`  (equiv: `regionId`)
  - `codigo_postal` (string) — O — Ej: `"2720000"`  (equiv: `postalCode`)
  - `referencias` (string) — O — Ej: `"Timbrar en portería"`  (equiv: `references`)
  - `usuario_id` (string) — R — Ej: `"user_123"`  (equiv: `userId`)

### 3) Ciudades
- Compatibilidad de entrada: **no mapeado automáticamente** por defecto.
- Campos (interno):
  - `nombre` (string) — R — Ej: `"Santo Domingo"`  (equiv: `name`)
  - `codigo_postal` (string) — R — Ej: `"2720000"`  (equiv: `postalCode`)

### 4) Transportistas (Carriers)
- Compatibilidad de entrada: **mapeo parcial** — el endpoint de cotización acepta tanto el formato Chilexpress (camelCase) como el DTO interno en español; el adapter realiza la transformación necesaria.
- Campos (cotización):
  - Formato Chilexpress (aceptado tal cual):
    - `originCountyCode` (string) — R — Ej: `"STGO"`
    - `destinationCountyCode` (string) — R — Ej: `"PROV"`
    - `package` (object) — R — `{ weight: "2.5", height: "15", width: "25", length: "35" }`
    - `productType` (number) — R — Ej: `3` (1=Documento, 3=Encomienda)
    - `contentType` (number) — R
    - `declaredWorth` (string) — O
    - `deliveryTime` (number) — O

  - Formato interno (español, también aceptado):
    - `paquete`: `{ peso, alto, ancho, largo }`  (adapter mappea a `package`)
    - `tipo_producto` (number), `tipo_contenido` (number), `valor_declarado` (string/number), `tiempo_entrega` (number)
    - `codigo_cobertura_origen` / `comuna_origen_id`, `codigo_cobertura_destino` / `comuna_destino_id`

### 5) Envíos (Deliveries)
- Compatibilidad de entrada: **no mapeado automáticamente** por defecto (puedo habilitar mapeo si lo deseas).
- Campos (crear desde pago — interno):
  - `pago_id` (string) — R
  - `carrito_id` (string) — R
  - `usuario_id` (string) — R
  - `vendedor_id` (string) — R
  - `monto_total` (number) — R
  - `articulo_carrito` (array) — R — objetos: `producto_id` (string), `nombre` (string), `cantidad` (number), `precio` (number)
  - `paquete` (object) — R — `peso` (number), `largo` (number), `ancho` (number), `alto` (number)
  - `informacion_envio` (object) — R — `origen_direccion_id`, `destino_direccion_id`, `nombre_transportista`, `tipo_servicio`, `costo_estimado`
  - `valor_declarado` (number) — O
  - `notas` (string) — O

### 6) Respuestas comunes / Campos de salida
- Muchas respuestas devuelven claves en español snake_case, por ejemplo:
  - `numero_seguimiento` (string)
  - `estado` (string | enum)
  - `usuario_id` (string)
  - `creado_en` (Date string)

---

## Mapeo rápido (camelCase → snake_case)

Tabla rápida de referencia (usar en frontend):

| camelCase | español snake_case |
|---|---|
| trackingNumber | numero_seguimiento |
| status | estado |
| paymentId | pago_id |
| cartId | carrito_id |
| userId | usuario_id |
| sellerId | vendedor_id |
| carrierId | transportista_id |
| carrierName | nombre_transportista |
| serviceType | tipo_servicio |
| estimatedCost | costo_estimado |
| currency | moneda |
| originAddressId | origen_direccion_id |
| destinationAddressId | destino_direccion_id |
| items | articulos |
| productId | producto_id |
| weight | peso |
| length | largo |
| width | ancho |
| height | alto |
| declaredWorth | valor_declarado |
| notes | notas |
| createdAt | creado_en |
| email | correo |
| password | contrasena |
| firstName / lastName | nombre / apellido |
| street / number | calle / numero |
| communeId | comuna_id |
| countyCode | codigo_comuna |
| postalCode | codigo_postal |
| regionId | region_id |

---

## Notas de compatibilidad y reglas operativas

- **Regla general:** la nomenclatura interna es español + snake_case. El backend está preparado para aceptar ciertos payloads en camelCase y mapearlos internamente en los recursos indicados en el diccionario.
- **Qué ya acepta el backend sin cambios de frontend:**
  - `POST /api/addresses`, `PATCH /api/addresses/:id` — acepta camelCase y lo mapea.
  - `POST /api/carriers/quote` — acepta el payload **exacto** que Chilexpress espera (camelCase) y también acepta el DTO interno en español; el adapter mapea internamente cuando se recibe el DTO español.
- **Qué requiere actualmente español o mapeo manual:**
  - `POST /api/users`, `POST /api/cities`, `POST /api/deliveries/*` — estos esperan el DTO interno en español; si necesitas compatibilidad, puedo añadir mapeadores equivalentes.

---

## Endpoints (sección separada)

Esta sección enumera los endpoints y ejemplos de request/respuesta. Los endpoints se mantienen aparte del Diccionario de Datos para facilitar integraciones.

### Usuarios
- `POST /api/users` — Crear usuario
  - Body (interno): `{ nombre, apellido, correo, contrasena }`
  - Response: objeto usuario (sin `contrasena` en listados)

- `GET /api/users` — Listar usuarios
- `GET /api/users/:id` — Obtener usuario
- `PATCH /api/users/:id` — Actualizar usuario

### Direcciones
- `POST /api/addresses` — Crear dirección
  - Body (acepta camelCase o snake_case): ejemplo (camelCase enviado desde frontend):
```json
{
  "street":"test",
  "number":"111",
  "communeId":"PICHIDEGUA",
  "countyCode":"SALU",
  "postalCode":"",
  "references":"",
  "regionId":"LIBERTADOR GRAL BERNARDO O HIGGINS",
  "userId":"1"
}
```
  - El backend lo mapeará a `calle/numero/comuna_id/...` y validará con `CrearDireccionDto`.

- `GET /api/addresses?userId=...` — Listar por usuario (query `userId` convertido internamente a `usuario_id`)
- `GET /api/addresses/:id` — Obtener dirección
- `PATCH /api/addresses/:id` — Actualizar dirección (acepta camelCase o snake_case)

### Ciudades
- `POST /api/cities` — Crear ciudad (body: `{ nombre, codigo_postal }`)
- `GET /api/cities` — Listar
- `PATCH /api/cities/:id` — Actualizar

### Transportistas (Carriers)
- `POST /api/carriers/quote` — Solicitar cotización
  - Acepta:
    - Payload Chilexpress (ej. `originCountyCode`, `package`, `productType`, ...)
    - O bien DTO interno en español (`paquete`, `tipo_producto`, ...)
  - Response: puede devolver la respuesta cruda del proveedor; opcionalmente se puede mapear a `RespuestaCotizacionDto` si se desea consistencia.

- `POST /api/carriers` — Crear transportista (interno) — body: `{ nombre, credenciales, disponible }` (español)
- `PATCH /api/carriers/:id` — Actualizar transportista

### Envíos (Deliveries)
- `POST /api/deliveries/create-from-payment` — Crear envío desde pago (webhook)
  - Body (interno): `{ pago_id, carrito_id, usuario_id, vendedor_id, monto_total, articulo_carrito, paquete, informacion_envio, valor_declarado?, notas? }`

- `POST /api/deliveries/create` — Crear envío directo (desde frontend)
- `GET /api/deliveries/user/:usuario_id` — Listar envíos por usuario
- `GET /api/deliveries/tracking/:numero_seguimiento` — Buscar por número de tracking

---


