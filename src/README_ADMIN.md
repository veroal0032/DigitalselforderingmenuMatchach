# Panel de Administración - MATCHA CHÁ

## 📋 Descripción General

Panel de administración completo para gestionar pedidos e inventario del sistema de menú digital de MATCHA CHÁ. Implementado con React, TypeScript, Tailwind CSS y Motion (Framer Motion).

## 🗂️ Estructura de Carpetas

```
/components/admin/
├── layout/
│   ├── DashboardLayout.tsx    # Layout principal con sidebar y header
│   ├── Sidebar.tsx             # Navegación lateral
│   └── Header.tsx              # Header con usuario y logout
├── pages/
│   ├── OverviewPage.tsx        # Dashboard principal con métricas
│   ├── OrdersPage.tsx          # Gestión de pedidos activos
│   ├── HistoryPage.tsx         # Historial de pedidos
│   └── InventoryPage.tsx       # Gestión de inventario
├── ui/
│   ├── StatCard.tsx            # Tarjeta de estadísticas
│   ├── OrderCard.tsx           # Tarjeta de pedido
│   ├── StatusBadge.tsx         # Badge de estado de pedido
│   ├── ProductRow.tsx          # Fila de producto en tabla
│   └── ConfirmDialog.tsx       # Modal de confirmación
├── AdminLogin.tsx              # Pantalla de login
├── AdminDashboard.tsx          # Componente principal con rutas
└── ProtectedRoute.tsx          # HOC para protección de rutas

/hooks/
├── useOrders.ts                # Hook para gestión de pedidos
└── useInventory.ts             # Hook para gestión de inventario

/types/
└── admin.ts                    # Interfaces y tipos TypeScript
```

## 🚀 Funcionalidades Principales

### 1. Dashboard / Resumen (`/admin/dashboard`)
- **Métricas clave:**
  - Pedidos de hoy
  - Pedidos pendientes
  - Ingresos del día
  - Productos con stock bajo
- **Últimos pedidos:** Visualización rápida de los 5 pedidos más recientes
- **Alertas:** Notificaciones de stock bajo

### 2. Pedidos Activos (`/admin/orders`)
- **Grid de tarjetas:** Visualización de todos los pedidos activos
- **Filtros por estado:**
  - Todos
  - Pendientes
  - En Preparación
  - Listos
- **Gestión de estados:**
  - Pendiente → Preparando → Listo → Completado
  - Opción de cancelar pedido con confirmación
- **Auto-refresh:** Actualización cada 10 segundos (simulado)
- **Información detallada:**
  - Número de orden grande y destacado
  - Lista de productos con modificadores (leche, tamaño)
  - Extras seleccionados
  - Total del pedido

### 3. Historial de Pedidos (`/admin/history`)
- **Tabla responsive:** Vista de todos los pedidos completados/cancelados
- **Filtros de fecha:**
  - Hoy
  - Ayer
  - Última semana
  - Todos
- **Búsqueda:** Por número de orden
- **Modal de detalle:**
  - Información completa del pedido
  - Historial de cambios de estado
  - Opción de impresión

### 4. Inventario (`/admin/inventory`)
- **Tabla de productos:** Todos los 20 productos del menú
- **Gestión de stock:**
  - Edición inline con botones +/-
  - Click en número para editar directamente
  - Alertas visuales para stock bajo (< 5 unidades)
- **Control de disponibilidad:** Switch para activar/desactivar productos
- **Filtros por categoría:**
  - Todos
  - Matcha
  - Proteína
  - Café y Té
  - Para Picar
- **Búsqueda:** Por nombre de producto

## 🎨 Diseño y Estilos

### Paleta de Colores
- **Verde primario:** `#155020` (headers, botones principales)
- **Lima acento:** `#C8D96F` (elementos destacados)
- **Fondo:** `#F8F9F5` (background general)
- **Blanco:** Tarjetas y componentes

### Tipografía
- **Títulos:** Abril Fatface (números de orden, títulos principales)
- **Texto:** DM Sans (UI, descripciones, datos)

### Animaciones
- **Page transitions:** Fade + slide con Motion
- **Card hover:** Scale + shadow
- **Stagger animations:** Para listas de pedidos
- **Spring transitions:** Para elementos interactivos

## 🔐 Autenticación

