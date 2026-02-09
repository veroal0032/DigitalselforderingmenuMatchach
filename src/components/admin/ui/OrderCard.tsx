import { motion } from 'motion/react';
import { Clock, Package, AlertCircle, Check, X } from 'lucide-react';
import { Order, OrderStatus } from '../../../types/admin';
import { StatusBadge } from './StatusBadge';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onCancel: (orderId: string) => void;
  index?: number;
}

/**
 * Reusable order card component for displaying order details
 */
export function OrderCard({ order, onUpdateStatus, onCancel, index = 0 }: OrderCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const getNextStatus = (): OrderStatus | null => {
    switch (order.status) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (): string => {
    const next = getNextStatus();
    if (!next) return '';
    
    const labels: Record<OrderStatus, string> = {
      pending: '',
      preparing: 'Marcar En Preparación',
      ready: 'Marcar Listo',
      completed: 'Completar',
      cancelled: '',
    };
    
    return labels[next];
  };

  const handleNextStatus = () => {
    const nextStatus = getNextStatus();
    if (nextStatus) {
      onUpdateStatus(order.id, nextStatus);
    }
  };

  const handleCancel = () => {
    onCancel(order.id);
    setShowCancelDialog(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canAdvance = order.status !== 'completed' && order.status !== 'cancelled';
  const canCancel = order.status !== 'completed' && order.status !== 'cancelled';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-[Abril_Fatface] text-5xl text-[#155020] mb-2">
              {order.orderNumber}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-sans-brand">{formatTime(order.createdAt)}</span>
            </div>
          </div>
          <StatusBadge status={order.status} size="lg" />
        </div>

        {/* Order Items */}
        <div className="mb-4 space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start border-b border-gray-100 pb-2">
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
                    {item.size && item.size === 'large' && (
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

        {/* Extras */}
        {(order.extras.collagen || order.extras.ashwagandha || order.extras.honey) && (
          <div className="mb-4 p-3 bg-[#C8D96F]/10 rounded-lg">
            <p className="text-xs font-sans-brand font-semibold text-[#155020] mb-2 flex items-center gap-1">
              <Package className="w-4 h-4" />
              Extras:
            </p>
            <div className="flex flex-wrap gap-2">
              {order.extras.collagen && (
                <span className="text-xs bg-white px-2 py-1 rounded border border-[#155020]/20 font-sans-brand">
                  Colágeno/Creatina
                </span>
              )}
              {order.extras.ashwagandha && (
                <span className="text-xs bg-white px-2 py-1 rounded border border-[#155020]/20 font-sans-brand">
                  Ashwagandha
                </span>
              )}
              {order.extras.honey && (
                <span className="text-xs bg-white px-2 py-1 rounded border border-[#155020]/20 font-sans-brand">
                  Miel/Sirope
                </span>
              )}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="mb-4 pt-3 border-t-2 border-[#155020]/20">
          <div className="flex justify-between items-center">
            <span className="font-sans-brand font-bold text-lg text-[#155020]">Total:</span>
            <span className="font-sans-brand font-bold text-2xl text-[#155020]">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {canAdvance && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextStatus}
              className="flex-1 bg-[#155020] text-white py-3 px-4 rounded-lg font-sans-brand font-semibold hover:bg-[#155020]/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {getNextStatusLabel()}
            </motion.button>
          )}

          {canCancel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCancelDialog(true)}
              className="bg-red-600 text-white py-3 px-4 rounded-lg font-sans-brand font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancelar Pedido"
        message={`¿Estás seguro de que deseas cancelar el pedido ${order.orderNumber}?`}
        confirmText="Sí, Cancelar"
        cancelText="No, Mantener"
        type="danger"
      />
    </>
  );
}
