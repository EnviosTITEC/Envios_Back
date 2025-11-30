#!/bin/bash

# Script de Testing de Seguimiento (Tracking)
# Uso: bash test_tracking.sh

BASE_URL="http://localhost:3000/api"
USER_ID="user_456"
SELLER_ID="seller_789"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test: Seguimiento (Tracking)${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Crear un envío
echo -e "${BLUE}1. Creando envío de prueba...${NC}"
DELIVERY_RESPONSE=$(curl -s -X POST "$BASE_URL/deliveries/create" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$USER_ID'",
    "sellerId": "'$SELLER_ID'",
    "cartId": "cart_test_'$(date +%s)'",
    "items": [
      {
        "productId": "prod_tracking_test",
        "name": "Producto de Prueba para Tracking",
        "quantity": 1,
        "price": 50000
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
      "serviceType": "EXPRESS",
      "estimatedCost": 5500
    },
    "declaredWorth": 50000,
    "notes": "Envío de prueba para tracking"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$DELIVERY_RESPONSE" | jq '.'

# Extraer tracking number
TRACKING=$(echo "$DELIVERY_RESPONSE" | jq -r '.trackingNumber' 2>/dev/null)

if [ "$TRACKING" != "null" ] && [ ! -z "$TRACKING" ]; then
  echo -e "${GREEN}SUCCESS - Envío creado exitosamente${NC}"
  echo -e "${YELLOW}Tracking Number: $TRACKING${NC}\n"
else
  echo -e "${RED}ERROR - Error creando envío${NC}\n"
  exit 1
fi

# 2. Buscar por tracking number
echo -e "${BLUE}2. Buscando envío por tracking number...${NC}"
echo -e "${YELLOW}URL: GET $BASE_URL/deliveries/tracking/$TRACKING${NC}\n"

TRACKING_RESPONSE=$(curl -s -X GET "$BASE_URL/deliveries/tracking/$TRACKING")

echo -e "${GREEN}Response:${NC}"
echo "$TRACKING_RESPONSE" | jq '.'

# Verificar que la respuesta contiene los datos correctos
FOUND_TRACKING=$(echo "$TRACKING_RESPONSE" | jq -r '.trackingNumber' 2>/dev/null)

if [ "$FOUND_TRACKING" = "$TRACKING" ]; then
  echo -e "\n${GREEN}SUCCESS - Búsqueda exitosa! El envío fue encontrado correctamente.${NC}"
else
  echo -e "\n${RED}ERROR - Error en la búsqueda${NC}\n"
  exit 1
fi

# 3. Intentar buscar con un tracking inválido
echo -e "\n${BLUE}3. Intentando buscar con tracking inválido...${NC}"
INVALID_TRACKING="ENV-INVALID-12345"
echo -e "${YELLOW}URL: GET $BASE_URL/deliveries/tracking/$INVALID_TRACKING${NC}\n"

INVALID_RESPONSE=$(curl -s -X GET "$BASE_URL/deliveries/tracking/$INVALID_TRACKING" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$INVALID_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$INVALID_RESPONSE" | sed '$d')

echo -e "${YELLOW}HTTP Status: $HTTP_CODE${NC}"
echo -e "${GREEN}Response:${NC}"
echo "$RESPONSE_BODY" | jq '.'

if [ "$HTTP_CODE" = "404" ]; then
  echo -e "\n${GREEN}Test correcto: Retorna 404 para tracking inválido${NC}"
else
  echo -e "\n${RED}Comportamiento inesperado: Esperaba 404, recibió $HTTP_CODE${NC}"
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Testing completo!${NC}"
echo -e "${BLUE}========================================${NC}\n"
