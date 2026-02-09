import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Language, translations, MilkType, DrinkSize } from '../lib/data';
import { useState } from 'react';
import { MilkSelectionModal } from './MilkSelectionModal';
import { Product } from '../hooks/useProducts';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (productId: string, milk?: MilkType, size?: DrinkSize) => void;
  index: number;
}

export function ProductCard({ product, language, onAddToCart, index }: ProductCardProps) {
  const [showMilkModal, setShowMilkModal] = useState(false);
  const t = translations[language];
  // name_key from database, e.g., 'matchaLatte'
  const productInfo = t.products[product.name_key as keyof typeof t.products];

  const handleAddClick = () => {
    if (product.requires_milk) {
      setShowMilkModal(true);
    } else {
      onAddToCart(product.id);
    }
  };

  const handleMilkConfirm = (milk: MilkType, size: DrinkSize) => {
    onAddToCart(product.id, milk, size);
  };

  // If product info not found in translations, show generic info
  const displayName = productInfo?.name || product.name_key;
  const displayDescription = productInfo?.description || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Product Image */}
      <motion.div
        whileTap={{ scale: 1.15 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className="relative aspect-[4/3] overflow-hidden bg-gray-100"
      >
        <img
          src={product.image_url}
          alt={displayName}
          className="w-full h-full object-cover"
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-[#C8D96F] text-[#155020] px-4 py-2 rounded-full shadow-lg">
          <span className="font-sans-brand font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </motion.div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-[Abril_Fatface] text-2xl text-[#155020] mb-2">
          {displayName}
        </h3>
        <p className="font-sans-brand text-gray-600 text-sm mb-6 leading-relaxed">
          {displayDescription}
        </p>

        {/* Add Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          className="w-full bg-[#C8D96F] hover:bg-[#b5c55e] text-[#155020] py-4 rounded-2xl font-sans-brand font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-colors duration-200"
        >
          <Plus className="w-6 h-6" />
          <span>{t.cart.addItem}</span>
        </motion.button>
      </div>

      {/* Milk Selection Modal */}
      <MilkSelectionModal
        isOpen={showMilkModal}
        onClose={() => setShowMilkModal(false)}
        onConfirm={handleMilkConfirm}
        language={language}
        productName={displayName}
      />
    </motion.div>
  );
}