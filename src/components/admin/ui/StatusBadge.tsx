import { OrderStatus } from '../../../types/admin';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  preparing: {
    label: 'En Preparación',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  ready: {
    label: 'Listo',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  completed: {
    label: 'Completado',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

/**
 * Reusable badge component for displaying order status
 */
export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center font-sans-brand font-semibold rounded-full border ${config.className} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
}
