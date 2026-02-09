import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        setLoading(false);
        return;
      }

      if (data.session) {
        // Store session in localStorage for persistence
        localStorage.setItem('admin_session', JSON.stringify(data.session));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-[Abril_Fatface] text-5xl font-bold text-[#155020] tracking-tight mb-2">
            MATCHA CHÁ
          </h1>
          <p className="font-sans-brand text-[#155020]/60 text-sm">Panel de Administración</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#155020] p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-serif text-[#155020] text-center mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-sans-brand font-medium text-[#155020] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#155020]/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#155020]/20 rounded-lg font-sans-brand focus:outline-none focus:border-[#155020] focus:ring-2 focus:ring-[#155020]/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-sans-brand font-medium text-[#155020] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#155020]/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-[#155020]/20 rounded-lg font-sans-brand focus:outline-none focus:border-[#155020] focus:ring-2 focus:ring-[#155020]/20 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-[#155020]/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-[#155020]/60" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#155020]/60" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-sans-brand">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-[#155020] text-white font-sans-brand font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </motion.button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-[#155020]/60 hover:text-[#155020] font-sans-brand transition-colors"
            >
              Volver al menú
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}