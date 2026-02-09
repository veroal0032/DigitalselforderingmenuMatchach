import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/admin';
import { supabase } from '../lib/supabaseClient';

/**
 * Hook for managing orders with real Supabase data
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();

    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders with their items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items (*)
        `
        )
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error loading orders:', ordersError);
        setError('Error al cargar pedidos');
        return;
      }

      // Transform data to match Order type
      const transformedOrders: Order[] = (ordersData || []).map((order) => {
        // Get status history
        return {
          id: order.id,
          orderNumber: order.order_number,
          items: order.order_items.map((item: any) => ({
            productId: item.product_id,
            productName: item.product_name,
            quantity: item.quantity,
            milk: item.milk,
            size: item.size,
            unitPrice: parseFloat(item.unit_price),
            subtotal: parseFloat(item.subtotal),
          })),
          extras: {
            collagen: order.extra_collagen,
            ashwagandha: order.extra_ashwagandha,
            honey: order.extra_honey,
          },
          extrasTotal: parseFloat(order.extras_total),
          subtotal: parseFloat(order.subtotal),
          total: parseFloat(order.total),
          status: order.status as OrderStatus,
          createdAt: new Date(order.created_at),
          updatedAt: new Date(order.updated_at),
          completedAt: order.completed_at ? new Date(order.completed_at) : undefined,
          cancelledAt: order.cancelled_at ? new Date(order.cancelled_at) : undefined,
          statusHistory: [], // Will be populated separately if needed
        };
      });

      setOrders(transformedOrders);
    } catch (err) {
      console.error('Unexpected error loading orders:', err);
      setError('Error inesperado al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order status:', updateError);
        throw new Error('Error al actualizar estado del pedido');
      }

      // Optimistically update local state
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;

          const now = new Date();
          return {
            ...order,
            status: newStatus,
            updatedAt: now,
            ...(newStatus === 'completed' && { completedAt: now }),
            ...(newStatus === 'cancelled' && { cancelledAt: now }),
          };
        })
      );

      // Reload orders to ensure consistency
      await loadOrders();
    } catch (err) {
      console.error('Error in updateOrderStatus:', err);
      throw err;
    }
  };

  const cancelOrder = (orderId: string) => {
    return updateOrderStatus(orderId, 'cancelled');
  };

  const getOrdersByStatus = (status: OrderStatus | 'all') => {
    if (status === 'all') {
      return orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
    }
    return orders.filter((o) => o.status === status);
  };

  const getTodayOrders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter((o) => o.createdAt >= today);
  };

  const getCompletedOrders = () => {
    return orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    cancelOrder,
    getOrdersByStatus,
    getTodayOrders,
    getCompletedOrders,
    refreshOrders: loadOrders,
  };
}
