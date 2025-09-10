# PulgaShop - Microservicio Envíos API Specification

* **Version:** 1.0  
* **Base URL:** `http://localhost:3000/api`  
* **Swagger Documentation:** `http://localhost:3000/api-docs`
* **Mockup for front-end: [Figma URL](https://www.figma.com/design/aSzfltXTlqDjB4kaRq91Ue/Untitled?node-id=208-980&t=cHUtZtUL3zgx5W8w-1)**
* - **Lucas Rojas** - lucas.rojas@estudiantes.uv.cl - Seguridad
* - **Alejandro Dinamarca** - alejandro.dinamarca@estudiantes.uv.cl - Back End y Servicios
* - **Ricardo Silva** - ricardo.silvap@estudiantes.uv.cl - UI/UX
* - **Renata Orozco** - renata.orozco@estudiantes.uv.cl - UI/UX
* - **Giovanni Vásquez** - giovanni.vasquez@estudiantes.uv.cl - Back End y Base de Datos


## Overview

This is a NestJS backend project for "PulgaShop - Microservicio Envíos" (Shipping Microservice), developed for a university course (GPI - Universidad de Valparaíso). It provides a RESTful API with authentication and shipping management capabilities.

## Authentication

The API uses JWT (JSON Web Token) based authentication. Protected routes require a valid JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

---

## API Endpoints

### 🔐 Authentication

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "lastName": "string", 
  "email": "user@example.com",
  "password": "string (min 6 characters)"
}
```

**Response:**
```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "lastName": "string",
    "email": "string",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "name": "string", 
    "lastName": "string",
    "email": "string",
    "role": "user",
    "isActive": true
  }
}
```

#### GET `/api/auth/me` 🔒
Get current user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "lastName": "string", 
  "email": "string",
  "role": "user",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

---

### 👥 Users Management

#### POST `/api/users`
Create a new user.

**Request Body:**
```json
{
  "name": "string",
  "lastName": "string",
  "email": "user@example.com", 
  "password": "string (min 6 characters)"
}
```

#### GET `/api/users` 🔒
Get all users.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "lastName": "string",
    "email": "string",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### GET `/api/users/:id` 🔒
Get user by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "lastName": "string",
  "email": "string", 
  "role": "user",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### PATCH `/api/users/:id` 🔒
Update user by ID.

**Headers:** `Authorization: Bearer <token>`

**Request Body (all fields optional):**
```json
{
  "name": "string",
  "lastName": "string",
  "email": "user@example.com",
  "password": "string"
}
```

#### DELETE `/api/users/:id` 🔒
Delete user by ID.

**Headers:** `Authorization: Bearer <token>`

---

### 📍 Addresses Management

#### POST `/api/address/addresses`
Create a new address.

**Request Body:**
```json
{
  "street": "Av. Siempre Viva",
  "number": "742",
  "comune": "Springfield", 
  "province": "Springfield",
  "region": "Región Metropolitana",
  "postalCode": "1234567",
  "references": "Casa azul, portón rojo",
  "userId": "userId123"
}
```

**Response:**
```json
{
  "id": "string",
  "street": "string",
  "number": "string",
  "comune": "string",
  "province": "string", 
  "region": "string",
  "postalCode": "string",
  "references": "string",
  "userId": "string",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### GET `/api/address/addresses`
Get all addresses or filter by userId.

**Query Parameters:**
- `userId` (optional): Filter addresses by user ID

**Response:**
```json
[
  {
    "id": "string",
    "street": "string",
    "number": "string", 
    "comune": "string",
    "province": "string",
    "region": "string",
    "postalCode": "string",
    "references": "string",
    "userId": "string",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### GET `/api/address/addresses/:id`
Get address by ID.

#### PATCH `/api/address/addresses/:id`
Update address by ID.

**Request Body (all fields optional):**
```json
{
  "street": "string",
  "number": "string",
  "comune": "string",
  "province": "string",
  "region": "string", 
  "postalCode": "string",
  "references": "string",
  "userId": "string"
}
```

#### DELETE `/api/address/addresses/:id`
Delete address by ID.

---

### 🚚 Carriers Management

#### POST `/api/carriers`
Create a new carrier.

**Request Body:**
```json
{
  "name": "Transporte Rápido",
  "coverageZones": ["Zona Norte", "Zona Sur"],
  "isActive": true
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "coverageZones": ["string"],
  "isAvailable": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### GET `/api/carriers`
Get all carriers.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string", 
    "coverageZones": ["string"],
    "isAvailable": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### GET `/api/carriers/:id`
Get carrier by ID.

#### PATCH `/api/carriers/:id`
Update carrier by ID.

**Request Body (all fields optional):**
```json
{
  "name": "string",
  "coverageZones": ["string"],
  "isActive": boolean
}
```

#### DELETE `/api/carriers/:id`
Delete carrier by ID.

#### POST `/api/carriers/:id/quote`
Get shipping quote from carrier.

**Request Body:**
```json
{
  "originPostalCode": "string",
  "destinationPostalCode": "string",
  "weight": 0,
  "dimensions": {
    "length": 0,
    "width": 0,
    "height": 0,
    "weight": 0
  },
  "deliverySpeed": "standard",
  "insuranceValue": 0,
  "fragile": false,
  "currency": "CLP",
  "pickupDate": "2023-01-01T00:00:00.000Z"
}
```

---

### 🏙️ Cities Management

#### POST `/api/cities` 🔒
Create a new city.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Los Ángeles",
  "code": "LA001"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "code": "string",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### GET `/api/cities` 🔒
Get all cities.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/cities/:id` 🔒
Get city by ID.

**Headers:** `Authorization: Bearer <token>`

#### PATCH `/api/cities/:id` 🔒
Update city by ID.

**Headers:** `Authorization: Bearer <token>`

**Request Body (all fields optional):**
```json
{
  "name": "string",
  "code": "string"
}
```

#### DELETE `/api/cities/:id` 🔒
Delete city by ID.

**Headers:** `Authorization: Bearer <token>`

---

### 📦 Deliveries Management

#### POST `/api/deliveries` 🔒
Create a new delivery.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "originPostalCode": "string",
  "destinationPostalCode": "string", 
  "weight": 0,
  "dimensions": {
    "length": 0,
    "width": 0,
    "height": 0,
    "weight": 0
  },
  "deliverySpeed": "standard",
  "insuranceValue": 0,
  "fragile": false,
  "currency": "CLP",
  "pickupDate": "2023-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "string",
  "originPostalCode": "string",
  "destinationPostalCode": "string",
  "weight": 0,
  "dimensions": {
    "length": 0,
    "width": 0,
    "height": 0,
    "weight": 0
  },
  "deliverySpeed": "standard",
  "insuranceValue": 0,
  "fragile": false,
  "currency": "CLP",
  "pickupDate": "2023-01-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### GET `/api/deliveries` 🔒
Get all deliveries.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/deliveries/:id` 🔒
Get delivery by ID.

**Headers:** `Authorization: Bearer <token>`

#### PATCH `/api/deliveries/:id` 🔒
Update delivery by ID.

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/api/deliveries/:id` 🔒
Delete delivery by ID.

**Headers:** `Authorization: Bearer <token>`

---

## Data Models

### User Schema
```json
{
  "id": "string",
  "name": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, hashed)",
  "role": "string (default: 'user')",
  "isActive": "boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Address Schema  
```json
{
  "id": "string",
  "street": "string (required)",
  "number": "string (required)", 
  "comune": "string (required)",
  "province": "string (required)",
  "region": "string (optional)",
  "postalCode": "string (optional)",
  "references": "string (optional)",
  "userId": "string (required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Carrier Schema
```json
{
  "id": "string",
  "name": "string (required)",
  "coverageZones": "string[] (default: [])",
  "isAvailable": "boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### City Schema
```json
{
  "id": "string",
  "name": "string (required)",
  "code": "string (required, unique)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Delivery Schema
```json
{
  "id": "string",
  "originPostalCode": "string (required)",
  "destinationPostalCode": "string (required)",
  "weight": "number (required)",
  "dimensions": {
    "length": "number (required)",
    "width": "number (required)", 
    "height": "number (required)",
    "weight": "number (required)"
  },
  "deliverySpeed": "enum ['standard', 'express', 'overnight'] (default: 'standard')",
  "insuranceValue": "number (required)",
  "fragile": "boolean (required)",
  "currency": "string (default: 'CLP')",
  "pickupDate": "Date (required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Enums

### DeliverySpeed
- `standard` - Standard delivery
- `express` - Express delivery  
- `overnight` - Overnight delivery

---

## Notes

🔒 = Protected route (requires JWT authentication)  
- All timestamps are in ISO 8601 format
- Database uses MongoDB with Mongoose ODM
- API uses global prefix `/api`
- CORS configured for `http://localhost:5173` (frontend)
- Swagger documentation auto-generated and available at `/api-docs`
- Input validation implemented with class-validator decorators
- Password hashing implemented with bcrypt
