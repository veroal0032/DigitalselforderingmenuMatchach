import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Reusable stat card component for dashboard metrics
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = '#155020',
  iconBgColor = '#155020',
  trend,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${iconBgColor}10` }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>

        {trend && (
          <div
            className={`text-xs font-sans-brand font-semibold px-2 py-1 rounded-full ${
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-[#155020]/60 font-sans-brand mb-1">{label}</p>
        <p className="text-3xl font-bold text-[#155020]">{value}</p>
      </div>
    </motion.div>
  );
}
