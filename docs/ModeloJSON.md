# 📦 Modelo de Datos — PulgaShop (Microservicio Envíos)

## users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "lastName": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "string",
  "isActive": true,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## addresses
```json
{
  "_id": "ObjectId",
  "street": "string",
  "number": "string",
  "comune": "string",
  "province": "string",
  "region": "string (optional)",
  "postalCode": "string (optional)",
  "references": "string (optional)",
  "userId": "ObjectId (string reference)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## carriers
```json
{
  "_id": "ObjectId",
  "code": "string",
  "name": "string",
  "credentials": { /* JSON */ },
  "isAvailable": true,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## cities
```json
{
  "_id": "ObjectId",
  "name": "string",
  "postal_code": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## deliveries
```json
{
  "_id": "ObjectId",
  "originPostalCode": "string",
  "destinationPostalCode": "string",
  "weight": 0,
  "dimensions": { "length": 0, "width": 0, "height": 0, "weight": 0 },
  "deliverySpeed": "standard|express|overnight",
  "insuranceValue": 0,
  "fragile": false,
  "currency": "CLP",
  "pickupDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
