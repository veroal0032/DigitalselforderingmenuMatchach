import { motion } from 'motion/react';
import { Languages, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeScreenProps {
  onSelectLanguage: (lang: 'en' | 'es') => void;
}

export function WelcomeScreen({ onSelectLanguage }: WelcomeScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-[#F8F9F5] flex flex-col items-center justify-center p-8">
      {/* Discrete Admin Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        onClick={() => navigate('/admin/login')}
        className="absolute top-4 right-4 p-2 text-[#155020]/20 hover:text-[#155020]/40 transition-colors"
        title="Admin"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <h1 className="font-[Abril_Fatface] text-7xl md:text-8xl font-bold text-[#155020] tracking-tight mb-2">
          MATCHA CHÁ
        </h1>
        <p className="font-sans-brand text-xl md:text-2xl text-[#155020]/60 tracking-[0.3em] uppercase mb-4">
          Caracas
        </p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="h-1 bg-[#C8D96F] mx-auto"
        />
      </motion.div>

      {/* Language Selection */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-8 text-[#155020]/60">
          <p className="font-sans-brand text-base">
            Select your language / Selecciona tu idioma
          </p>
        </div>
        
        <div className="flex flex-col gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectLanguage('en')}
            className="w-64 py-5 bg-[#155020] text-white font-sans-brand rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <span className="text-lg font-semibold tracking-wide uppercase">English</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectLanguage('es')}
            className="w-64 py-5 bg-[#155020] text-white font-sans-brand rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <span className="text-lg font-semibold tracking-wide uppercase">Español</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Footer Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className="font-sans-brand text-[#155020]/60 text-sm">
          Touch to begin / Toca para comenzar
        </p>
      </motion.div>
    </div>
  );
}