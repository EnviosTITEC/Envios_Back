# Usar la última versión estable de Node.js como base
FROM node:current-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto
RUN pnpm build

# Exponer el puerto en el que corre la aplicación (ajustar si es necesario)
EXPOSE 3100

# Comando para ejecutar la aplicación
CMD ["pnpm", "start"]