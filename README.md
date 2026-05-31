# 🏋️ GymBro + Symmetry App

Aplicación completa de gestión de gimnasios con funcionalidades avanzadas de seguimiento fitness al estilo Symmetry App.

## 🚀 Características Principales

### Sistema Original GymBro (Backend)
- ✅ **Gestión de Usuarios**: Roles ADMIN, COACH, ALUMNO
- ✅ **Multi-sucursal**: Soporte para múltiples ubicaciones por tenant
- ✅ **Asistencia**: Check-in de alumnos con validación por coach
- ✅ **Pagos**: Sistema idempotente con múltiples métodos (CARD, QR, TRANSFER, CASH)
- ✅ **Estados de Cuenta**: Historial completo y suscripciones
- ✅ **Clases y Reservas**: Cronograma semanal con capacidad limitada
- ✅ **WODs**: Entrenamientos del día programados
- ✅ **Notificaciones**: Sistema escalable push/email
- ✅ **Planes de Membresía**: Creación y gestión personalizada

### Nuevas Funcionalidades Symmetry App
- 📸 **Progreso Físico**: Fotos comparativas (front/side/back/face) y mediciones corporales
- 💪 **Entrenamientos Personalizados**: Rutinas, biblioteca de ejercicios, historial
- 🥗 **Control Nutricional**: Registro de comidas, macros, agua, recetas saludables
- 🎯 **Objetivos Fitness**: Metas de peso, % grasa, seguimiento de progreso

## 📁 Estructura del Proyecto

```
gymbro-symmetry/
├── api/                    # Backend Node.js + Express
│   ├── controllers/        # Lógica de negocio
│   ├── routes/             # Endpoints API
│   ├── middleware/         # Auth, validaciones
│   ├── models/             # Consultas SQL
│   └── config/             # Configuración DB y JWT
├── web/                    # Frontend React + Vite
│   ├── src/
│   │   ├── components/     # Componentes UI reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── modules/        # Módulos Symmetry
│   │   ├── stores/         # Estado global (Zustand)
│   │   ├── routes/         # Ruteo protegido
│   │   └── config/         # Configuración API
│   └── public/
├── mobile/                 # App React Native + Expo
│   ├── src/
│   │   ├── screens/        # Pantallas móviles
│   │   ├── components/     # Componentes nativos
│   │   ├── stores/         # Estado global
│   │   └── config/         # API y configuración
│   └── assets/
├── gymbro_complete_schema.sql  # Schema PostgreSQL completo
└── README_IMPLEMENTACION.md    # Guía detallada
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express** (ES Modules)
- **PostgreSQL** con pg-promise
- **JWT** para autenticación
- **bcryptjs** para hashing
- **CORS** habilitado

### Frontend Web
- **React 18** + **Vite**
- **TypeScript**
- **TailwindCSS** para estilos
- **Zustand** para estado global
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Lucide React** para íconos

### App Móvil
- **React Native** + **Expo**
- **TypeScript**
- **Expo Router** para navegación
- **Zustand** para estado global
- **Expo Camera** para fotos de progreso
- **Expo Notifications** para push notifications

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** o **yarn**
- **Expo CLI** (para móvil)

## 🚀 Instalación y Configuración

### 1. Base de Datos

```bash
# Crear base de datos
createdb gymbro

# Ejecutar schema completo
psql -d gymbro -f gymbro_complete_schema.sql
```

### 2. Backend

```bash
cd api
npm install

# Configurar variables de entorno (.env)
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Iniciar servidor
npm start
# Server corriendo en http://localhost:3000
```

### 3. Frontend Web

```bash
cd web
npm install

# Iniciar desarrollo
npm run dev
# Web corriendo en http://localhost:5173

# Build para producción
npm run build
```

### 4. App Móvil

```bash
cd mobile
npm install

# Iniciar Expo
npm start
# Escanear QR con Expo Go o presionar 'a' para Android, 'i' para iOS

# Build para producción
eas build --platform android
eas build --platform ios
```

## 👥 Usuarios de Prueba

El schema incluye datos seed para testing:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@gymbro.com | password123 |
| Coach | coach@gymbro.com | password123 |
| Alumno | alumno@gymbro.com | password123 |

## 📱 Endpoints API Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Resetear contraseña

### Módulos Originales
- `GET/POST /api/users` - Gestión de usuarios
- `GET/POST /api/payments` - Procesamiento de pagos
- `GET/POST /api/classes` - Clases y reservas
- `GET/POST /api/wods` - Entrenamientos del día
- `GET/POST /api/attendance` - Registro de asistencia

### Módulos Symmetry
- `GET/POST /api/progress/photos` - Fotos de progreso
- `GET/POST /api/progress/measurements` - Mediciones corporales
- `GET/POST /api/workouts` - Rutinas personalizadas
- `GET/POST /api/nutrition/logs` - Registro nutricional
- `GET/POST /api/goals` - Objetivos fitness

## 🔐 Autenticación

La aplicación utiliza JWT tokens con expiración de 24 horas. Los tokens se almacenan en:
- **Web**: localStorage
- **Móvil**: AsyncStorage
- **API**: Header `Authorization: Bearer <token>`

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para issues o preguntas, abrir un ticket en GitHub Issues.

---

**Desarrollado con ❤️ para la comunidad fitness**
