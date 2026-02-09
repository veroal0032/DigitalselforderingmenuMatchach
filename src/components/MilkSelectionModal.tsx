import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Language, MilkType, DrinkSize, translations } from '../lib/data';
import { useState } from 'react';

interface MilkSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (milk: MilkType, size: DrinkSize) => void;
  language: Language;
  productName: string;
}

export function MilkSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  language,
  productName,
}: MilkSelectionModalProps) {
  const [selectedMilk, setSelectedMilk] = useState<MilkType>('oat');
  const [selectedSize, setSelectedSize] = useState<DrinkSize>('regular');
  const t = translations[language];

  const handleConfirm = () => {
    onConfirm(selectedMilk, selectedSize);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-md z-50"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#155020]/60 hover:text-[#155020] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Product Name */}
            <h2 className="font-[Abril_Fatface] text-3xl text-[#155020] mb-2">
              {productName}
            </h2>

            {/* Milk Selection */}
            <div className="mb-6">
              <h3 className="font-sans-brand font-semibold text-lg text-[#155020] mb-4">
                {t.milkSelection.title}
              </h3>
              <div className="space-y-3">
                {(['oat', 'almond', 'coconut'] as MilkType[]).map((milk) => (
                  <motion.button
                    key={milk}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMilk(milk)}
                    className={`w-full py-4 px-6 rounded-xl font-sans-brand font-medium text-lg transition-all ${
                      selectedMilk === milk
                        ? 'bg-[#155020] text-white shadow-lg'
                        : 'bg-[#F8F9F5] text-[#155020] hover:bg-[#155020]/10'
                    }`}
                  >
                    {t.milkSelection[milk]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="font-sans-brand font-semibold text-lg text-[#155020] mb-4">
                {t.milkSelection.sizeTitle}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSize('regular')}
                  className={`py-4 px-6 rounded-xl font-sans-brand font-medium text-lg transition-all ${
                    selectedSize === 'regular'
                      ? 'bg-[#155020] text-white shadow-lg'
                      : 'bg-[#F8F9F5] text-[#155020] hover:bg-[#155020]/10'
                  }`}
                >
                  {t.milkSelection.regular}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSize('large')}
                  className={`py-4 px-6 rounded-xl font-sans-brand font-medium text-lg transition-all relative ${
                    selectedSize === 'large'
                      ? 'bg-[#155020] text-white shadow-lg'
                      : 'bg-[#F8F9F5] text-[#155020] hover:bg-[#155020]/10'
                  }`}
                >
                  <span>{t.milkSelection.large}</span>
                  <span className={`block text-sm ${
                    selectedSize === 'large' ? 'text-[#C8D96F]' : 'text-[#155020]/60'
                  }`}>
                    {t.milkSelection.largeExtra}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Confirm Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full bg-[#C8D96F] text-[#155020] py-5 rounded-xl font-sans-brand font-bold text-xl shadow-lg hover:shadow-xl transition-all"
            >
              {t.milkSelection.confirm}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
