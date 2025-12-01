# Diccionario Automático (generado desde `swagger-spec.json`)

**Generado desde:** `swagger-spec.json`
**Fecha:** 25-11-2025

Resumen: este documento muestra de forma automática los recursos, endpoints y esquemas (DTOs) definidos en el OpenAPI (`swagger-spec.json`). Está pensado como referencia rápida para desarrolladores y QA. Está agrupado por recurso/tag y por esquemas (componentes).

---

## Recursos y Endpoints (por tag)

- Users
  - POST `/api/users` — crear usuario (schema: `CrearUsuarioDto`)
  - GET `/api/users` — listar usuarios
  - GET `/api/users/{id}` — obtener usuario
  - PATCH `/api/users/{id}` — actualizar usuario (schema: `ActualizarUsuarioDto`)
  - DELETE `/api/users/{id}` — eliminar usuario

- Addresses
  - POST `/api/addresses` — crear dirección
  - GET `/api/addresses` — listar (query: `userId`)
  - GET `/api/addresses/{id}` — obtener por id
  - PATCH `/api/addresses/{id}` — actualizar
  - DELETE `/api/addresses/{id}` — eliminar

- Cities
  - POST `/api/cities` — crear ciudad (schema: `CrearCiudadDto`)
  - GET `/api/cities` — listar
  - GET `/api/cities/{id}` — obtener
  - PATCH `/api/cities/{id}` — actualizar (schema: `ActualizarCiudadDto`)
  - DELETE `/api/cities/{id}` — eliminar

- Carriers
  - POST `/api/carriers/quote` — cotizar (acepta payload provider o `Object`)
  - POST `/api/carriers` — crear transportista (schema: `CrearTransportistaDto`)
  - GET `/api/carriers` — listar transportistas
  - GET `/api/carriers/{id}` — obtener
  - PATCH `/api/carriers/{id}` — actualizar (schema: `ActualizarTransportistaDto`)
  - DELETE `/api/carriers/{id}` — eliminar

- Geo
  - GET `/api/geo/cl/regions` — obtener regiones
  - GET `/api/geo/chilexpress/regions` — regiones Chilexpress
  - GET `/api/geo/chilexpress/coverage-areas` — áreas de cobertura (query: `regionCode`, `type`)
  - GET `/api/geo/chilexpress/county-by-name/{communeName}` — buscar county code

- Deliveries
  - POST `/api/deliveries/create-from-payment` — crear envío desde pago (schema: `CrearEnvioDesdePagoDto`)
  - POST `/api/deliveries/create` — crear envío directo (schema: `CrearEnvioDirectoDto`)
  - GET `/api/deliveries/user/{userId}` — listar por usuario
  - GET `/api/deliveries/tracking/{trackingNumber}` — buscar por tracking
  - GET `/api/deliveries` — listar todos
  - GET `/api/deliveries/{id}` — obtener por id
  - PATCH `/api/deliveries/{id}` — actualizar (schema: `DeliveryDto`)
  - DELETE `/api/deliveries/{id}` — eliminar

---

## Esquemas (components/schemas)

Nota: para cada schema se muestran propiedades, tipo, requerido y ejemplo/description si están disponibles en el spec.

### CrearUsuarioDto
- tipo: object
- required: `nombre`, `apellido`, `correo`, `contrasena`
- propiedades:
  - `nombre` (string)
  - `apellido` (string)
  - `correo` (string)
  - `contrasena` (string)

### ActualizarUsuarioDto
- tipo: object
- propiedades: (vacío en el spec)

### CrearCiudadDto
- tipo: object
- required: `nombre`, `codigo_postal`
- propiedades:
  - `nombre` (string) — example: `Santo Domingo`
  - `codigo_postal` (string) — example: `2720000`

### CrearTransportistaDto
- tipo: object
- required: `nombre`, `credenciales`, `disponible`
- propiedades:
  - `nombre` (string) — example: `DHL`
  - `credenciales` (object) — example: `{ "X-API-AppKey": "Luke Skywalker", "X-API-AppToken": "R2D2" }`
  - `disponible` (boolean) — example: `true`

### OpcionServicioDto
- tipo: object
- required: `nombre_servicio`, `codigo_servicio`, `valor_servicio`, `tiempo_entrega`, `disponible`
- propiedades:
  - `nombre_servicio` (string) — example: `PRIORITARIO`
  - `codigo_servicio` (string) — example: `PRI`
  - `valor_servicio` (number) — example: `8500`
  - `tiempo_entrega` (string) — example: `1 día hábil`
  - `disponible` (boolean)

