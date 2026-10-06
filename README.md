# Aguafress Mobile

Aplicación móvil de **Aguafress**, desarrollada con React Native y Expo.

El proyecto permite gestionar las operaciones principales de vendedores y clientes conectándose al backend de Aguafress mediante su API.

## Tecnologías

- React Native
- Expo
- Expo Router
- TypeScript
- NetInfo
- Expo SecureStore

## Roles

La aplicación móvil está orientada principalmente a:

- **Vendedor**
- **Cliente**

Actualmente el desarrollo se encuentra enfocado en las funcionalidades del **Vendedor**.

## Funcionalidades implementadas

### Autenticación

- Login contra la API real.
- Manejo de sesión mediante JWT.
- Persistencia segura de sesión.
- Cierre de sesión.
- Navegación según el rol.

### Conectividad

- Detección del estado de red mediante NetInfo.
- Aviso global cuando el dispositivo se encuentra sin conexión.
- Manejo de errores de comunicación con la API.

### Vendedor

Actualmente se encuentra implementada la gestión inicial de clientes:

- Consulta de cartera de clientes.
- Listado de clientes.
- Detalle de cliente.
- Edición de datos personales.
- Edición de dirección de entrega.
- Opción para utilizar la misma dirección del cliente como dirección de entrega.
- Estados de carga mediante Skeleton.
- Estados de error y envío de formularios.

## Estructura general

```text
src/
├── app/
│   ├── (public)/
│   └── (private)/
├── components/
├── features/
├── network/
├── lib/
├── hooks/
├── constants/
└── types/
```

El proyecto utiliza una arquitectura organizada por funcionalidades (`features`) y navegación mediante Expo Router.

## Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_API_URL=http://IP_DEL_BACKEND:3000
```

En dispositivos físicos, la IP debe ser accesible desde la misma red local donde se encuentra ejecutándose el backend.

## Ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Iniciar Expo:

```bash
npx expo start
```

Comprobar TypeScript:

```bash
npx tsc --noEmit
```

## Estado del proyecto

Proyecto actualmente **en desarrollo**.

Las funcionalidades se están implementando de forma incremental y conectadas contra la API real de Aguafress.