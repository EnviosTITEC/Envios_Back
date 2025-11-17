# Creación y Registro de Envíos

## User Story
**Como vendedor** quiero que se me notifique cuando haya realizado una venta para así iniciar el proceso de envío.

## Descripción General
Este documento describe la implementación del flujo de creación automática de envíos cuando un pago se completa en el sistema PulgaShop.

## Arquitectura

### Microservicios Involucrados
1. **Microservicio de Pagos**: Procesa pagos y notifica cuando se completan
2. **Microservicio de Envíos (actual)**: Crea y gestiona envíos
3. **Microservicio de Carrito**: Gestiona productos en el carrito (externo)
4. **Microservicio de Productos/Stock**: Valida disponibilidad (externo)

### Flujo de Integración

```
Usuario finaliza compra
       ↓
[Microservicio Pagos]
  - Procesa pago
  - Estado: COMPLETED
       ↓
POST /api/deliveries/create-from-payment
       ↓
[Microservicio Envíos]
  - Genera tracking number
  - Crea envío (estado: Preparando)
  - Guarda snapshot de items
       ↓
Notifica al vendedor
```

## Schema de Delivery

### Campos Principales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `trackingNumber` | String | Número único de tracking (ENV-{timestamp}-{random}) |
| `status` | Enum | Estado actual: Preparando, EnTransito, Entregado, Cancelado, Devuelto |
| `paymentId` | String | ID del pago en el microservicio de Pagos |
| `cartId` | String | ID del carrito |
| `userId` | String | ID del comprador |
| `sellerId` | String | ID del vendedor |
| `carrierId` | String | ID del carrier (ej: "chilexpress") |
| `carrierName` | String | Nombre del carrier (ej: "Chilexpress") |
| `serviceType` | String | Tipo de servicio (PRIORITARIO, EXPRESS, etc.) |
| `estimatedCost` | Number | Costo estimado del envío |
| `originAddressId` | String | ID de dirección de origen |
| `destinationAddressId` | String | ID de dirección de destino |
| `weight` | Number | Peso del paquete en kg |
| `dimensions` | Object | Dimensiones (length, width, height) en cm |
| `declaredWorth` | Number | Valor declarado para seguro |
| `items` | Array | Snapshot de productos incluidos |
| `estimatedDeliveryDate` | Date | Fecha estimada de entrega |
| `labelUrl` | String | URL de la etiqueta de envío (futuro) |

### Estados del Envío

```typescript
enum DeliveryStatus {
  PREPARANDO = 'Preparando',      // Inicial - vendedor debe preparar paquete
  EN_TRANSITO = 'EnTransito',     // Carrier recogió el paquete
  ENTREGADO = 'Entregado',        // Entregado al destinatario
  CANCELADO = 'Cancelado',        // Cancelado antes de enviar
  DEVUELTO = 'Devuelto',          // Devuelto al origen
}
```

## Endpoint Principal

### POST /api/deliveries/create-from-payment

**Descripción**: Webhook llamado por el microservicio de Pagos cuando un pago se completa.

#### Request Body

```json
{
  "paymentId": "pay_abc123",
  "cartId": "cart_xyz789",
  "userId": "user_456",
  "sellerId": "seller_789",
  "totalAmount": 950000,
  "items": [
    {
      "productId": "prod_12345",
      "name": "iPhone 14 Pro 256GB",
      "quantity": 1,
      "price": 899990
    }
  ],
  "package": {
    "weight": 0.5,
    "length": 20,
    "width": 15,
    "height": 10
  },
  "shippingInfo": {
    "originAddressId": "addr_origin_123",
    "destinationAddressId": "addr_dest_456",
    "carrierName": "Chilexpress",
    "serviceType": "PRIORITARIO",
    "estimatedCost": 8812
  },
  "declaredWorth": 50000,
  "notes": "Entregar en horario de oficina"
}
```

#### Response (201 Created)

```json
{
  "trackingNumber": "ENV-1734480000000-A3B7F9",
  "status": "Preparando",
  "paymentId": "pay_abc123",
  "cartId": "cart_xyz789",
  "userId": "user_456",
  "sellerId": "seller_789",
  "carrierName": "Chilexpress",
  "serviceType": "PRIORITARIO",
  "estimatedCost": 8812,
  "currency": "CLP",
  "originAddressId": "addr_origin_123",
  "destinationAddressId": "addr_dest_456",
  "items": [
    {
      "productId": "prod_12345",
      "name": "iPhone 14 Pro 256GB",
      "quantity": 1,
      "price": 899990
    }
  ],
  "estimatedDeliveryDate": "2024-12-18T10:00:00Z",
  "createdAt": "2024-12-17T15:30:00Z",
  "message": "Envío creado exitosamente. El vendedor ha sido notificado."
}
```

#### Errores

- **400 Bad Request**: Datos inválidos o envío ya existe para este pago
- **500 Internal Server Error**: Error al crear el envío

## Lógica de Negocio

