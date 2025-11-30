#  Sistema de Cotización de Envíos

## Historia de Usuario

> **Como administrador del servicio** quiero saber cuánto suele costar enviar un cierto producto de cierto vendedor a cierta ubicación general **para** determinar cuánto cobrar por el transporte al cliente y al vendedor.

## Implementación

### Endpoint de Cotización

**URL:** `POST /api/carriers/quote`

**Descripción:** Obtiene el costo de envío desde una comuna de origen a una de destino usando la API de Chilexpress.

### Request Body

```json
{
  "originCommuneId": "13101",
  "destinationCommuneId": "05109",
  "package": {
    "weight": "2.5",
    "height": "15",
    "width": "25",
    "length": "35"
  },
  "productType": 3,
  "contentType": 1,
  "declaredWorth": "25000",
  "deliveryTime": 0
}
```

### Campos del Request

| Campo | Tipo | Descripción | Requerido | Ejemplo |
|-------|------|-------------|-----------|---------|
| `originCommuneId` | string | Código DPA de la comuna de origen | YES | "13101" (Santiago) |
| `destinationCommuneId` | string | Código DPA de la comuna de destino | YES | "05109" (Viña del Mar) |
| `package.weight` | string | Peso en kilogramos (con punto decimal) | YES | "2.5" |
| `package.height` | string | Alto en centímetros | YES | "15" |
| `package.width` | string | Ancho en centímetros | YES | "25" |
| `package.length` | string | Largo en centímetros | YES | "35" |
| `productType` | number | Tipo: 1 = Documento, 3 = Encomienda | YES | 3 |
| `contentType` | number | Tipo de contenido | YES | 1 |
| `declaredWorth` | string | Valor declarado en CLP | YES | "25000" |
| `deliveryTime` | number | 0=Todos, 1=Prioritarios, 2=No prioritarios, 3=Devolución | NO | 0 |

### Response Exitoso

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
  "originCommuneId": "13101",
  "destinationCommuneId": "05109",
  "originCountyCode": "SCL",
  "destinationCountyCode": "VAP"
}
```

### Response con Error

```json
{
  "statusCode": -1,
  "statusDescription": "No existe mapping Chilexpress para communeId=99999",
  "error": "COMMUNE_MAPPING_NOT_FOUND",
  "originCommuneId": "99999",
  "destinationCommuneId": "05109"
}
```

## Códigos DPA de Comunas Principales

### Región Metropolitana
- **13101** - Santiago
- **13114** - Las Condes
- **13119** - Maipú
- **13120** - Ñuñoa
- **13123** - Providencia
- **13132** - Vitacura
- **13201** - Puente Alto
- **13304** - San Bernardo

### Región de Valparaíso
- **05101** - Valparaíso
- **05109** - Viña del Mar
- **05501** - Quillota
- **05601** - San Antonio
- **05801** - Quilpué

### Otras Regiones
- **15101** - Arica
- **01101** - Iquique
- **02101** - Antofagasta
- **03101** - Copiapó
- **04101** - La Serena
- **06101** - Rancagua
- **07101** - Talca
- **08101** - Concepción
- **09101** - Temuco
- **10101** - Puerto Montt
- **12101** - Punta Arenas

Ver el archivo completo en: `src/carriers/chilexpress-dpa-mapping.ts`

## Ejemplos de Uso

### Ejemplo 1: Envío de Santiago a Viña del Mar

```bash
curl -X POST http://localhost:3000/api/carriers/quote \
  -H "Content-Type: application/json" \
  -d '{
    "originCommuneId": "13101",
    "destinationCommuneId": "05109",
    "package": {
      "weight": "2.5",
      "height": "15",
      "width": "25",
      "length": "35"
    },
    "productType": 3,
    "contentType": 1,
    "declaredWorth": "25000",
    "deliveryTime": 0
  }'
