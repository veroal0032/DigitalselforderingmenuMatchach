import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, History, Package, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Pedidos Activos' },
  { to: '/admin/history', icon: History, label: 'Historial' },
  { to: '/admin/inventory', icon: Package, label: 'Inventario' },
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

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 lg:translate-x-0 lg:static overflow-y-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-[Abril_Fatface] text-2xl text-[#155020] tracking-tight">
              MATCHA CHÁ
            </h2>
            <p className="text-xs text-[#155020]/60 font-sans-brand mt-1">Admin Panel</p>
          </div>
          
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
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
                  <item.icon
                    className={`w-5 h-5 ${isActive ? 'text-[#155020]' : 'text-gray-500'}`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="bg-[#F8F9F5] rounded-lg p-4">
            <p className="text-xs text-[#155020]/60 font-sans-brand">
              Sistema de gestión de pedidos
            </p>
            <p className="text-xs text-[#155020]/40 font-sans-brand mt-1">
              v1.0.0
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}