import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { Language, extras, translations } from '../lib/data';
import { useState } from 'react';

interface ExtrasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedExtras: string[]) => void;
  language: Language;
}

export function ExtrasModal({
  isOpen,
  onClose,
  onConfirm,
  language,
}: ExtrasModalProps) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const t = translations[language];

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const selectAll = () => {
    setSelectedExtras(extras.map((e) => e.id));
  };

  const selectNone = () => {
    setSelectedExtras([]);
  };

  const handleConfirm = () => {
    onConfirm(selectedExtras);
  };

  const totalExtrasPrice = selectedExtras.reduce((sum, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    return sum + (extra?.price || 0);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-lg z-50"
          >
            {/* Title */}
            <h2 className="font-[Abril_Fatface] text-3xl text-[#155020] mb-6 text-center">
              {t.extras.title}
            </h2>

            {/* Extras Selection */}
            <div className="space-y-3 mb-6">
              {extras.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);
                return (
                  <motion.button
                    key={extra.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleExtra(extra.id)}
                    className={`w-full py-5 px-6 rounded-xl font-sans-brand font-medium text-lg transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#155020] text-white shadow-lg'
                        : 'bg-[#F8F9F5] text-[#155020] hover:bg-[#155020]/10'
                    }`}
                  >
                    <span>{t.extras[extra.nameKey]}</span>
                    <div className="flex items-center gap-3">
                      <span className={isSelected ? 'text-[#C8D96F]' : 'text-[#155020]/60'}>
                        +${extra.price.toFixed(2)}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-[#C8D96F] rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-[#155020]" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Selection Buttons */}
            <div className="flex gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={selectAll}
                className="flex-1 py-3 px-4 rounded-xl bg-[#155020]/10 text-[#155020] font-sans-brand font-medium hover:bg-[#155020]/20 transition-colors"
              >
                {t.extras.selectAll}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={selectNone}
                className="flex-1 py-3 px-4 rounded-xl bg-[#155020]/10 text-[#155020] font-sans-brand font-medium hover:bg-[#155020]/20 transition-colors"
              >
                {t.extras.selectNone}
              </motion.button>
            </div>

            {/* Total */}
            {selectedExtras.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#C8D96F]/20 rounded-xl p-4 mb-6"
              >
                <div className="flex justify-between items-center">
                  <span className="font-sans-brand text-lg text-[#155020]">
                    {language === 'en' ? 'Extras Total' : 'Total Extras'}
                  </span>
                  <span className="font-sans-brand font-bold text-xl text-[#155020]">
                    +${totalExtrasPrice.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Confirm Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full bg-[#C8D96F] text-[#155020] py-5 rounded-xl font-sans-brand font-bold text-xl shadow-lg hover:shadow-xl transition-all"
            >
              {t.extras.finishOrder}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
