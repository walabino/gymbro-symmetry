# GymBro Mobile - Symmetry App Style

Aplicación móvil React Native con Expo para GymBro, implementando funcionalidades estilo Symmetry App.

## 🚀 Características Principales

### Funcionalidades Symmetry App
- **📸 Progreso Físico**: Fotos de progreso (frontal, lateral, espalda, rostro) con cámara integrada
- **💪 Entrenamientos**: Rutinas personalizadas, biblioteca de ejercicios, historial
- **🥗 Nutrición**: Registro de comidas, seguimiento de macros, agua, recetas saludables
- **🎯 Objetivos**: Metas de peso, % grasa, seguimiento de progreso con gráficos

### Funcionalidades GymBro Original
- **✅ Asistencia**: Check-in de alumnos
- **👥 Alumnos**: Gestión completa de usuarios
- **💰 Pagos**: Estados de cuenta, suscripciones
- **📅 Clases**: Reservas y cronograma
- **🔔 Notificaciones Push**: Recordatorios y actualizaciones

## 📋 Requisitos Previos

1. **Node.js** (v18 o superior)
2. **Expo CLI** (`npm install -g expo-cli`)
3. **Expo Go** app en tu dispositivo móvil (iOS/Android)
4. **Backend GymBro** corriendo en `http://localhost:3000`

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# O directamente
expo start
```

## 📱 Ejecución en Dispositivos

### Android
```bash
npm run android
# o
expo start --android
```

### iOS
```bash
npm run ios
# o
expo start --ios
```

### Web (Testing)
```bash
npm run web
# o
expo start --web
```

## 🔧 Configuración

### API Backend
Editar `/src/config/api.ts`:
```typescript
const API_BASE_URL = 'http://TU_IP:3000/api';
```

Para testing en emulador Android: `http://10.0.2.2:3000/api`
Para dispositivo físico: `http://TU_IP_LOCAL:3000/api`

### Notificaciones Push
Configurar Project ID en `/src/stores/authStore.ts`:
```typescript
projectId: 'tu-expo-project-id'
```

## 📁 Estructura del Proyecto

```
mobile/
├── App.tsx                 # Punto de entrada principal
├── app.json               # Configuración de Expo
├── package.json           # Dependencias
├── assets/                # Imágenes, iconos, fuentes
├── src/
│   ├── config/
│   │   └── api.ts        # Configuración de Axios y servicios API
│   ├── stores/
│   │   └── authStore.ts  # Estado global de autenticación
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   └── ProgressCameraScreen.tsx
│   ├── components/
│   │   └── CommonComponents.tsx
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilidades
│   └── types/            # Tipos TypeScript
└── README.md
```

## 🔐 Usuarios de Prueba

Usa las credenciales del backend:
- **Alumno**: `alumno@gymbro.com` / `password123`
- **Coach**: `coach@gymbro.com` / `password123`
- **Admin**: `admin@gymbro.com` / `password123`

## 🎨 Diseño UI/UX

- **Tema Oscuro**: Estilo moderno similar a Symmetry App
- **Colores Principales**: 
  - Primario: `#e94560` (Rojo/Rosado)
  - Secundario: `#4CAF50` (Verde)
  - Fondo: `#0a0a0a` / `#1a1a2e`
- **Iconos**: Ionicons (React Native Vector Icons)

## 📲 Permisos Requeridos

La app solicita los siguientes permisos:
- **Cámara**: Para fotos de progreso
- **Galería**: Para seleccionar imágenes
- **Notificaciones**: Para recordatorios y actualizaciones
- **Micrófono**: Para videos de ejercicios (futuro)

## 🔔 Notificaciones Push

La app soporta notificaciones push mediante Expo Notifications:
- Recordatorios de entrenamiento
- Logros y metas alcanzadas
- Actualizaciones de clases
- Mensajes de coaches

## 🚧 Próximas Implementaciones

- [ ] Pantalla de registro completa
- [ ] Recuperación de contraseña
- [ ] Pantallas de Entrenamientos detalladas
- [ ] Pantallas de Nutrición completas
- [ ] Pantallas de Objetivos con gráficos
- [ ] Perfil de usuario editable
- [ ] Configuración de la app
- [ ] Modo offline
- [ ] Sincronización en segundo plano

## 🐛 Solución de Problemas

### Error de conexión al backend
- Verifica que el backend esté corriendo
- Asegúrate de usar la IP correcta en `api.ts`
- Para Android emulator usa `10.0.2.2` en lugar de `localhost`

### Error de permisos de cámara
- Reinicia la app después de conceder permisos
- Verifica configuración en `app.json`

### Error de notificaciones push
- Configura tu Project ID en Expo
- Verifica permisos en el dispositivo

## 📄 Licencia

Propiedad de GymBro - Todos los derechos reservados

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
