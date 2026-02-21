# Entrega Final: Documentación del Producto

## 1. Resumen Ejecutivo

**Nombre del Proyecto:** MatchaChá – Digital Self-Ordering Menu  
**Problema que resuelve:** Las cafeterías pierden tiempo y generan fricciones cuando el personal toma pedidos manualmente; los clientes esperan más de lo necesario y la experiencia es inconsistente.  
**Usuario target:** Clientes de MatchaChá (18–35 años, estilo de vida saludable) que visitan el local y quieren pedir de forma autónoma desde un kiosko táctil, sin hacer fila ni interactuar con el personal.  
**Unidad mínima de valor:** Que un cliente complete un pedido desde el kiosko de forma autónoma: selecciona producto → personaliza leche/tamaño → confirma en checkout y recibe su número de orden.
---

## 2. Integración de Servicios

### Servicio 1: Analytics – PostHog

**Servicio elegido:** PostHog  
**Acción de usuario asociada:** Toda interacción del cliente en el kiosko: tocar la pantalla, seleccionar idioma, agregar productos, iniciar checkout y abandonar el carrito.  
**Implementación:**
- PostHog se inicializa en `App.tsx` con autocapture activado. Se disparan eventos custom en cada acción clave: `language_selected`, `product_added_to_cart`, `checkout_started`, `cart_abandoned`, `kiosk_reset_to_welcome`.
- Habilita un embudo de conversión completo visible en el panel de administración, con métricas AARRR en tiempo real.
- Permite identificar en qué paso del flujo se abandona más y qué productos tienen mayor interés, sin infraestructura propia.

---

### Servicio 2: Email – Resend

**Servicio elegido:** Resend  
**Acción de usuario asociada:** El administrador del local presiona el botón "Enviar Resumen del Día" desde el dashboard de administración.  
**Implementación:**
- Al presionar el botón, se genera y envía automáticamente un email al dueño/administrador del local con el resumen operativo del día: total de pedidos, ingresos del día y productos más vendidos.
- Habilita un cierre de operaciones diario sin necesidad de que el admin esté mirando el dashboard todo el tiempo.
- Beneficio: el dueño recibe un reporte accionable en su casilla cada fin de jornada, con información suficiente para tomar decisiones de inventario y operación.

---

## 3. Métricas y Aprendizaje (Modelo AARRR)

### 3.1 Definición de la unidad mínima de valor

Que un cliente complete un pedido desde el kiosko de forma autónoma: selecciona producto, personaliza leche/tamaño, confirma en checkout y recibe su número de orden. Esto representa que el sistema le ahorró al negocio la intervención del personal y al cliente el tiempo de espera en caja.

### 3.2 KPIs por etapa del embudo AARRR

| Etapa | KPI | Definición | Por qué es relevante |
|-------|-----|------------|----------------------|
| **Adquisición** | Sesiones totales en el kiosko | Cantidad de veces que alguien toca la pantalla (sesiones totales) | Indica cuántos clientes reales interactúan con el sistema vs. lo ignoran |
| **Activación** | Tasa de activación (22.2%) | % de sesiones que seleccionan idioma y entran al menú | Mide si el kiosko logra captar la intención de compra |
| **Retención** | No aplica en esta etapa | El kiosko es físico y anónimo; los usuarios no tienen cuenta | La retención se mide por frecuencia de visita al local, no por sesiones digitales |
| **Referral** | No aplica en esta etapa | El referral ocurre de forma orgánica (boca a boca) y no es trackeable digitalmente | Se revisará si se implementa un programa de fidelización |
| **Ingresos** | Tasa de conversión a pedido completado (50%) | Checkouts iniciados que llegan a pedido confirmado / total sesiones | Permite evaluar si el flujo de pago genera fricciones |

### 3.3 Métricas priorizadas y postergadas

**Métricas que observamos activamente:**
- **Tasa de activación:** es la señal más directa de si el flujo UX funciona y el cliente llega al menú.
- **Tasa de conversión a checkout:** indica si hay fricciones entre agregar productos y confirmar el pedido.

**Métricas que decidimos no priorizar todavía:**
- **Retención digital:** no es medible en un kiosko físico con usuarios anónimos; no tiene sentido en esta etapa.
- **Referral:** ocurre de forma orgánica en el local; no hay mecanismo digital para trackearlo aún.

**Justificación general:** Al ser un kiosko físico en etapa temprana, priorizamos métricas de conversión dentro de la sesión (¿el cliente llega al menú? ¿completa el pedido?). Las métricas de retención y referral requieren identidad del usuario, lo cual no aplica al modelo actual.
