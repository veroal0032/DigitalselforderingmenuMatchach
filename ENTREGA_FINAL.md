# Entrega Final: Documentación del Producto

## 1. Resumen Ejecutivo

**Nombre del Proyecto:** MatchaChá – Digital Self-Ordering Menu  
**Problema que resuelve:** Las cafeterías pierden tiempo y generan fricciones cuando el personal toma pedidos manualmente; los clientes esperan más de lo necesario y la experiencia es inconsistente.  
**Usuario target:** Clientes de MatchaChá (18–35 años, estilo de vida saludable) que visitan el local y quieren pedir de forma autónoma desde un kiosko táctil, sin hacer fila ni interactuar con el personal.  
**Unidad mínima de valor:** Que un cliente complete un pedido desde el kiosko de forma autónoma: selecciona producto → personaliza leche/tamaño → confirma en checkout y recibe su número de orden.

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

## 4. Estrategia de Distribución

🔗 [Ver presentación completa](https://www.canva.com/design/DAHCFI6HRXg/oJb3X7qlYsN3SpC2Mowpww/view?utm_content=DAHCFI6HRXg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha91c99a607)

## 5. Conciencia Técnica (Hacks y Límites del Vibe Coding)

### 5.1 Hacks implementados

| Hack | Descripción | Riesgo que mitiga |
|------|-------------|-------------------|
| **Suscripciones en tiempo real a Supabase** | Los hooks `useProducts`, `useOrders` e `useInventory` tienen canales de Postgres que se actualizan automáticamente ante cualquier cambio en la base de datos, sin necesidad de recargar la página | Si el admin desactiva un producto o cambia precios, el kiosko lo refleja instantáneamente; si entra un pedido nuevo, el panel lo muestra sin intervención |
| **Eventos de analytics como documentación viva** | Cada acción clave del usuario dispara un evento nombrado en PostHog (`language_selected`, `checkout_started`, `cart_abandoned`, etc.), consumidos luego desde la API de PostHog para mostrar métricas AARRR en tiempo real en el dashboard del admin | Si el flujo cambia y los eventos dejan de dispararse, se detecta inmediatamente en el dashboard sin revisar el código |
| **Edge Function como backend seguro** | La integración con Resend y la consulta de métricas a PostHog corren como Supabase Edge Functions en Deno, sin servidor propio | Evita exponer API keys en el frontend y permite lógica de negocio serverless sin infraestructura adicional |

### 5.2 Riesgos detectados y decisiones postergadas

**Riesgos identificados:**
- **Sin procesamiento de pagos digital:** el sistema genera un número de orden pero el cobro depende del personal en caja. Si hay desconexión entre el kiosko y la caja, el pedido puede perderse sin trazabilidad. Plan de monitoreo: registrar en Supabase si el pedido fue marcado como cobrado por el admin.
- **Un solo administrador:** actualmente el sistema tiene un único usuario admin sin roles ni permisos diferenciados. Si el local crece o hay más personal, no hay forma de limitar accesos. Plan: implementar roles en Supabase Auth cuando haya más de un operador.

**Decisiones postergadas conscientemente:**
- **Procesamiento de pagos integrado:** se postergó porque el flujo de cobro en caja ya existe y funciona; agregar pagos digitales requiere integración con una pasarela y validación regulatoria que excede el alcance actual.
- **Sistema de roles y permisos:** se postergó hasta que haya más de un local o más de un empleado usando el panel, momento en que se revisará.

### 5.3 Supuestos asumidos

| Supuesto | Implicancia si es falso | Señal que nos hará revisarlo |
|----------|-------------------------|-------------------------------|
| Los clientes están dispuestos a interactuar con la pantalla sin asistencia | El kiosko se ignora y no genera valor; habría que rediseñar el onboarding | Tasa de activación menor al 20% sostenida por más de una semana |
| El personal puede gestionar el cobro en caja separado del pedido sin errores | Se generan confusiones entre número de orden y cobro, aumentando el tiempo de atención | Quejas recurrentes del personal sobre pedidos no encontrados en caja |

## 6. Anexo: Enlaces y Evidencias

- **URL del producto desplegado:** https://mask-ritzy-25054031.figma.site
- **Repositorio:** https://github.com/veroal0032/DigitalselforderingmenuMatchach
- **Credenciales de prueba:**
  - Email: admin@matchacha.com
  - Contraseña: Matcha2024!
- **Capturas de integraciones funcionando:**
  - Resend – email de resumen diario: ![Email Resend](https://raw.githubusercontent.com/veroal0032/DigitalselforderingmenuMatchach/main/captura-resend-email.png)
  - PostHog – métricas AARRR en el panel admin: ![Métricas AARRR](https://raw.githubusercontent.com/veroal0032/DigitalselforderingmenuMatchach/main/captura-metricas-aarrr.png)
- **Dashboard de métricas:** visible en el panel admin → sección "Métricas AARRR" (captura arriba)
- **Video de funcionamiento:** [Ver demo completa](https://drive.google.com/file/d/17il3782pbz0MjHvl8oCkTwWnhQQ_1cfc/view?usp=sharing)
