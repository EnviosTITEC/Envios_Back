# Modelo de datos — PulgaShop Microservicio Envíos

Resumen mínimo requerido por la rúbrica: estructura JSON de los modelos, convenciones de nomenclatura y comprobación de que el dump refleja el modelo.

1) Convenciones de nomenclatura
- Colecciones: nombres en minúsculas y en plural (ej. `users`, `addresses`, `carriers`, `cities`, `deliveries`).
- Campos: camelCase para atributos (ej. `postalCode`, `originPostalCode`, `isAvailable`).
- Identificadores: Mongo usa `_id` (ObjectId). En las respuestas la API expone `id` como virtual string.

2) Estructuras (ejemplos JSON simplificados)

- users (colección `users`)
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

- addresses (colección `addresses`)
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
  "user_id": "ObjectId (string reference)",

Nota: para nuevas tablas se utiliza la nomenclatura `user_id` (snake_case, español). En este repo `addresses` y `deliveries` usan `user_id`.
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

- carriers
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

- cities
```json
{
  "_id": "ObjectId",
  "name": "string",
  "postalCode": "string (nota: campo con snake_case en el esquema actual)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

- deliveries
```json
{
  "_id": "ObjectId",
  "originPostalCode": "string",
  "destinationPostalCode": "string",
  "weight": 0,
  "dimensions": { "length":0, "width":0, "height":0, "weight":0 },
  "deliverySpeed": "standard|express|overnight",
  "insuranceValue": 0,
  "fragile": false,
  "currency": "CLP",
  "pickupDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

3) Cumplimiento con la rúbrica
- El modelo implementado en `src/*/schemas/*.ts` coincide con las estructuras JSON anteriores.
- Las convenciones de nomenclatura son mayoritariamente camelCase para campos y plural/lowercase para colecciones. (Nota: `City.postal_code` es una excepción y está documentada).

4) Dump / seed
- Para generar un dump completo usamos `scripts/backup.sh` (crea archivo `.gz` con `mongodump --archive --gzip`).
- Para poblar con datos de prueba (usuarios + direcciones) se incluye `scripts/seed_fake_data.js`. Procedimiento recomendado:
  1. Ajustar `.env` con `MONGODB_URI` apuntando a tu cluster de pruebas.
  2. Ejecutar `node scripts/seed_fake_data.js [N_USERS]` (ej: `node scripts/seed_fake_data.js 10`).
  3. Crear dump con `./scripts/backup.sh`.

5) Evidencia (qué incluir en la entrega)
- `docs/database-model.md` (este archivo).
- Archivo dump generado (por ejemplo `backups/gpi_database-YYYY-MM-DD_HHMMSS.gz`).
- Opcional: `.json` de exportación por colección usando `mongoexport`.

Si quieres, genero también un `.png` con el diagrama ER simple o exporto las estructuras JSON a un archivo separado. ¿Quieres que lo haga?