### RespuestaCotizacionDto
- tipo: object
- required: `codigo_estado`, `descripcion_estado`, `opciones_servicio`, `comuna_origen_id`, `comuna_destino_id`, `codigo_cobertura_origen`, `codigo_cobertura_destino`, `error`, `datos_crudos`
- propiedades:
  - `codigo_estado` (number) — example: `0`
  - `descripcion_estado` (string) — example: `Cotización exitosa`
  - `opciones_servicio` (array of `OpcionServicioDto`)
  - `comuna_origen_id` (string) — example: `13101`
  - `comuna_destino_id` (string) — example: `05109`
  - `codigo_cobertura_origen` (string) — example: `SCL`
  - `codigo_cobertura_destino` (string) — example: `VAP`
  - `error` (string)
  - `datos_crudos` (object)

### ArticuloCarritoDto
- tipo: object
- required: `producto_id`, `nombre`, `cantidad`, `precio`
- propiedades:
  - `producto_id` (string) — example: `prod_12345`
  - `nombre` (string) — example: `iPhone 14 Pro`
  - `cantidad` (number) — example: `1`
  - `precio` (number) — example: `899990`

### InfoPaqueteDto
- tipo: object
- required: `peso`, `largo`, `ancho`, `alto`
- propiedades:
  - `peso` (number) — example: `5.5` (kg)
  - `largo` (number) — example: `45` (cm)
  - `ancho` (number) — example: `35` (cm)
  - `alto` (number) — example: `25` (cm)

### InfoEnvioDto
- tipo: object
- required: `origen_direccion_id`, `destino_direccion_id`, `nombre_transportista`, `tipo_servicio`, `costo_estimado`
- propiedades:
  - `origen_direccion_id` (string) — example: `addr_12345`
  - `destino_direccion_id` (string) — example: `addr_67890`
  - `nombre_transportista` (string) — example: `Chilexpress`
  - `tipo_servicio` (string) — example: `PRIORITARIO`
  - `costo_estimado` (number) — example: `8812`

### CrearEnvioDesdePagoDto
- tipo: object
- required: `pago_id`, `carrito_id`, `usuario_id`, `vendedor_id`, `monto_total`, `articulo_carrito`, `paquete`, `informacion_envio`
- propiedades (resumen):
  - `pago_id` (string)
  - `carrito_id` (string)
  - `usuario_id` (string)
  - `vendedor_id` (string)
  - `monto_total` (number)
  - `articulo_carrito` (array of `ArticuloCarritoDto`)
  - `paquete` (InfoPaqueteDto)
  - `informacion_envio` (InfoEnvioDto)
  - `valor_declarado` (number)
  - `notas` (string)

### RespuestaEnvioDto
- tipo: object
- required: muchas propiedades (ver spec) — incluye `numero_seguimiento`, `estado`, `pago_id`, `carrito_id`, `usuario_id`, `vendedor_id`, `nombre_transportista`, `tipo_servicio`, `costo_estimado`, `moneda`, `origen_direccion_id`, `destino_direccion_id`, `articulos`, `fecha_entrega_estimada`, `creado_en`, `mensaje`
- propiedades clave (resumen):
  - `numero_seguimiento` (string) — example: `ENV-1734480000000-A3B7F9`
  - `estado` (string, enum)
  - `pago_id` (string)
  - `carrito_id` (string)
  - `usuario_id` (string)
  - `vendedor_id` (string)
  - `nombre_transportista` (string)
  - `tipo_servicio` (string)
  - `costo_estimado` (number)
  - `moneda` (string) — example: `CLP`
  - `origen_direccion_id` / `destino_direccion_id` (string)
  - `articulos` (array)
  - `fecha_entrega_estimada` (date-time string)
  - `creado_en` (date-time string)
  - `mensaje` (string)

### CrearEnvioDirectoDto
- tipo: object
- required: `usuario_id`, `vendedor_id`, `carrito_id`, `articulo_carrito`, `paquete`, `informacion_envio`
- propiedades: similares a `CrearEnvioDesdePagoDto` (sin `pago_id` y `monto_total`)

### PackageDto
- tipo: object
- required: `weight`, `height`, `width`, `length`
- propiedades:
  - `weight` (string)
  - `height` (string)
  - `width` (string)
  - `length` (string)

### DeliveryDto
- tipo: object (usado para update de delivery)
- propiedades relevantes (ejemplos desde spec): `originCountyCode`, `destinationCountyCode`, `package` (PackageDto), `productType`, `contentType`, `declaredWorth`, `deliveryTime`

---

## Observaciones automáticas

- Este archivo fue generado directamente a partir de `swagger-spec.json`. Contiene un resumen de endpoints y schemas; no intenta renombrar campos (ej. camelCase → snake_case) — es la representación literal del spec.
- Recomendación: revisar `components/schemas` en `swagger-spec.json` para detalles completos (ejemplos, descripciones) y para generar clientes/contratos automáticos.



