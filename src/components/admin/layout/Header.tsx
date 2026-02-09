import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

interface HeaderProps {
  onMenuClick: () => void;
}

// Page title mapping
const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders': 'Pedidos Activos',
  '/admin/history': 'Historial de Pedidos',
  '/admin/inventory': 'Gestión de Inventario',
};

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    loadAdminInfo();
  }, []);

  const loadAdminInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setAdminEmail(user.email);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('admin_session');
      navigate('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setLoading(false);
    }
  };

  const pageTitle = pageTitles[location.pathname] || 'Admin Panel';

  return (
    <header className="bg-[#155020] text-white shadow-lg sticky top-0 z-30 shrink-0">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Menu button + Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="min-w-0">
            <h1 className="font-[Abril_Fatface] text-xl sm:text-2xl md:text-3xl tracking-tight truncate">
              MATCHA CHÁ
            </h1>
            <p className="text-[#C8D96F] text-sm font-sans-brand hidden md:block truncate">
              {pageTitle}
            </p>
          </div>
        </div>

        {/* Right: User dropdown */}
        <div className="relative shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-sans-brand font-medium">{adminEmail || 'Admin'}</p>
              <p className="text-xs text-[#C8D96F]">Administrador</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <ChevronDown className="w-4 h-4" />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20"
                >
                  {/* User info (mobile) */}
                  <div className="md:hidden px-4 py-3 border-b border-gray-200 bg-[#F8F9F5]">
                    <p className="text-sm font-sans-brand font-medium text-[#155020]">
                      {adminEmail || 'Admin'}
                    </p>
                    <p className="text-xs text-[#155020]/60">Administrador</p>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-sans-brand font-medium">
                      {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                    </span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile page title */}
      <div className="md:hidden px-6 pb-3">
        <p className="text-[#C8D96F] text-sm font-sans-brand">{pageTitle}</p>
      </div>
    </header>
  );
}