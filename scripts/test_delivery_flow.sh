#!/bin/bash

# Script de Testing del Flujo Cotización → Envío
# Uso: bash test_delivery_flow.sh

BASE_URL="http://localhost:3000/api"
USER_ID="user_456"
SELLER_ID="seller_789"
CART_ID="cart_xyz789"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test: Flujo Cotización → Envío${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Crear un envío directamente
echo -e "${BLUE}1. Creando envío...${NC}"
DELIVERY_RESPONSE=$(curl -s -X POST "$BASE_URL/deliveries/create" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$USER_ID'",
    "sellerId": "'$SELLER_ID'",
    "cartId": "'$CART_ID'",
    "items": [
      {
        "productId": "prod_12345",
        "name": "iPhone 14 Pro 256GB",
        "quantity": 1,
        "price": 899990
      },
      {
        "productId": "prod_67890",
        "name": "AirPods Pro",
        "quantity": 1,
        "price": 299990
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
    "declaredWorth": 1199980,
    "notes": "Entregar en horario de oficina"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$DELIVERY_RESPONSE" | jq .

# Extraer tracking number
TRACKING=$(echo "$DELIVERY_RESPONSE" | jq -r '.trackingNumber' 2>/dev/null)

if [ "$TRACKING" != "null" ] && [ ! -z "$TRACKING" ]; then
  echo -e "${GREEN}Envío creado: $TRACKING${NC}\n"
else
  echo -e "${RED}Error creando envío${NC}\n"
  exit 1
fi

# 2. Listar envíos del usuario
echo -e "${BLUE}2. Listando envíos del usuario...${NC}"
DELIVERIES=$(curl -s -X GET "$BASE_URL/deliveries/user/$USER_ID")

echo -e "${GREEN}Response:${NC}"
echo "$DELIVERIES" | jq .

# Contar envíos
COUNT=$(echo "$DELIVERIES" | jq 'length' 2>/dev/null)
echo -e "${GREEN}Total de envíos: $COUNT${NC}\n"

# 3. Obtener detalles de un envío específico (si existe)
echo -e "${BLUE}3. Obteniendo todos los envíos (GET /deliveries)...${NC}"
ALL_DELIVERIES=$(curl -s -X GET "$BASE_URL/deliveries")

COUNT_ALL=$(echo "$ALL_DELIVERIES" | jq 'length' 2>/dev/null)
echo -e "${GREEN}Total de envíos globales: $COUNT_ALL${NC}\n"

# 4. Crear otro envío con otro usuario para validar filtrado
echo -e "${BLUE}4. Creando envío para otro usuario...${NC}"
DELIVERY_RESPONSE_2=$(curl -s -X POST "$BASE_URL/deliveries/create" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_999",
    "sellerId": "seller_789",
    "cartId": "cart_999",
    "items": [
      {
        "productId": "prod_99999",
        "name": "MacBook Pro",
        "quantity": 1,
        "price": 2499990
      }
    ],
    "package": {
      "weight": 2.5,
      "length": 30,
      "width": 25,
      "height": 15
    },
    "shippingInfo": {
      "originAddressId": "addr_origin_123",
      "destinationAddressId": "addr_dest_789",
      "carrierName": "Chilexpress",
      "serviceType": "EXPRESS",
      "estimatedCost": 12000
    }
  }')

TRACKING_2=$(echo "$DELIVERY_RESPONSE_2" | jq -r '.trackingNumber' 2>/dev/null)
echo -e "${GREEN}Segundo envío creado: $TRACKING_2${NC}\n"

# 5. Validar que el filtrado por usuario funciona
echo -e "${BLUE}5. Validando filtrado por usuario...${NC}"
USER_456_DELIVERIES=$(curl -s -X GET "$BASE_URL/deliveries/user/user_456" | jq 'length')
USER_999_DELIVERIES=$(curl -s -X GET "$BASE_URL/deliveries/user/user_999" | jq 'length')

echo -e "${GREEN}Envíos de user_456: $USER_456_DELIVERIES${NC}"
echo -e "${GREEN}Envíos de user_999: $USER_999_DELIVERIES${NC}"

if [ "$USER_456_DELIVERIES" -gt "0" ] && [ "$USER_999_DELIVERIES" -gt "0" ]; then
  echo -e "${GREEN}Filtrado por usuario funciona correctamente${NC}\n"
else
  echo -e "${RED}Error en filtrado${NC}\n"
fi

# 6. Verificar estructura de datos
echo -e "${BLUE}6. Verificando estructura de datos...${NC}"
FIRST_DELIVERY=$(curl -s -X GET "$BASE_URL/deliveries/user/user_456" | jq '.[0]')

echo -e "${GREEN}Primer envío del usuario:${NC}"
echo "$FIRST_DELIVERY" | jq '{
  trackingNumber,
  status,
  userId,
  sellerId,
  carrierName,
  serviceType,
  estimatedCost,
  items: .items | length,
  package,
  estimatedDeliveryDate,
  createdAt
}' 

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Todos los tests completados${NC}"
echo -e "${BLUE}========================================${NC}\n"
