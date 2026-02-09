import { MilkType, DrinkSize } from '../lib/data';

/**
 * Order status types
 */
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

/**
 * Order item with full product details for display
 */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  milk?: MilkType;
  size?: DrinkSize;
  unitPrice: number;
  subtotal: number;
}

/**
 * Order extras
 */
export interface OrderExtras {
  collagen?: boolean;
  ashwagandha?: boolean;
  honey?: boolean;
}

/**
 * Complete order with all details
 */
export interface Order {
  id: string;
  orderNumber: string; // Format: "M001", "M002", etc.
  items: OrderItem[];
  extras: OrderExtras;
  extrasTotal: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  statusHistory: OrderStatusChange[];
}

/**
 * Order status change record for history tracking
 */
export interface OrderStatusChange {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

/**
 * Product with inventory management fields
 */
export interface InventoryProduct {
  id: string;
  nameKey: string;
  category: string;
  price: number;
  image: string;
  requiresMilk?: boolean;
  stock: number;
  isAvailable: boolean;
  lowStockThreshold: number;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  ordersToday: number;
  pendingOrders: number;
  revenueToday: number;
  lowStockProducts: number;
}

/**
 * Filter options for orders
 */
export interface OrderFilters {
  status?: OrderStatus | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}
