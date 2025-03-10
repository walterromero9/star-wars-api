# Star Wars API - NestJS

Una API RESTful desarrollada con NestJS para gestionar películas de Star Wars.

## Descripción

Este proyecto proporciona endpoints para gestionar usuarios y películas de Star Wars, con sincronización automática desde la API pública de Star Wars (SWAPI). Incluye autenticación JWT, sistema de roles y documentación completa con Swagger.

## Tecnologías utilizadas

- NestJS
- PostgreSQL
- Prisma ORM
- JWT para autenticación
- Swagger para documentación
- Jest para pruebas

## ⚙️ Requisitos previos

- Node.js (v14 o superior)
- PostgreSQL

## 🔧 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/conexa-star-wars.git
   cd conexa-star-wars
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crea un archivo `.env` basado en el ejemplo proporcionado:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/starwars_db
   JWT_SECRET=tu_clave_secreta
   ```

4. Ejecutar migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. (Opcional) Poblar la base de datos con datos iniciales:
   ```bash
   npx prisma db seed
   ```

## Ejecución

## Docker

El proyecto incluye un archivo `docker-compose.yml` para facilitar la configuración de la base de datos PostgreSQL.

### Iniciar la base de datos

```bash
docker-compose up -d
```

Esto iniciará un contenedor PostgreSQL con la siguiente configuración:
- **Puerto**: 5432
- **Usuario**: postgres
- **Contraseña**: postgres
- **Base de datos**: starwars_db

### Detener la base de datos

```bash
docker-compose down
```

### Verificar el estado

```bash
docker-compose ps
```
```

### 🔗 Conexión con la aplicación

La configuración en tu archivo `.env` debería coincidir con la configuración de Docker:

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/starwars_db?e de datos PostgreSQL que se ejecuta en Docker.

### Desarrollo

```bash
npm run start:dev
```

## Pruebas

### Ejecutar pruebas unitarias

```bash
npm run test
```

### Ejecutar pruebas con cobertura

```bash
npm run test:cov
```

## Documentación

La documentación de la API está disponible a través de Swagger UI en:
http://localhost:3000/docs


## Autenticación

La API utiliza JWT para autenticación. Para obtener un token:

1. Registra un usuario en `/auth` (POST)
2. Inicia sesión en `/auth/login` (POST)
3. Usa el token recibido en el header `Authorization: Bearer {token}`

## Roles y permisos

- **USER**: Puede ver las películas
- **ADMIN**: Puede crear, actualizar y eliminar películas
