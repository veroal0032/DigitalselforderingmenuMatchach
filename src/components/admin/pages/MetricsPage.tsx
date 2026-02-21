import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, ShoppingCart, Target, AlertCircle } from 'lucide-react';

interface PostHogMetrics {
  pageviews: number;
  languageSelected: number;
  productAdded: number;
  checkoutStarted: number;
  cartAbandoned: number;
  activationRate: string;
  conversionRate: string;
}

export function MetricsPage() {
  const [metrics, setMetrics] = useState<PostHogMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://dargugyxfivuedbkifnc.supabase.co/functions/v1/make-server-aaadc1d7/posthog-metrics', {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcmd1Z3l4Zml2dWVkYmtpZm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjI3MDMsImV4cCI6MjA4NTg5ODcwM30.3J_6kKJY1B0cYSqY6jZeKKRd-W16H9xj0H5HX6Bxhbo`,
      }
    })
      .then(res => res.json())
      .then(data => { setMetrics(data); setLoading(false); })
      .catch(() => { setError('Error cargando métricas'); setLoading(false); });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-[Abril_Fatface] text-[#155020] mb-2">Métricas AARRR</h1>
        <p className="text-[#155020]/60 font-sans-brand">Datos en tiempo real desde PostHog</p>
      </motion.div>

      {loading && (
        <div className="text-center py-20 text-[#155020]/60 font-sans-brand">Cargando métricas...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-700 font-sans-brand">{error}</p>
        </div>
      )}

      {metrics && (
        <div className="space-y-6">
          {/* Adquisición */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
              <div>
                <h2 className="font-serif text-xl text-[#155020]">Adquisición</h2>
                <p className="text-xs text-gray-500 font-sans-brand">Usuarios que llegan al kiosko</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F8F9F5] rounded-xl p-4">
                <p className="text-sm text-gray-500 font-sans-brand">Sesiones totales</p>
                <p className="text-3xl font-bold text-[#155020]">{metrics.pageviews}</p>
              </div>
              <div className="bg-[#F8F9F5] rounded-xl p-4">
                <p className="text-sm text-gray-500 font-sans-brand">Seleccionaron idioma</p>
                <p className="text-3xl font-bold text-[#155020]">{metrics.languageSelected}</p>
              </div>
            </div>
          </motion.div>

          {/* Activación */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg"><Target className="w-5 h-5 text-green-600" /></div>
              <div>
                <h2 className="font-serif text-xl text-[#155020]">Activación</h2>
                <p className="text-xs text-gray-500 font-sans-brand">% de sesiones que seleccionan idioma y entran al menú</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F8F9F5] rounded-xl p-4">
                <p className="text-sm text-gray-500 font-sans-brand">Tasa de activación</p>
                <p className="text-3xl font-bold text-[#155020]">{metrics.activationRate}%</p>
              </div>
              <div className="bg-[#F8F9F5] rounded-xl p-4">
                <p className="text-sm text-gray-500 font-sans-brand">Productos agregados</p>
                <p className="text-3xl font-bold text-[#155020]">{metrics.productAdded}</p>
              </div>
            </div>
          </motion.div>

          {/* Retención y Referral */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-yellow-600" /></div>
              <div>
                <h2 className="font-serif text-xl text-[#155020]">Retención & Referral</h2>
                <p className="text-xs text-gray-500 font-sans-brand">No aplica en kiosko físico anónimo</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800 font-sans-brand">
                En un kiosko físico los usuarios son anónimos y no tienen cuenta. La retención se mide por frecuencia de visita al local, no por sesiones digitales. El referral ocurre de forma orgánica (boca a boca) y no es trackeable digitalmente en esta etapa.
              </p>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#C8D96F]/30 p-2 rounded-lg"><ShoppingCart className="w-5 h-5 text-[#155020]" /></div>
              <div>
                <h2 className="font-serif text-xl text-[#155020]">Revenue</h2>
                <p className="text-xs text-gray-500 font-sans-brand">Conversión de sesiones a pedidos completados</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F8F9F5] rounded-xl p-4">
                <p className="text-sm text-gray-500 font-sans-brand">Checkouts iniciados</p>
                <p className="text-3xl font-bold text-[#155020]">{metrics.checkoutStarted}</p>
              </div>
              <div className="bg-[#F8F9F5] rounded-xl p-4">
                <p className="text-sm text-gray-500 font-sans-brand">Carritos abandonados</p>
                <p className="text-3xl font-bold text-red-500">{metrics.cartAbandoned}</p>
              </div>
              <div className="bg-[#F8F9F5] rounded-xl p-4">
                <p className="text-sm text-gray-500 font-sans-brand">Tasa de conversión</p>
                <p className="text-3xl font-bold text-[#155020]">{metrics.conversionRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
