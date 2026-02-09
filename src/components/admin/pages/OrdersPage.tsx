import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, RefreshCw } from 'lucide-react';
import { OrderCard } from '../ui/OrderCard';
import { useOrders } from '../../../hooks/useOrders';
import { OrderStatus } from '../../../types/admin';

/**
 * Active orders page with filtering and real-time updates
 */
export function OrdersPage() {
  const { getOrdersByStatus, updateOrderStatus, cancelOrder, loading, error, refreshOrders } = useOrders();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshOrders]);

  const filteredOrders = getOrdersByStatus(activeFilter);

  const filters: Array<{ value: OrderStatus | 'all'; label: string; count: number }> = [
    { value: 'all', label: 'Todos', count: getOrdersByStatus('all').length },
    { value: 'pending', label: 'Pendientes', count: getOrdersByStatus('pending').length },
    { value: 'preparing', label: 'En Preparación', count: getOrdersByStatus('preparing').length },
    { value: 'ready', label: 'Listos', count: getOrdersByStatus('ready').length },
  ];

  const handleRefresh = () => {
    refreshOrders();
    setLastRefresh(new Date());
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-[Abril_Fatface] text-[#155020] mb-2">
              Pedidos Activos
            </h1>
            <p className="text-[#155020]/60 font-sans-brand">
              Gestiona y actualiza el estado de los pedidos en tiempo real
            </p>
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-[#155020] text-white px-4 py-3 rounded-lg font-sans-brand font-semibold hover:bg-[#155020]/90 transition-colors shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="hidden md:inline">Actualizar</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-[#155020]" />
          <span className="font-sans-brand font-semibold text-[#155020]">Filtros:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <motion.button
              key={filter.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-lg font-sans-brand font-semibold transition-all ${
                activeFilter === filter.value
                  ? 'bg-[#155020] text-white shadow-lg'
                  : 'bg-white text-[#155020] border-2 border-[#155020]/20 hover:border-[#155020]/40'
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.value
                    ? 'bg-white/20'
                    : 'bg-[#C8D96F]/20'
                }`}
              >
                {filter.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <div className="max-w-md mx-auto">
            <div className="bg-[#C8D96F]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-[#155020]" />
            </div>
            <h3 className="text-2xl font-serif text-[#155020] mb-3">
              No hay pedidos {activeFilter !== 'all' && 'en este estado'}
            </h3>
            <p className="text-[#155020]/60 font-sans-brand">
              {activeFilter === 'all'
                ? 'Todos los pedidos activos aparecerán aquí'
                : 'Prueba con otro filtro para ver más pedidos'}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
              onCancel={cancelOrder}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Last Refresh Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-[#155020]/40 font-sans-brand">
          Última actualización: {lastRefresh.toLocaleTimeString('es-ES')}
        </p>
      </div>
    </div>
  );
}