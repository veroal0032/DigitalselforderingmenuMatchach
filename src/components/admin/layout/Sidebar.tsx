import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, History, Package, X, BarChart2 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Pedidos Activos' },
  { to: '/admin/history', icon: History, label: 'Historial' },
  { to: '/admin/inventory', icon: Package, label: 'Inventario' },
  { to: '/admin/metrics', icon: BarChart2, label: 'Métricas AARRR' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: slide in/out */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Mobile sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 lg:hidden overflow-y-auto"
      >
        <SidebarContent onClose={onClose} showClose />
      </motion.aside>
    </>
  );
}

function SidebarContent({ onClose, showClose = false }: { onClose: () => void; showClose?: boolean }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-[Abril_Fatface] text-2xl text-[#155020] tracking-tight">
            MATCHA CHÁ
          </h2>
          <p className="text-xs text-[#155020]/60 font-sans-brand mt-1">Admin Panel</p>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-sans-brand text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#C8D96F]/20 text-[#155020] border-l-4 border-[#155020]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#155020]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-[#F8F9F5] rounded-lg p-4">
          <p className="text-xs text-[#155020]/60 font-sans-brand">Sistema de gestión de pedidos</p>
          <p className="text-xs text-[#155020]/40 font-sans-brand mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}