### Flujo de Login
1. Usuario accede a `/admin/login`
2. Ingresa email y contraseña
3. Supabase valida credenciales
4. Si es exitoso, redirige a `/admin/dashboard`
5. Sesión se guarda en localStorage

### Protección de Rutas
- Todas las rutas `/admin/*` (excepto `/admin/login`) están protegidas
- `ProtectedRoute` verifica sesión activa
- Si no hay sesión válida, redirige a login
- Si hay sesión, permite acceso y muestra contenido

### Crear Usuario Administrador
```
1. Ir a Supabase Dashboard
2. Authentication > Users
3. Create New User
4. Email: admin@matchacha.com
5. Password: [contraseña segura]
6. Auto Confirm User: ✓
```

## 📊 Datos Mockeados

### useOrders
- **8 pedidos de ejemplo** con productos reales del menú
- Estados variados (pending, preparing, ready, completed)
- Timestamps realistas (últimas 4 horas)
- Extras y modificadores
- Historial de cambios de estado

### useInventory
- **20 productos** del menú con stock simulado
- Stock aleatorio entre 1-50 unidades
- Algunos productos con stock bajo intencionalmente
- Todos disponibles por defecto
- Umbral de stock bajo: 5 unidades

## 🛠️ Componentes Reutilizables

### StatCard
```tsx
<StatCard
  icon={ShoppingBag}
  label="Pedidos de Hoy"
  value={24}
  iconColor="#155020"
  iconBgColor="#155020"
/>
```

### StatusBadge
```tsx
<StatusBadge 
  status="pending" 
  size="md" 
/>
```

### OrderCard
```tsx
<OrderCard
  order={order}
  onUpdateStatus={handleUpdate}
  onCancel={handleCancel}
/>
```

### ConfirmDialog
```tsx
<ConfirmDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  onConfirm={handleConfirm}
  title="Cancelar Pedido"
  message="¿Estás seguro?"
  type="danger"
/>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px
  - Sidebar colapsado (hamburger menu)
  - Tablas se convierten en cards
  - 1 columna para pedidos
  
- **Tablet:** 768px - 1024px
  - Sidebar visible
  - 1 columna de pedidos
  - Tablas scrollables
  
- **Desktop:** > 1024px
  - Sidebar fijo visible
  - 2 columnas de pedidos
  - Tablas completas

## 🔄 Estado y Flujo de Datos

### Hooks Personalizados

#### useOrders
```typescript
const {
  orders,                    // Lista completa de pedidos
  loading,                   // Estado de carga
  updateOrderStatus,         // Actualizar estado de pedido
  cancelOrder,               // Cancelar pedido
  getOrdersByStatus,         // Filtrar por estado
  getTodayOrders,            // Pedidos del día
  getCompletedOrders         // Pedidos completados
} = useOrders();
```

#### useInventory
```typescript
const {
  inventory,                 // Lista de productos
  loading,                   // Estado de carga
  updateStock,               // Actualizar stock
  toggleAvailability,        // Cambiar disponibilidad
  updatePrice,               // Actualizar precio
  getLowStockProducts,       // Productos con stock bajo
  getProductsByCategory,     // Filtrar por categoría
  searchProducts             // Buscar productos
} = useInventory();
```

## 🎯 Próximas Mejoras

1. **Integración real con Supabase:**
   - Persistir pedidos en base de datos
   - Sincronización en tiempo real
   - Gestión de inventario persistente

2. **Notificaciones:**
   - Alertas de nuevos pedidos
   - Notificaciones de stock bajo
   - Confirmaciones de acciones

3. **Reportes:**
   - Exportar historial a PDF/CSV
   - Gráficos de ventas
   - Análisis de productos más vendidos

4. **Multi-usuario:**
   - Roles y permisos
   - Log de actividad
   - Múltiples administradores

## 💡 Notas Técnicas

- **TypeScript estricto:** Todos los componentes están tipados
- **Performance:** Uso de React.memo donde es necesario
- **Accesibilidad:** Navegación por teclado y ARIA labels
- **SEO:** No aplicable (panel privado)
- **Testing:** Preparado para Jest/React Testing Library

## 📞 Soporte

Para problemas o preguntas sobre el panel de administración, contactar al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2025  
**Desarrollado para:** MATCHA CHÁ - Caracas
