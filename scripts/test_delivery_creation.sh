#!/bin/bash

# Script para probar la creación de envíos desde pago completado

API_URL="http://localhost:3000/api"

echo "🧪 Testing Delivery Creation from Payment"
echo "=========================================="
echo ""

# Test 1: Crear envío exitoso
echo "📦 Test 1: Crear envío desde pago completado"
echo "-------------------------------------------"
RESPONSE=$(curl -s -X POST "$API_URL/deliveries/create-from-payment" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_test_'$(date +%s)'",
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
      },
      {
        "productId": "prod_67890",
        "name": "AirPods Pro 2",
        "quantity": 2,
        "price": 25000
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
    "notes": "Entregar en horario de oficina - Paquete frágil"
  }')

echo "$RESPONSE" | jq '.'
TRACKING_NUMBER=$(echo "$RESPONSE" | jq -r '.trackingNumber')
echo ""
echo "✅ Tracking Number generado: $TRACKING_NUMBER"
echo ""

# Test 2: Intentar duplicar el mismo pago
echo "🚫 Test 2: Intentar duplicar envío (debe fallar)"
echo "-----------------------------------------------"
PAYMENT_ID=$(echo "$RESPONSE" | jq -r '.paymentId')
curl -s -X POST "$API_URL/deliveries/create-from-payment" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "'$PAYMENT_ID'",
    "cartId": "cart_test_456",
    "userId": "user_789",
    "sellerId": "seller_001",
    "totalAmount": 950000,
    "items": [
      {
        "productId": "prod_12345",
        "name": "iPhone 14 Pro",
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
      "serviceType": "EXPRESS",
      "estimatedCost": 5875
    }
  }' | jq '.'
echo ""

# Test 3: Listar todos los envíos
echo "📋 Test 3: Listar todos los envíos"
echo "----------------------------------"
curl -s "$API_URL/deliveries" | jq 'length'
echo "envíos registrados"
echo ""

# Test 4: Buscar envío específico por tracking
echo "🔍 Test 4: Buscar envío por tracking number"
echo "-------------------------------------------"
curl -s "$API_URL/deliveries" | jq '.[] | select(.trackingNumber == "'$TRACKING_NUMBER'")'
echo ""

# Test 5: Validación - datos faltantes
echo "❌ Test 5: Validación con datos faltantes"
echo "-----------------------------------------"
curl -s -X POST "$API_URL/deliveries/create-from-payment" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_invalid",
    "userId": "user_789"
  }' | jq '.'
echo ""

# Test 6: Crear múltiples envíos (simulación de múltiples vendedores)
echo "🏪 Test 6: Crear múltiples envíos (diferentes vendedores)"
echo "---------------------------------------------------------"
for i in {1..3}; do
  echo "Vendedor $i..."
  curl -s -X POST "$API_URL/deliveries/create-from-payment" \
    -H "Content-Type: application/json" \
    -d '{
      "paymentId": "pay_multi_'$(date +%s%N)'",
      "cartId": "cart_multi_'$i'",
      "userId": "user_buyer_001",
      "sellerId": "seller_00'$i'",
      "totalAmount": '$((100000 * i))',
      "items": [
        {
          "productId": "prod_'$i'",
          "name": "Producto del Vendedor '$i'",
          "quantity": 1,
          "price": '$((100000 * i))'
        }
      ],
      "package": {
        "weight": 1.0,
        "length": 30,
        "width": 20,
        "height": 15
      },
      "shippingInfo": {
        "originAddressId": "addr_seller_00'$i'",
        "destinationAddressId": "addr_buyer_001",
        "carrierName": "Chilexpress",
        "serviceType": "EXPRESS",
        "estimatedCost": 5875
      }
    }' | jq '.trackingNumber, .sellerId, .status'
  echo ""
  sleep 0.5
done

echo ""
echo "✨ Testing completo!"
echo ""
echo "📊 Resumen:"
echo "  - Envíos totales: $(curl -s $API_URL/deliveries | jq 'length')"
echo "  - Estados Preparando: $(curl -s $API_URL/deliveries | jq '[.[] | select(.status == "Preparando")] | length')"
echo ""
echo "🔗 Ver Swagger UI: http://localhost:3000/api"
