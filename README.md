# Hair Salon Booking App 💇‍♀️📱

Aplicación mobile para la gestión integral de turnos de una peluquería, desarrollada con **React Native, TypeScript y Expo**.

El proyecto permite a los clientes consultar la disponibilidad de los empleados, reservar turnos y gestionar sus citas, mientras que los administradores cuentan con herramientas para gestionar empleados, servicios y reservas.

## ✨ Características

### 👤 Autenticación y usuarios
- Registro e inicio de sesión.
- Verificación de correo electrónico.
- Gestión de sesiones mediante **Supabase Auth**.
- Control de acceso basado en roles.
- Protección de funcionalidades administrativas.

### 📅 Gestión de turnos
- Selección de servicio y empleado.
- Consulta de horarios disponibles en tiempo real.
- Reserva de turnos.
- Cancelación de reservas.
- Reagendamiento de citas.
- Historial de turnos.

### 🛠️ Panel de administración
- Gestión de empleados.
- Gestión de servicios.
- Administración de turnos.
- Visualización de información del negocio.
- Operaciones CRUD sobre los recursos principales.

### 🤖 Chatbot con IA
- Chatbot integrado para responder preguntas frecuentes.
- Integración con **Gemini API**.
- Uso de **Supabase Edge Functions** para ejecutar la lógica del chatbot de forma segura sin exponer las credenciales de la API en la aplicación.

### 🔐 Seguridad
- Autenticación mediante Supabase Auth.
- Control de acceso basado en roles.
- **Row Level Security (RLS)** en PostgreSQL.
- Separación entre lógica del cliente y operaciones sensibles del backend.

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura modular basada en **separación de responsabilidades**, buscando mantener el código organizado, escalable y fácil de mantener.

```text
app/
├── config/       # Configuración de la aplicación
├── constants/    # Constantes y valores globales
├── data/         # Acceso y gestión de datos
├── domain/       # Modelos y lógica de dominio
├── errors/       # Manejo y definición de errores
├── features/     # Funcionalidades principales de la aplicación
├── hooks/        # Hooks reutilizables
├── navigation/   # Configuración de la navegación
├── theme/        # Tema, estilos y configuración visual
├── shared/       # Componentes y recursos compartidos
└── utils/        # Funciones y utilidades generales
```

La aplicación utiliza **Expo Router** para la navegación y separa la lógica de presentación, acceso a datos y funcionalidades reutilizables.

## 🛠️ Tecnologías

### Mobile
- React Native
- TypeScript
- Expo
- Expo Router

### Backend / Cloud
- Supabase
- Supabase Auth
- Supabase Edge Functions
- PostgreSQL

### Inteligencia Artificial
- Gemini API

### Seguridad
- Row Level Security (RLS)
- Role-based access control

## 🗄️ Base de datos

La aplicación utiliza **PostgreSQL mediante Supabase**.

La base de datos gestiona usuarios, empleados, servicios y turnos, utilizando relaciones entre las entidades para determinar la disponibilidad de horarios y controlar las reservas.

El acceso a los datos está protegido mediante **Row Level Security (RLS)**, permitiendo aplicar políticas de acceso según el usuario autenticado y su rol.

## 🚀 Instalación

### Requisitos

- Node.js
- npm
- Expo CLI
- Cuenta de Supabase

### 1. Clonar el repositorio

```bash
git clone https://github.com/MatiasOrtizF/appointments.git

cd appointments
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

Las credenciales utilizadas por las Edge Functions deben configurarse directamente en Supabase y no incluirse en el código fuente.

### 4. Ejecutar el proyecto

```bash
npx expo start
```

Luego podés ejecutar la aplicación mediante:

- Android Emulator
- Dispositivo Android
- Expo Go

## 📱 Capturas

> Agregar aquí capturas de pantalla de la aplicación.

## 🔮 Próximas mejoras

Algunas funcionalidades que podrían incorporarse en futuras versiones:

- Notificaciones push para recordar próximos turnos.
- Recordatorios automáticos mediante WhatsApp.
- Integración de pagos online.
- Estadísticas más avanzadas para administradores.
- Sistema de calificaciones y reseñas.
- Soporte para múltiples sucursales.

## 📚 Aprendizajes

Este proyecto permitió trabajar de forma integral en el desarrollo de una aplicación mobile, incluyendo:

- Arquitectura y organización de proyectos React Native.
- TypeScript.
- Autenticación y gestión de sesiones.
- Diseño y consumo de bases de datos PostgreSQL.
- Row Level Security.
- Desarrollo de funcionalidades administrativas.
- Integración de servicios externos.
- Desarrollo de Edge Functions.
- Integración de APIs de inteligencia artificial.
- Diseño de sistemas de disponibilidad y reservas.

## 👨‍💻 Autor

**Matias Ortiz**

- GitHub: [MatiasOrtizF](https://github.com/MatiasOrtizF)
- Portfolio: [Portfolio](https://matiasortizf.github.io/portfolio/)
