# Diccionario de Datos — Backend (nomenclatura: español, snake_case)

Última actualización: 25-11-2025

Propósito: este documento describe los endpoints públicos más importantes, los campos que aceptan y devuelven, la convención de nombres (minúscula + `_` para varias palabras) y las reglas de compatibilidad con formatos en inglés/camelCase que el backend admite.

Resumen de compatibilidad
- Endpoints que aceptan ambos formatos (english camelCase o español snake_case):
  - `POST /api/addresses` (crear dirección)
  - `PATCH /api/addresses/:id` (actualizar dirección)
  - `POST /api/carriers/quote` (cotizar con carriers — acepta formato Chilexpress directamente y/o DTO interno español)

- Endpoints que actualmente esperan la nomenclatura interna en español (si quieres soporte adicional, pídelo):
  - Usuarios: `/api/users` (create/update)
  - Ciudades: `/api/cities`
  - Envíos (deliveries): `/api/deliveries` (create-from-payment, create)
  - CRUD transportistas: `/api/carriers` (create/update) — *nota: quote acepta ambos*.

Convención de nombres usada aquí
- Campos: en español, minúsculas y con guion bajo si >1 palabra. Ejemplos: `usuario_id`, `numero_seguimiento`, `codigo_postal`, `valor_declarado`.
- Tipos JS/TS: `string`, `number`, `boolean`, `object`, `array`, `Date`.

MAPEO RÁPIDO (inglés camelCase → español snake_case)
- trackingNumber → numero_seguimiento
- status → estado
- paymentId → pago_id
- cartId → carrito_id
- userId → usuario_id
- sellerId → vendedor_id
- carrierId → transportista_id
- carrierName → nombre_transportista
- serviceType → tipo_servicio
- estimatedCost → costo_estimado
- currency → moneda
- originAddressId → origen_direccion_id
- destinationAddressId → destino_direccion_id
- items → articulos
- productId → producto_id
- weight → peso
- length → largo
- width → ancho
- height → alto
- declaredWorth → valor_declarado
- notes → notas
- createdAt → creado_en
- email → correo
- password → contrasena
- firstName/lastName → nombre / apellido
- street/number → calle / numero
- communeId → comuna_id
- countyCode → codigo_comuna
- postalCode → codigo_postal
- regionId → region_id

------------------------------------------------------------

1) Usuarios

- Endpoints:
  - `POST /api/users` — crear usuario
  - `GET /api/users` — listar
  - `GET /api/users/:id` — obtener
  - `PATCH /api/users/:id` — actualizar

- Request (crear):
  - `nombre`: `string` — R — Ej: "Juan"
  - `apellido`: `string` — R — Ej: "Pérez"
  - `correo`: `string` (email) — R — Ej: "juan@ejemplo.com"
  - `contrasena`: `string` — R — Ej: "Secreto123" (se guardará hasheada)

- Response (crear/obtener): objeto usuario (sin `contrasena` en listados).

Compatibilidad: actualmente el endpoint espera los campos en español. Si tu frontend envía `email`/`password`, pide que habilitemos mapping — podemos añadir el mapeo con la misma estrategia usada en `addresses`.

------------------------------------------------------------

2) Direcciones

- Endpoints:
  - `POST /api/addresses` — crear dirección
  - `GET /api/addresses?userId=...` — listar direcciones de usuario (observa: query `userId` se convierte internamente a `usuario_id`)
  - `GET /api/addresses/:id` — obtener
  - `PATCH /api/addresses/:id` — actualizar

- Request (crear/actualizar) — formato interno (español):
  - `calle`: `string` — R — Ej: "Av. Libertador"
  - `numero`: `string` — R — Ej: "123"
  - `comuna_id`: `string` — R — Ej: "13101"
  - `codigo_comuna`: `string` — O — Ej: "13101"
  - `region_id`: `string` — O — Ej: "LIBERTADOR GRAL BERNARDO O HIGGINS"
  - `codigo_postal`: `string` — O — Ej: "2720000"
  - `referencias`: `string` — O
  - `usuario_id`: `string` — R

- Compatibilidad automática: el backend acepta también la versión en inglés/camelCase enviada desde el frontend (ej: `street`,`number`,`communeId`,`countyCode`,`regionId`,`postalCode`,`references`,`userId`). El servidor mapea automáticamente a los campos internos antes de validar y persistir.

Ejemplo (frontend en inglés → backend lo mapea internamente):

Request enviado (desde frontend):
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

