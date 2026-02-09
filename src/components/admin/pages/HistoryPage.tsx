import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Eye, X, Printer } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { useOrders } from '../../../hooks/useOrders';
import { Order } from '../../../types/admin';

/**
 * Order history page with table view and detail modal
 */
export function HistoryPage() {
  const { getCompletedOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'all'>('all');

  const completedOrders = getCompletedOrders();

  // Filter by date
  const getFilteredByDate = () => {
    const now = new Date();
    
    switch (dateFilter) {
      case 'today': {
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        return completedOrders.filter((o) => o.createdAt >= today);
      }
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        return completedOrders.filter(
          (o) => o.createdAt >= yesterday && o.createdAt <= endOfYesterday
        );
      }
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return completedOrders.filter((o) => o.createdAt >= weekAgo);
      }
      default:
        return completedOrders;
    }
  };

  // Filter by search query
  const filteredOrders = getFilteredByDate().filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-[Abril_Fatface] text-[#155020] mb-2">
            Historial de Pedidos
          </h1>
          <p className="text-[#155020]/60 font-sans-brand">
            Consulta todos los pedidos completados y cancelados
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Date Filters */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#155020]" />
              <span className="font-sans-brand font-semibold text-[#155020]">Período:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'today' as const, label: 'Hoy' },
                { value: 'yesterday' as const, label: 'Ayer' },
                { value: 'week' as const, label: 'Última Semana' },
                { value: 'all' as const, label: 'Todos' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setDateFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg font-sans-brand font-semibold transition-all ${
                    dateFilter === filter.value
                      ? 'bg-[#155020] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por número de pedido..."
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg font-sans-brand focus:outline-none focus:border-[#155020] transition-colors"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#155020] text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-sans-brand font-semibold">Número</th>
                  <th className="py-4 px-6 text-left font-sans-brand font-semibold">Fecha/Hora</th>
                  <th className="py-4 px-6 text-left font-sans-brand font-semibold">Items</th>
                  <th className="py-4 px-6 text-left font-sans-brand font-semibold">Total</th>
                  <th className="py-4 px-6 text-left font-sans-brand font-semibold">Estado</th>
                  <th className="py-4 px-6 text-center font-sans-brand font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-gray-500 font-sans-brand">
                        No se encontraron pedidos
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-[Abril_Fatface] text-xl text-[#155020]">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-sans-brand">
                          <p className="text-[#155020] font-semibold">{formatDate(order.createdAt)}</p>
                          <p className="text-sm text-gray-600">{formatTime(order.createdAt)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-sans-brand text-sm text-gray-700">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <p key={idx}>
                              {item.quantity}x {item.productName}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-gray-500">
                              +{order.items.length - 2} más...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-sans-brand font-bold text-lg text-[#155020]">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#155020] text-white rounded-lg font-sans-brand font-semibold hover:bg-[#155020]/90 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center">
          <p className="text-sm text-[#155020]/60 font-sans-brand">
            Mostrando {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
          </p>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="font-[Abril_Fatface] text-3xl text-[#155020]">
                    {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600 font-sans-brand mt-1">
                    {formatDate(selectedOrder.createdAt)} • {formatTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Status */}
                <div className="mb-6">
                  <StatusBadge status={selectedOrder.status} size="lg" />
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-serif text-lg text-[#155020] mb-3">Productos</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start border-b border-gray-100 pb-3">
                        <div className="flex-1">
                          <p className="font-sans-brand font-semibold text-[#155020]">
                            {item.quantity}x {item.productName}
                          </p>
                          {(item.milk || item.size) && (
                            <div className="flex gap-2 mt-1">
                              {item.milk && (
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                  {item.milk === 'oat' ? 'Avena' : item.milk === 'almond' ? 'Almendra' : 'Coco'}
                                </span>
                              )}
                              {item.size === 'large' && (
                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                  Grande
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="font-sans-brand font-medium text-[#155020]">
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                {(selectedOrder.extras.collagen || selectedOrder.extras.ashwagandha || selectedOrder.extras.honey) && (
                  <div className="mb-6 p-4 bg-[#C8D96F]/10 rounded-lg">
                    <h3 className="font-serif text-lg text-[#155020] mb-2">Extras</h3>
                    <div className="space-y-1">
                      {selectedOrder.extras.collagen && (
                        <p className="text-sm font-sans-brand text-gray-700">• Colágeno/Creatina (+$1.50)</p>
                      )}
                      {selectedOrder.extras.ashwagandha && (
                        <p className="text-sm font-sans-brand text-gray-700">• Ashwagandha (+$1.50)</p>
                      )}
                      {selectedOrder.extras.honey && (
                        <p className="text-sm font-sans-brand text-gray-700">• Miel/Sirope (+$1.00)</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t-2 border-[#155020]/20 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-sans-brand font-bold text-xl text-[#155020]">Total:</span>
                    <span className="font-sans-brand font-bold text-3xl text-[#155020]">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Status History */}
                <div>
                  <h3 className="font-serif text-lg text-[#155020] mb-3">Historial de Estados</h3>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((change, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#155020] rounded-full" />
                        <StatusBadge status={change.status} size="sm" />
                        <span className="text-gray-600 font-sans-brand">
                          {formatTime(change.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}