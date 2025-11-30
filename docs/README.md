# Backend NestJS para GPI Template - Universidad de Valparaíso

Este proyecto es un backend desarrollado con NestJS y MongoDB para el template GPI de la Universidad de Valparaíso. El backend proporciona una API RESTful que se integra con el frontend React, ofreciendo funcionalidades de autenticación y gestión de usuarios.

## Tecnologías

Este backend utiliza las siguientes tecnologías:

- **NestJS**: Framework progresivo para construir aplicaciones del lado del servidor
- **TypeScript**: Superset tipado de JavaScript
- **MongoDB**: Base de datos NoSQL orientada a documentos
- **Mongoose**: Biblioteca ODM (Object Data Modeling) para MongoDB
- **JWT**: JSON Web Tokens para autenticación
- **Passport**: Middleware para autenticación
- **Class Validator**: Validación de datos basada en decoradores
- **bcrypt**: Librería para hashear contraseñas

## Diseño (UI/UX)

Los mockups y prototipos para el frontend están disponibles en Figma:

[Ver mockups en Figma](https://www.figma.com/design/aSzfltXTlqDjB4kaRq91Ue/Untitled?node-id=0-1&t=EUo6JxVxO675sISn-1)


## Estructura de Carpetas

```
backend/
├── src/
│   ├── app.module.ts                # Módulo principal
│   ├── main.ts                      # Punto de entrada
│   ├── config/                      # Configuraciones
│   │   ├── database.config.ts       # Configuración de MongoDB
│   │   ├── jwt.config.ts            # Configuración de JWT
│   │   └── env.config.ts            # Variables de entorno
│   ├── auth/                        # Módulo de autenticación
│   │   ├── auth.module.ts           # Módulo de autenticación
│   │   ├── auth.controller.ts       # Controlador
│   │   ├── auth.service.ts          # Servicio
│   │   ├── dto/                     # DTOs para validación
│   │   │   ├── login.dto.ts         # Login DTO
│   │   │   └── register.dto.ts      # Registro DTO
│   │   ├── guards/                  # Guards para proteger rutas
│   │   │   └── jwt-auth.guard.ts    # Guard de JWT
│   │   └── strategies/              # Estrategias de Passport
│   │       └── jwt.strategy.ts      # Estrategia JWT
│   ├── users/                       # Módulo de usuarios
│   │   ├── users.module.ts          # Módulo de usuarios
│   │   ├── users.controller.ts      # Controlador
│   │   ├── users.service.ts         # Servicio
│   │   ├── schemas/                 # Esquemas de MongoDB
│   │   │   └── user.schema.ts       # Esquema de usuario
│   │   └── dto/                     # DTOs
│   │       ├── create-user.dto.ts   # DTO para crear usuario
│   │       └── update-user.dto.ts   # DTO para actualizar usuario
│   └── common/                      # Código compartido
├── .env                             # Variables de entorno
├── nest-cli.json                    # Configuración de NestJS CLI
├── package.json                     # Dependencias
└── tsconfig.json                    # Configuración de TypeScript
```

## Arquitectura

### Módulos

El backend está organizado en módulos, siguiendo las mejores prácticas de NestJS:

- **AppModule**: Módulo raíz que importa el resto de módulos
- **AuthModule**: Gestiona la autenticación y autorización
- **UsersModule**: Gestiona las operaciones CRUD de usuarios

### Patrón de Arquitectura

La aplicación sigue una arquitectura en capas:

- **Controladores**: Gestionan las solicitudes HTTP y respuestas
- **Servicios**: Contienen la lógica de negocio
- **Repositorios**: Interactúan con la base de datos (a través de Mongoose)

### Sistema de Autenticación

La autenticación está implementada usando JWT (JSON Web Tokens):

1. El usuario se registra o inicia sesión
2. El servidor valida las credenciales y genera un token JWT
3. El cliente almacena el token y lo incluye en cada solicitud
4. Los guards verifican el token para proteger las rutas

## Instalación y Configuración

### Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- pnpm (sigue las instrucciones de instalación del README del frontend)
- MongoDB (instalado localmente o una instancia en la nube como MongoDB Atlas)

### MongoDB Atlas

1. **Seleccionar/Crear usuario de base de datos**
   - Atlas → **Security** → **Database Access** → **Add New Database User**
   - Método: **Password**
   - Rol sugerido: `readWrite` sobre la base del proyecto (p. ej., `gpi_database`)

3. **Permitir IP**
   - Atlas → **Security** → **Network Access** → **Add IP Address**

4. **Obtener la cadena de conexión (SRV)**
   - Botón **Connect** → **Drivers** → **Node.js**
   - Formato típico:
     
     ```
     mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
     ```
   #### Notas adicionales: 
   * Se ha enviado una **invitación** al proyecto la cual debe ser aceptada para acceder al dashboard de Atlas.
   * Para **entorno de desarrollo**, se configuró temporalmente acceso por IP con expiración de **1 semana**.
   * Es **recomendable generar una contraseña nueva y fuerte** para cada usuario y almacenarla en un gestor seguro.
   * **Importante:** Atlas **no muestra contraseñas existentes**. Si la olvidas, usa **Reset Password** en *Database Access* y actualiza tu `.env`.
   * Dentro del apartado de **Database Access** se pueden encontrar los usuarios y correspondientes contraseñas que deben ser usadas en la cadena de conexión a Atlas.

### Instalación

1. Clona este repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. Instala las dependencias con pnpm:
   ```bash
   pnpm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb+srv://<user>:<pass-URL-encoded>@<cluster>.mongodb.net/gpi_database?retryWrites=true&w=majority
   # Local (dejar comentado si usas Atlas):
   # MONGODB_URI=mongodb://localhost:27017/gpi_database

   JWT_SECRET=EstoEsUnSecretoSuperSeguroParaElCursoGPI
   JWT_EXPIRES_IN=1d
   ```

4. Asegúrate de que MongoDB esté en ejecución:
   - **Windows**: Inicia el servicio MongoDB
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

### Ejecución

- **Desarrollo**:
  ```bash
  pnpm start:dev
  ```
  Esto iniciará el servidor en modo desarrollo con recarga automática en `http://localhost:3000/api`

- **Producción**:
  ```bash
  pnpm build
  pnpm start:prod
  ```

## API Endpoints

### Autenticación

- **POST /api/auth/register**: Registrar un nuevo usuario
  ```json
  {
    "name": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **POST /api/auth/login**: Iniciar sesión
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **GET /api/auth/me**: Obtener información del usuario autenticado (requiere token JWT)

### Usuarios

- **GET /api/users**: Obtener todos los usuarios (requiere token JWT)
- **GET /api/users/:id**: Obtener un usuario por ID (requiere token JWT)
- **PATCH /api/users/:id**: Actualizar un usuario (requiere token JWT)
- **DELETE /api/users/:id**: Eliminar un usuario (requiere token JWT)

## Integración con el Frontend

Para integrar este backend con el frontend React:

1. En el frontend, asegúrate de que los servicios en `src/db/services` apunten a la URL correcta del backend:
   ```typescript
   // src/db/config/api.ts
   import axios from 'axios';

   export const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
     timeout: 10000,
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // Interceptor para añadir el token de autenticación
   api.interceptors.request.use(config => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

2. Los hooks de autenticación en el frontend deben usar los endpoints correspondientes:
   ```typescript
   // Ejemplo de login en el frontend
   const login = async (email, password) => {
     try {
       const response = await api.post('/auth/login', { email, password });
       localStorage.setItem('token', response.data.access_token);
       return response.data.user;
     } catch (error) {
       throw new Error('Error de autenticación');
     }
   };
   ```

## Conceptos Clave para Estudiantes

### DTO (Data Transfer Object)

Los DTOs definen la estructura de los datos que se reciben en las solicitudes HTTP:

```typescript
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
```

Los decoradores como `@IsNotEmpty()` y `@IsEmail()` validan automáticamente los datos recibidos.

### Esquemas de Mongoose

Definen la estructura de los documentos en MongoDB:

```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' }) // 'admin' o 'user'
  role: string;

  @Prop({ default: true })
  isActive: boolean;
}
```

### Guards

Protegen las rutas y verifican permisos:

```typescript
@UseGuards(JwtAuthGuard)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

### Inyección de Dependencias

NestJS utiliza inyección de dependencias para gestionar servicios y componentes:

```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ...
}
```

## Personalización y Extensión

### Añadir un Nuevo Módulo

1. Crea una nueva carpeta con la estructura de módulo dentro de `src/`
2. Define el esquema, DTOs, controlador y servicio
3. Importa el módulo en `app.module.ts`

### Añadir un Nuevo Endpoint

1. Añade un nuevo método en el controlador correspondiente
2. Implementa la lógica en el servicio
3. Define los DTOs necesarios para la validación

### Añadir un Nuevo Guard

1. Crea un nuevo guard en `src/common/guards` o en el módulo específico
2. Implementa la lógica de autorización
3. Aplica el guard a nivel de controlador o ruta

## Notas Importantes

- Este backend está diseñado para desarrollo local. Para producción, se deben implementar medidas de seguridad adicionales.
- El secreto JWT debe mantenerse seguro y cambiarse en un entorno de producción.
- Las contraseñas se almacenan hasheadas, pero se pueden implementar políticas más estrictas.
- La conexión a MongoDB está configurada para una instancia local. Para producción, considera usar MongoDB Atlas u otro servicio en la nube.

---

Desarrollado para la asignatura de Gestión de Proyecto Informático - Diego Monsalves - René Noël - Universidad de Valparaíso


