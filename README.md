# 🏪 Store System Backend

API REST para sistema integral de gestión de tiendas, recursos humanos, inventario y ventas, construida con Node.js, Express, TypeScript y Prisma ORM con SQLite.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Base de Datos](#-base-de-datos)
- [Docker](#-docker)
- [Estructura de la Base de Datos](#-estructura-de-la-base-de-datos)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Desarrollo](#-desarrollo)
- [Licencia](#-licencia)

## ✨ Características

- 🔐 **Autenticación y Autorización** con JWT
- 👥 **Gestión de Recursos Humanos** (empleados, nóminas, asistencias, permisos)
- 📦 **Control de Inventario** (productos, almacenes, transferencias, logs de stock)
- 💰 **Sistema de Ventas** (ventas, pagos, devoluciones, descuentos)
- 🔄 **Gestión de Turnos** con sistema de intercambio entre empleados
- 📊 **Reportes y Métricas** de desempeño
- 🐳 **Dockerizado** para fácil deployment
- 🔒 **Encriptación de contraseñas** automática con bcrypt
- 🎯 **Validación de datos** con express-validator

## 🛠 Tecnologías

### Core

- **Node.js 22** - Runtime de JavaScript
- **TypeScript 5.9** - Tipado estático
- **Express 5.2** - Framework web
- **Prisma 7.3** - ORM y query builder

### Base de Datos

- **SQLite** con better-sqlite3
- **Prisma Client** con soporte para adaptador SQLite

### Seguridad

- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - Tokens JWT para autenticación
- **cors** - Control de acceso cross-origin

### Desarrollo

- **nodemon** - Hot reload en desarrollo
- **ts-node** - Ejecución de TypeScript
- **tsx** - Ejecución rápida de TypeScript
- **pnpm** - Gestor de paquetes eficiente

## 📁 Arquitectura del Proyecto

```
store-system-backend/
├── prisma/
│   ├── schema/              # Esquemas Prisma modulares
│   │   ├── auth.prisma      # Autenticación y usuarios
│   │   ├── base.prisma      # Configuración base
│   │   ├── hr.prisma        # Recursos humanos
│   │   ├── inventory.prisma # Inventario
│   │   └── sales.prisma     # Ventas
│   ├── migrations/          # Historial de migraciones
│   ├── seed.ts             # Datos iniciales
│   └── src/
│       └── index.ts        # Cliente Prisma extendido
├── src/
│   ├── config/             # Configuraciones
│   │   ├── db.config.ts
│   │   ├── envs.config.ts
│   │   └── prisma.ts
│   ├── controller/         # Controladores
│   ├── service/            # Lógica de negocio
│   ├── router/             # Rutas
│   ├── middlewares/        # Middlewares personalizados
│   ├── helpers/            # Utilidades
│   ├── model/              # Modelos de servidor
│   └── app.ts             # Punto de entrada
├── docker-compose.yml      # Orquestación Docker
├── Dockerfile             # Imagen Docker
├── prisma.config.ts       # Configuración Prisma
└── package.json

```

## 📦 Requisitos Previos

- **Node.js** >= 22.x
- **pnpm** >= 10.28.2 (instalado automáticamente con corepack)
- **Docker** y **Docker Compose** (opcional, para deployment)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd store-system-backend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET_KEY=your-super-secret-key-change-this

# Database (opcional para otros motores)
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USER=
DB_PASSWORD=
```

### 4. Configurar la base de datos

```bash
# Generar el cliente Prisma
pnpm db:generate

# Ejecutar migraciones
pnpm db:migrate

# Sembrar datos iniciales (admin por defecto)
pnpm db:seed
```

### 5. Iniciar el servidor

```bash
# Desarrollo (con hot reload)
pnpm dev

# Producción
pnpm build
pnpm start
```

El servidor estará disponible en `http://localhost:8080`

## ⚙️ Configuración

### Cliente Prisma Extendido

El proyecto utiliza un cliente Prisma extendido que automáticamente:

- ✅ Hashea contraseñas en operaciones `create`, `update` y `upsert`
- ✅ Usa bcrypt con salt rounds de 10
- ✅ Mantiene el patrón singleton en desarrollo

Ubicación: [prisma/src/index.ts](prisma/src/index.ts)

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor con nodemon (hot reload)

# Compilación
pnpm build            # Compila TypeScript a JavaScript
pnpm start            # Ejecuta servidor compilado

# Base de datos
pnpm db:generate      # Genera Prisma Client
pnpm db:migrate       # Ejecuta migraciones
pnpm db:studio        # Abre Prisma Studio (GUI)
pnpm db:seed          # Siembra datos iniciales

# Utilidades
pnpm clean            # Limpia carpeta dist/
```

## 🗄️ Base de Datos

### Estructura Modular

El proyecto utiliza múltiples archivos de schema Prisma para mejor organización:

#### 🔐 **auth.prisma** - Autenticación

- `User` - Usuarios del sistema con roles y verificación

#### 👥 **hr.prisma** - Recursos Humanos

- `Employee` - Información de empleados
- `Schedule` - Horarios de trabajo
- `TimeOff` - Días libres y vacaciones
- `AttendanceLog` - Registro de asistencias
- `Payroll` - Nóminas
- `SalaryLog` - Historial de salarios
- `PerformanceWarning` - Advertencias de desempeño
- `ShiftSwap` - Intercambios de turnos

#### 📦 **inventory.prisma** - Inventario

- `Warehouse` - Almacenes
- `Product` - Productos
- `StockLog` - Movimientos de inventario
- `Transfer` - Transferencias entre almacenes
- `TransferItem` - Ítems de transferencia

#### 💰 **sales.prisma** - Ventas

- `Sale` - Ventas realizadas
- `SaleItem` - Productos vendidos
- `Payment` - Pagos
- `Refund` - Devoluciones
- `Discount` - Descuentos aplicados

### Migraciones

```bash
# Crear nueva migración
pnpm db:migrate

# Ver estado de migraciones
pnpm exec prisma migrate status

# Resetear base de datos (CUIDADO: solo en desarrollo)
pnpm exec prisma migrate reset
```

### Datos Iniciales (Seed)

El seed crea un usuario administrador por defecto:

- **Email:** `mail@sofi.dev`
- **Password:** `sofievO`
- **Role:** Admin
- **Status:** Activo y Verificado

## 🐳 Docker

### Desarrollo Local

```bash
# Construir imagen
docker compose build

# Iniciar contenedor
docker compose up -d

# Ver logs
docker compose logs -f app

# Detener
docker compose down
```

### Características del Dockerfile

- ✅ **Multi-stage build** para optimizar tamaño
- ✅ **Instalación de dependencias** con frozen lockfile
- ✅ **Generación automática** de Prisma Client
- ✅ **Volumen persistente** para base de datos SQLite
- ✅ **Migraciones automáticas** al iniciar
- ✅ **Política de restart** para alta disponibilidad

### Volúmenes

Los datos se persisten en `./data/prod.db` en el host.

## 🎯 Funcionalidades

### Administradores

- ✅ Registro y gestión de usuarios
- ✅ Registro y gestión de empleados
- ✅ Modificación de permisos
- ✅ Actualización de datos personales
- ✅ Registro de días libres
- ✅ Gestión de nóminas
- ✅ Control de inventario
- ✅ Aprobación de intercambios de turnos

### Empleados (Usuarios)

- ✅ Acceso a perfil personal
- ✅ Consulta de días libres disponibles
- ✅ Consulta de horas extra
- ✅ Visualización de horarios
- ✅ Descarga de recibos de nómina
- ✅ Solicitud de intercambio de turnos
- ✅ Registro de ventas

## 🔗 API Endpoints

### Autenticación

```
POST   /api/auth/register     # Registro de usuario
POST   /api/auth/login        # Inicio de sesión
POST   /api/auth/verify       # Verificar email
POST   /api/auth/refresh      # Renovar token
```

### Usuarios

```
GET    /api/users            # Listar usuarios (Admin)
GET    /api/users/:id        # Obtener usuario
PUT    /api/users/:id        # Actualizar usuario
DELETE /api/users/:id        # Eliminar usuario (Admin)
```

### Empleados

```
GET    /api/employees        # Listar empleados
POST   /api/employees        # Crear empleado (Admin)
GET    /api/employees/:id    # Obtener empleado
PUT    /api/employees/:id    # Actualizar empleado
```

_Más endpoints en desarrollo..._

## 💻 Desarrollo

### Convenciones de Código

- **Arquitectura:** MVC (Model-View-Controller)
- **Estilo:** camelCase para variables y funciones
- **Imports:** Absolutos desde `src/`
- **Tipos:** TypeScript strict mode

### Agregar Nuevo Módulo

1. Crear schema en `prisma/schema/`
2. Ejecutar migración: `pnpm db:migrate`
3. Crear controlador en `src/controller/`
4. Crear servicio en `src/service/`
5. Crear router en `src/router/`
6. Registrar router en `src/model/server.ts`

### Debugging

El proyecto usa `ts-node` con nodemon para hot reload:

```json
// nodemon.json
{
    "watch": ["src", "prisma"],
    "ext": "ts,prisma",
    "exec": "ts-node src/app.ts"
}
```

## 📝 Notas Importantes

- ⚠️ El script de seed está bloqueado en producción
- ⚠️ Cambia `JWT_SECRET_KEY` en producción
- ⚠️ SQLite es ideal para desarrollo; considera PostgreSQL/MySQL para producción
- ⚠️ Los logs de queries solo aparecen en desarrollo

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

**Desarrollado con ❤️ por el equipo de Store System**