```

### Ejemplo 2: Envío Prioritario de Viña a Santiago

```bash
curl -X POST http://localhost:3000/api/carriers/quote \
  -H "Content-Type: application/json" \
  -d '{
    "originCommuneId": "05109",
    "destinationCommuneId": "13101",
    "package": {
      "weight": "1.0",
      "height": "10",
      "width": "20",
      "length": "30"
    },
    "productType": 3,
    "contentType": 1,
    "declaredWorth": "15000",
    "deliveryTime": 1
  }'
```

## Arquitectura

### Flujo de Datos

```
Cliente → CarriersController → CarriersService → ChilexpressAdapter → API Chilexpress
   ↓                                                                          ↓
QuoteRequestDto                                                        Validación y
   ↓                                                                   Manejo de errores
DPA Mapping                                                                   ↓
   ↓                                                                    QuoteResponseDto
Cliente ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

### Componentes

1. **QuoteRequestDto** (`src/carriers/dto/quote-request.dto.ts`)
   - Validación de datos de entrada
   - Usa códigos DPA (INE)

2. **QuoteResponseDto** (`src/carriers/dto/quote-response.dto.ts`)
   - Estructura de respuesta estandarizada
   - Incluye opciones de servicio y precios

3. **ChilexpressAdapter** (`src/carriers/adapters/chilexpress-adapters.ts`)
   - Comunicación con API de Chilexpress
   - Manejo de errores HTTP
   - Validación de credenciales

4. **DPA Mapping** (`src/carriers/chilexpress-dpa-mapping.ts`)
   - Convierte códigos DPA a códigos Chilexpress
   - Cobertura de 345 comunas de Chile

## Configuración

### Variables de Entorno

```env
CARRIERS_JSON=[{
  "code": "Chilexpress",
  "name": "Chilexpress",
  "credentials": {
    "coberturas": {
      "Ocp-Apim-Subscription-Key": "247c52cd60cc45b281e92f83d165c135"
    },
    "cotizador": {
      "Ocp-Apim-Subscription-Key": "3686a99eb94648978928071cc93b4ea2"
    }
  }
}]
```

### API Keys de Chilexpress

- **Cobertura:** `247c52cd60cc45b281e92f83d165c135`
- **Cotizador:** `3686a99eb94648978928071cc93b4ea2`

Estas keys son para el ambiente de **testing**. Para producción, solicitar keys en:
https://developers.wschilexpress.com/

## Manejo de Errores

### Errores de Mapeo de Comunas

**Código:** `COMMUNE_MAPPING_NOT_FOUND`

Ocurre cuando se envía un código DPA que no está mapeado en el sistema.

**Solución:** Verificar que el código DPA sea válido y exista en `chilexpress-dpa-mapping.ts`.

### Errores de Autenticación

**Código:** `AUTHENTICATION_ERROR`

Ocurre cuando las API keys son inválidas o están mal configuradas.

**Solución:** Verificar `CARRIERS_JSON` en `.env`.

### Errores de Cobertura

**Código:** `COVERAGE_NOT_FOUND`

Ocurre cuando Chilexpress no tiene cobertura para la ruta especificada.

**Solución:** Verificar que ambas comunas tengan servicio de Chilexpress.

### Errores de Validación

**Código:** `INVALID_REQUEST`

Ocurre cuando los datos enviados no cumplen las validaciones.

**Solución:** Revisar que todos los campos requeridos estén presentes y sean del tipo correcto.

## Testing

### Con Swagger UI

1. Iniciar servidor: `pnpm start:dev`
2. Abrir: http://localhost:3000/api-docs
3. Navegar a `/carriers/quote`
4. Usar los ejemplos precargados

### Con Postman

Importar la colección desde `swagger-spec.json` o crear manualmente el request como se muestra en los ejemplos.

## Mejoras Futuras

- [ ] Caché de cotizaciones para reducir llamadas a la API
- [ ] Persistencia de histórico de cotizaciones
- [ ] Comparación con otros carriers (Correos Chile, Starken)
- [ ] Cálculo de margen de ganancia sugerido
- [ ] Integración con sistema de pagos
- [ ] Notificaciones cuando cambien precios

---

**Desarrollado por:** Giovanni Vásquez  
**Universidad de Valparaíso** - Gestión de Proyecto Informático  
**Noviembre 2025**

