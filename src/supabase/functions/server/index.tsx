import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

app.get("/make-server-aaadc1d7/health", (c) => {
  return c.json({ status: "ok" });
});

// Endpoint: Resumen diario por email
app.post("/make-server-aaadc1d7/send-daily-summary", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return c.json({ error: "RESEND_API_KEY not configured" }, 500);
    }

    // Obtener órdenes del día
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .gte("created_at", today.toISOString())
      .neq("status", "cancelled");

    if (error) {
      return c.json({ error: "Error fetching orders" }, 500);
    }

    const totalOrders = orders?.length ?? 0;
    const totalRevenue = orders?.reduce((sum: number, o: any) => sum + parseFloat(o.total), 0) ?? 0;

    // Productos más vendidos
    const productCount: Record<string, { name: string; qty: number }> = {};
    orders?.forEach((order: any) => {
      order.order_items?.forEach((item: any) => {
        if (!productCount[item.product_name]) {
          productCount[item.product_name] = { name: item.product_name, qty: 0 };
        }
        productCount[item.product_name].qty += item.quantity;
      });
    });

    const topProducts = Object.values(productCount)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const dateStr = new Date().toLocaleDateString("es-ES", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    // HTML del email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F8F9F5; padding: 20px;">
        <div style="background: #155020; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: #C8D96F; margin: 0; font-size: 28px;">MATCHA CHÁ</h1>
          <p style="color: #ffffff; margin: 8px 0 0 0;">Resumen del Día</p>
        </div>

        <p style="color: #155020; font-size: 14px; text-align: center; text-transform: capitalize;">${dateStr}</p>

        <div style="display: flex; gap: 16px; margin: 20px 0;">
          <div style="flex: 1; background: #ffffff; border-radius: 12px; padding: 20px; text-align: center; border-left: 4px solid #155020;">
            <p style="margin: 0; color: #666; font-size: 13px;">Total Pedidos</p>
            <p style="margin: 8px 0 0 0; color: #155020; font-size: 32px; font-weight: bold;">${totalOrders}</p>
          </div>
          <div style="flex: 1; background: #ffffff; border-radius: 12px; padding: 20px; text-align: center; border-left: 4px solid #C8D96F;">
            <p style="margin: 0; color: #666; font-size: 13px;">Ingresos del Día</p>
            <p style="margin: 8px 0 0 0; color: #155020; font-size: 32px; font-weight: bold;">$${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        ${topProducts.length > 0 ? `
        <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <h3 style="color: #155020; margin: 0 0 16px 0;">🏆 Productos Más Vendidos</h3>
          ${topProducts.map((p, i) => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="color: #333;">${i + 1}. ${p.name}</span>
              <span style="color: #155020; font-weight: bold;">${p.qty} unidades</span>
            </div>
          `).join("")}
        </div>
        ` : ""}

        ${totalOrders === 0 ? `
        <div style="background: #fff3cd; border-radius: 12px; padding: 20px; text-align: center;">
          <p style="color: #856404; margin: 0;">No hubo pedidos hoy.</p>
        </div>
        ` : ""}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">Matcha Chá · Sistema de Gestión de Pedidos</p>
        </div>
      </div>
    `;

    // Enviar con Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Matcha Chá <onboarding@resend.dev>",
        to: ["veroal0032@gmail.com"],
        subject: `☕ Resumen del día - ${dateStr} · $${totalRevenue.toFixed(2)} · ${totalOrders} pedidos`,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const err = await resendResponse.text();
      return c.json({ error: "Resend error", detail: err }, 500);
    }

    return c.json({ success: true, totalOrders, totalRevenue });
  } catch (err) {
    return c.json({ error: "Unexpected error", detail: String(err) }, 500);
  }
});
// Endpoint: Métricas de PostHog
app.get("/make-server-aaadc1d7/posthog-metrics", async (c) => {
  try {
    const POSTHOG_API_KEY = Deno.env.get("POSTHOG_API_KEY");
    const POSTHOG_PROJECT_ID = "319238";

    if (!POSTHOG_API_KEY) {
      return c.json({ error: "POSTHOG_API_KEY not configured" }, 500);
    }

    const headers = {
      "Authorization": `Bearer ${POSTHOG_API_KEY}`,
      "Content-Type": "application/json",
    };

    // Query para contar eventos
    const queryEvents = async (eventName: string) => {
      const res = await fetch(
        `https://us.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/events/?event=${eventName}&limit=1000`,
        { headers }
      );
      const data = await res.json();
      return data.results?.length ?? 0;
    };

    const [pageviews, languageSelected, productAdded, checkoutStarted, cartAbandoned] =
      await Promise.all([
        queryEvents("$pageview"),
        queryEvents("language_selected"),
        queryEvents("product_added_to_cart"),
        queryEvents("checkout_started"),
        queryEvents("cart_abandoned"),
      ]);

    const activationRate = pageviews > 0
      ? ((languageSelected / pageviews) * 100).toFixed(1)
      : "0";

    const conversionRate = languageSelected > 0
      ? ((checkoutStarted / languageSelected) * 100).toFixed(1)
      : "0";

    return c.json({
      pageviews,
      languageSelected,
      productAdded,
      checkoutStarted,
      cartAbandoned,
      activationRate,
      conversionRate,
    });
  } catch (err) {
    return c.json({ error: "Unexpected error", detail: String(err) }, 500);
  }
});
Deno.serve(app.fetch);