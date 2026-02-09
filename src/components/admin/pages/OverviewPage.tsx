import { motion } from 'motion/react';
import { ShoppingBag, Clock, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../ui/StatCard';
import { StatusBadge } from '../ui/StatusBadge';
import { useOrders } from '../../../hooks/useOrders';
import { useInventory } from '../../../hooks/useInventory';

/**
 * Dashboard overview page with key metrics and recent activity
 */
export function OverviewPage() {
  const navigate = useNavigate();
  const { orders, getTodayOrders, getOrdersByStatus } = useOrders();
  const { getLowStockProducts } = useInventory();

  const todayOrders = getTodayOrders();
  const pendingOrders = getOrdersByStatus('pending');
  const lowStockProducts = getLowStockProducts();

  // Calculate today's revenue
  const revenueToday = todayOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  // Get last 5 recent orders
  const recentOrders = [...orders]
    .filter((o) => o.status !== 'completed' && o.status !== 'cancelled')
    .slice(0, 5);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-[Abril_Fatface] text-[#155020] mb-2">
          Dashboard
        </h1>
        <p className="text-[#155020]/60 font-sans-brand">
          Resumen de operaciones y métricas clave
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Pedidos de Hoy"
          value={todayOrders.length}
          iconColor="#155020"
          iconBgColor="#155020"
        />
        <StatCard
          icon={Clock}
          label="Pedidos Pendientes"
          value={pendingOrders.length}
          iconColor="#C8D96F"
          iconBgColor="#C8D96F"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos del Día"
          value={`$${revenueToday.toFixed(2)}`}
          iconColor="#155020"
          iconBgColor="#155020"
        />
        <StatCard
          icon={AlertTriangle}
          label="Stock Bajo"
          value={lowStockProducts.length}
          iconColor="#EF4444"
          iconBgColor="#EF4444"
        />
      </div>

      {/* Recent Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-[#155020]">Pedidos Recientes</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-[#155020] hover:text-[#155020]/80 font-sans-brand font-semibold transition-colors"
          >
            Ver todos
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-sans-brand">No hay pedidos activos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-[#F8F9F5] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/orders')}
              >
                {/* Order Info */}
                <div className="flex items-center gap-4">
                  <div className="bg-[#155020] text-white w-16 h-16 rounded-lg flex items-center justify-center">
                    <span className="font-[Abril_Fatface] text-xl">
                      {order.orderNumber.replace('M', '')}
                    </span>
                  </div>
                  
                  <div>
                    <p className="font-sans-brand font-semibold text-[#155020] mb-1">
                      {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-sans-brand">{formatTime(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Price */}
                <div className="flex items-center gap-4">
                  <p className="font-sans-brand font-bold text-xl text-[#155020]">
                    ${order.total.toFixed(2)}
                  </p>
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg text-red-900 mb-1">
                Productos con Stock Bajo
              </h3>
              <p className="text-sm text-red-700 font-sans-brand mb-3">
                {lowStockProducts.length} {lowStockProducts.length === 1 ? 'producto tiene' : 'productos tienen'} stock por debajo del umbral
              </p>
              <button
                onClick={() => navigate('/admin/inventory')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-sans-brand font-semibold transition-colors"
              >
                Ver Inventario
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}