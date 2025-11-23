#  Flujo Completo: Cotización → Envío

## Resumen del Flujo

```
1️ Usuario selecciona artículos del carrito
   ↓
2️ Frontend extrae parámetros del carrito (weight, dimensions)
   ↓
3️ Usuario ingresa origen y destino
   ↓
4️ Frontend llama a POST /api/carriers/quote
   (Chilexpress valida - es SANDBOX, puede no funcionar)
   ↓
5️ Usuario selecciona una opción de envío
   ↓
6️ Frontend llama a POST /api/deliveries/create
   (Guarda el envío con tracking number)
   ↓
7️ User ve el envío en GET /api/deliveries/user/{userId}
   ("Mis envíos")
   ↓
8️ (Futuro) Sistema de Pagos crea pago
```

---

## Endpoints Principales

### 1. Cotizar Envío
**POST** `/api/carriers/quote`

**Request (desde Frontend):**
```json
{
  "originCountyCode": "STGO",
  "destinationCountyCode": "VAP",
  "package": {
    "weight": "0.5",
    "height": "10",
    "width": "15",
    "length": "20"
  },
  "productType": 3,
  "contentType": 1,
  "declaredWorth": "50000",
  "deliveryTime": 0
}
```

**Response (si funciona Chilexpress):**
```json
{
  "statusCode": 0,
  "statusDescription": "Cotización exitosa",
  "serviceOptions": [
    {
      "serviceName": "PRIORITARIO",
      "serviceCode": "PRI",
      "serviceValue": 8500,
      "deliveryTime": "1 día hábil",
      "available": true
    },
    {
      "serviceName": "EXPRESS",
      "serviceCode": "EXP",
      "serviceValue": 6500,
      "deliveryTime": "2-3 días hábiles",
      "available": true
    }
  ],
  "originCountyCode": "STGO",
  "destinationCountyCode": "VAP"
}
```

**Response (si FALLA - Sandbox):**
```json
{
  "statusCode": -1,
  "statusDescription": "Error en Sandbox",
  "error": "CONNECTION_ERROR"
}
```

---

### 2. Crear Envío (Nuevo Endpoint)
**POST** `/api/deliveries/create`

**Request (con datos de la cotización):**
```json
{
  "userId": "user_456",
  "sellerId": "seller_789",
  "cartId": "cart_xyz789",
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
    "estimatedCost": 8500
  },
  "declaredWorth": 50000,
  "notes": "Entregar en horario de oficina"
}
```

**Response:**
```json
{
  "trackingNumber": "ENV-1734480000000-A3B7F9",
  "status": "Preparando",
  "userId": "user_456",
  "sellerId": "seller_789",
  "cartId": "cart_xyz789",
  "carrierName": "Chilexpress",
  "serviceType": "PRIORITARIO",
  "estimatedCost": 8500,
  "currency": "CLP",
  "items": [
    {
      "productId": "prod_12345",
      "name": "iPhone 14 Pro 256GB",
      "quantity": 1,
      "price": 899990
    }
  ],
  "estimatedDeliveryDate": "2024-11-21T10:00:00Z",
  "originAddressId": "addr_origin_123",
  "destinationAddressId": "addr_dest_456",
  "message": "Envío creado exitosamente."
}
```

---

### 3. Listar Envíos del Usuario (Nuevo Endpoint)
**GET** `/api/deliveries/user/{userId}`

**Response:**
```json
[
  {
    "trackingNumber": "ENV-1734480000000-A3B7F9",
    "status": "Preparando",
    "userId": "user_456",
    "sellerId": "seller_789",
    "cartId": "cart_xyz789",
    "carrierName": "Chilexpress",
    "serviceType": "PRIORITARIO",
    "estimatedCost": 8500,
    "currency": "CLP",
    "items": [
      {
        "productId": "prod_12345",
        "name": "iPhone 14 Pro 256GB",
        "quantity": 1,
        "price": 899990
      }
    ],
    "estimatedDeliveryDate": "2024-11-21T10:00:00Z",
    "originAddressId": "addr_origin_123",
    "destinationAddressId": "addr_dest_456",
    "createdAt": "2024-11-20T15:30:00Z"
  },
  {
    "trackingNumber": "ENV-1734480000001-X5K2M",
    "status": "En Tránsito",
    ...
  }
]
```

---

## Tipos de Datos

### Package (Parámetros del Envío)
```typescript
{
  weight: number;    // kg (ej: 0.5)
  length: number;    // cm (ej: 20)
  width: number;     // cm (ej: 15)
  height: number;    // cm (ej: 10)
}
```