Se transforma internamente a:
```json
{
  "calle":"test",
  "numero":"111",
  "comuna_id":"PICHIDEGUA",
  "codigo_comuna":"SALU",
  "codigo_postal":"",
  "referencias":"",
  "region_id":"LIBERTADOR GRAL BERNARDO O HIGGINS",
  "usuario_id":"1"
}
```

Response (ejemplo creado):
```json
{
  "id":"addr_abc123",
  "calle":"test",
  "numero":"111",
  "comuna_id":"PICHIDEGUA",
  "region_id":"LIBERTADOR GRAL BERNARDO O HIGGINS",
  "usuario_id":"1",
  "creado_en":"2025-11-25T11:40:00Z"
}
```

------------------------------------------------------------

3) Ciudades

- Endpoints:
  - `POST /api/cities` — crear ciudad
  - `GET /api/cities` — listar
  - `PATCH /api/cities/:id` — actualizar

- Request (crear):
  - `nombre`: `string` — R — Ej: "Santo Domingo"
  - `codigo_postal`: `string` — R — Ej: "2720000"

Compatibilidad: actualmente espera español; si quieres, puedo habilitar el mapeo desde `name`/`postalCode`.

------------------------------------------------------------

4) Transportistas (Carriers)

- Endpoints:
  - `POST /api/carriers/quote` — solicitar cotización (interfaz con proveedores como Chilexpress)
  - `POST /api/carriers` — crear transportista (interno)
  - `PATCH /api/carriers/:id` — actualizar transportista

- Payload de cotización aceptado:
  - A) Formato Chilexpress (aceptado tal cual):
    - `originCountyCode`: `string` — R
    - `destinationCountyCode`: `string` — R
    - `package`: `object` — R — `{ weight: "2.5", height: "15", width: "25", length: "35" }` (valores como `string` según spec)
    - `productType`: `number` — R (1 = Documento, 3 = Encomienda)
    - `contentType`: `number` — R
    - `declaredWorth`: `string` — O
    - `deliveryTime`: `number` — O

  - B) Formato interno (español) — también aceptado y mapeado internamente:
    - `paquete`: `{ peso, alto, ancho, largo }`
    - `tipo_producto`, `tipo_contenido`, `valor_declarado`, `tiempo_entrega`, `codigo_cobertura_origen`/`comuna_origen_id`, `codigo_cobertura_destino`/`comuna_destino_id`

Notas importantes:
- Si el frontend ya construye el payload en formato Chilexpress, NO lo modifiques — el backend acepta y reenviará a Chilexpress tal cual.
- Si envías el DTO en español, el adapter mapea `paquete` a `package` con los campos `weight/height/width/length` (casteando a `string` cuando corresponde).

Ejemplo (Chilexpress format — enviar tal cual desde frontend):
```json
{
  "originCountyCode":"STGO",
  "destinationCountyCode":"PROV",
  "package": { "weight":"2.5","height":"15","width":"25","length":"35" },
  "productType":3,
  "contentType":1,
  "declaredWorth":"25000",
  "deliveryTime":0
}
```

------------------------------------------------------------

5) Envíos (Deliveries)

- Endpoints claves:
  - `POST /api/deliveries/create-from-payment` — crear envío desde pago (webhook)
  - `POST /api/deliveries/create` — crear directamente (desde frontend)
  - `GET /api/deliveries/user/:usuario_id` — listar por usuario
  - `GET /api/deliveries/tracking/:numero_seguimiento` — buscar por tracking

- Request (crear desde pago) — formato interno esperado:
  - `pago_id`: `string` — R
  - `carrito_id`: `string` — R
  - `usuario_id`: `string` — R
  - `vendedor_id`: `string` — R
  - `monto_total`: `number` — R
  - `articulo_carrito`: `array` — R — objetos con `producto_id`(string), `nombre`(string), `cantidad`(number), `precio`(number)
  - `paquete`: objeto — R — `peso`(number), `largo`(number), `ancho`(number), `alto`(number)
  - `informacion_envio`: objeto — R — `origen_direccion_id`, `destino_direccion_id`, `nombre_transportista`, `tipo_servicio`, `costo_estimado`
  - `valor_declarado`: `number` — O
  - `notas`: `string` — O

Compatibilidad: actualmente estos endpoints esperan el DTO en español. Si el frontend envía la versión en inglés/camelCase (ej: `paymentId`, `package`, `shippingInfo`), solicitar la habilitación del mapeo; se puede aplicar la misma estrategia que `addresses`.

------------------------------------------------------------
Archivo generado automáticamente por el equipo backend.