### 1. Generación de Tracking Number

```typescript
private generateTrackingNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ENV-${timestamp}-${random}`;
}
```

**Formato**: `ENV-1734480000000-A3B7F9`
- `ENV`: Prefijo identificador
- `1734480000000`: Timestamp en milisegundos
- `A3B7F9`: Código alfanumérico aleatorio de 6 caracteres

### 2. Validaciones

- ✅ No permitir duplicados por `paymentId`
- ✅ Tracking number único (retry hasta 10 intentos)
- ✅ Validación de DTOs con class-validator
- ✅ Stock validado previamente (asumido por pago completado)

### 3. Cálculo de Fecha Estimada

```typescript
private calculateEstimatedDelivery(serviceType: string): Date {
  const daysToAdd = serviceType === 'PRIORITARIO' ? 1 
                  : serviceType === 'EXPRESS' ? 2 
                  : 3;
  // ...
}
```

## Integración con Direcciones

### Flujo de Direcciones

1. **Antes del pago**: Usuario guarda su dirección usando POST /api/addresses
2. **Cotización**: Sistema usa la dirección para generar quote
3. **Post-pago**: Dirección se recupera por `userId` o `addressId`

### Relación con Addresses

El envío almacena:
- `originAddressId`: Dirección del vendedor
- `destinationAddressId`: Dirección del comprador

La información completa de direcciones se obtiene consultando el módulo `addresses`:

```typescript
GET /api/addresses/:id
```

## Notificaciones al Vendedor

### Estado Actual
Implementado como placeholder con log:

```typescript
this.logger.log(`✉️ TODO: Notify seller ${dto.sellerId} about new shipment ${trackingNumber}`);
```

### Implementación Futura

Opciones de notificación:
1. **Email**: Enviar correo con detalles del envío
2. **Webhook**: Llamar endpoint del vendedor
3. **WebSocket**: Notificación en tiempo real
4. **SMS**: Mensaje de texto

**Datos a incluir**:
- Tracking number
- Productos a empaquetar
- Dirección de destino
- Fecha estimada de recogida
- Carrier seleccionado

## Consideraciones de Arquitectura

### Comunicación entre Microservicios

**Opción Actual**: HTTP REST endpoints
- Payments → Envíos: POST /deliveries/create-from-payment
- Envíos → Addresses: GET /addresses/:id

**Ventajas**:
- Simple de implementar
- Sin dependencias adicionales
- Debugging fácil

**Futuras Mejoras**:
- Message Queue (RabbitMQ, Kafka) para desacoplamiento
- Retry policies y circuit breakers
- Event-driven architecture

### Manejo de Vendedores Múltiples

**Asumido**: 1 vendedor por carrito
- Si el carrito tiene productos de múltiples vendedores, el microservicio de Pagos debe dividir en múltiples llamadas
- Cada llamada crea un envío independiente

## Testing

### Script de Prueba

```bash
# Crear envío desde pago completado
curl -X POST http://localhost:3000/api/deliveries/create-from-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_test_123",
    "cartId": "cart_test_456",
    "userId": "user_789",
    "sellerId": "seller_001",
    "totalAmount": 950000,
    "items": [
      {
        "productId": "prod_12345",
        "name": "iPhone 14 Pro 256GB",
        "quantity": 1,
        "price": 899990
      }
    ],
    "package": {
      "weight": 0.5,
      "length": 20,
      "width": 15,
      "height": 10
    },
    "shippingInfo": {
      "originAddressId": "addr_origin_123",
      "destinationAddressId": "addr_dest_456",
      "carrierName": "Chilexpress",
      "serviceType": "PRIORITARIO",
      "estimatedCost": 8812
    }
  }' | jq '.'
```

### Verificar Envío Creado

```bash
# Listar todos los envíos
curl http://localhost:3000/api/deliveries | jq '.'

# Buscar por tracking number
curl http://localhost:3000/api/deliveries | jq '.[] | select(.trackingNumber == "ENV-1734480000000-A3B7F9")'
```

## Próximos Pasos

### Corto Plazo
- [ ] Implementar sistema de notificaciones al vendedor
- [ ] Añadir endpoint de consulta por tracking number
- [ ] Añadir filtros de búsqueda (por usuario, vendedor, estado)

### Mediano Plazo
- [ ] Generación de etiquetas de envío (PDF)
- [ ] Integración con API de carriers para tracking real
- [ ] Estados intermedios (EnPreparacion, ListoParaRecoger)
- [ ] Webhooks para actualización de estados

### Largo Plazo
- [ ] Dashboard para vendedores
- [ ] Estadísticas de envíos
- [ ] Integración con múltiples carriers
- [ ] Sistema de devoluciones

## Documentación Relacionada

- [Cotización de Envíos](./COTIZACION.md)
- [Modelo de Base de Datos](./database-model.md)
- [API Swagger](http://localhost:3000/api)

## Contacto

Para consultas sobre integración, contactar al equipo de Envíos.