### ShippingInfo (Información de Envío)
```typescript
{
  originAddressId: string;        // ID de dirección de origen
  destinationAddressId: string;   // ID de dirección de destino
  carrierName: string;            // "Chilexpress"
  serviceType: string;            // "PRIORITARIO", "EXPRESS", etc
  estimatedCost: number;          // en CLP
}
```

### CartItem (Artículo del Carrito)
```typescript
{
  productId: string;
  name: string;
  quantity: number;
  price: number;
}
```

---

## Variables Importantes

### Códigos Chilexpress (Para Cotización)
- **STGO** = Santiago
- **VAP** = Viña del Mar
- **IQUIQUE** = Iquique
- Etc. (se obtienen del módulo de direcciones)

### Estados del Envío
- `Preparando` - Inicial, se generó tracking
- `EnTransito` - En camino
- `Entregado` - Completado
- `Cancelado` - Cancelado
- `Devuelto` - Devolución

### Tipos de Servicio
- `PRIORITARIO` - 1 día hábil (~$8.500)
- `EXPRESS` - 2-3 días (~$6.500)
- `STANDARD` - 3+ días (~$5.000)

---

## Flujo Frontend

```
┌─ QuotePage.tsx ─────────────────────────────────────────┐
│                                                          │
│ 1. ParamsGrid                                           │
│    └─ Input: weight, height, width, length             │
│                                                          │
│ 2. AddressPicker                                        │
│    └─ Select: destinationAddress (con countyCode)      │
│                                                          │
│ 3. [Calcular Cotización]                                │
│    └─ POST /api/carriers/quote                         │
│       {originCountyCode, destinationCountyCode, ...}   │
│                                                          │
│ 4. QuoteList (Mostrar opciones)                         │
│    └─ SELECT: PRIORITARIO ($8.500)                     │
│             EXPRESS ($6.500)                           │
│                                                          │
│ 5. [Crear Envío]                                        │
│    └─ POST /api/deliveries/create                      │
│       {userId, items, package, shippingInfo, ...}      │
│                                                          │
│ 6. Redirect a ShipmentsPage                            │
│    └─ GET /api/deliveries/user/user_456               │
│                                                          │
│ 7. Mostrar lista de envíos con tracking                │
│    └─ ENV-1734480000000-A3B7F9                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Consideraciones Importantes

### Sandbox de Chilexpress
- La API está en SANDBOX y puede **no responder**
- En ese caso, devuelve error
- **Solución**: Frontend debe mostrar error y sugerir valores por defecto
- O usar valores hardcodeados para testing

### Extracción de Parámetros del Carrito
- El carrito debe proporcionar:
  - `items[]` con: productId, name, quantity, price
  - `package` con: weight, length, width, height
- Si el carrito no tiene `package`, usar valores estándar:
  ```typescript
  const defaultPackage = {
    weight: 1.0,      // 1 kg
    length: 30,       // 30 cm
    width: 20,        // 20 cm
    height: 15        // 15 cm
  }
  ```

### Integración con Pagos
- Cuando el envío se crea en `POST /deliveries/create`, **NO hay pago**
- El `paymentId` viene **vacío** (nil/null)
- Cuando Pagos complete un pago, llama a:
  ```
  POST /api/deliveries/create-from-payment
  ```
- Este endpoint es distinto y requiere `paymentId`

---

## Testing Local

### 1. Crear Envío (Sin Pago)
```bash
curl -X POST http://localhost:3000/api/deliveries/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_456",
    "sellerId": "seller_789",
    "cartId": "cart_xyz789",
    "items": [
      {
        "productId": "prod_12345",
        "name": "iPhone 14",
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
      "originAddressId": "addr_123",
      "destinationAddressId": "addr_456",
      "carrierName": "Chilexpress",
      "serviceType": "PRIORITARIO",
      "estimatedCost": 8500
    }
  }'
```

### 2. Listar Envíos
```bash
curl http://localhost:3000/api/deliveries/user/user_456
```

### 3. Ver Swagger UI
```
http://localhost:3000/api
```

---

## Próximos Pasos

1. Endpoint `POST /deliveries/create` - HECHO
2. Endpoint `GET /deliveries/user/{userId}` - HECHO
3. Frontend: Vista "Mis Envíos"
4. Frontend: Integrar cotización con Chilexpress
5. Pruebas end-to-end
