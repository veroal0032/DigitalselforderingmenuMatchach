import { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, AlertTriangle, Plus, Minus } from 'lucide-react';
import { InventoryProduct } from '../../../types/admin';
import { translations } from '../../../lib/data';

interface ProductRowProps {
  product: InventoryProduct;
  onUpdateStock: (productId: string, newStock: number) => void;
  onToggleAvailability: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
}

/**
 * Reusable product row component for inventory management
 */
export function ProductRow({
  product,
  onUpdateStock,
  onToggleAvailability,
  onUpdatePrice,
}: ProductRowProps) {
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stockInput, setStockInput] = useState(product.stock.toString());

  const productName = translations.en.products[product.nameKey as keyof typeof translations.en.products]?.name || product.nameKey;
  const isLowStock = product.stock < product.lowStockThreshold;

  const handleStockSave = () => {
    const newStock = parseInt(stockInput, 10);
    if (!isNaN(newStock) && newStock >= 0) {
      onUpdateStock(product.id, newStock);
    }
    setIsEditingStock(false);
  };

  const handleStockIncrement = (delta: number) => {
    const newStock = product.stock + delta;
    if (newStock >= 0) {
      onUpdateStock(product.id, newStock);
    }
  };

  const categoryLabels: Record<string, string> = {
    matcha: 'Matcha',
    protein: 'Proteína',
    coffee: 'Café y Té',
    snacks: 'Para Picar',
    sweets: 'Dulces',
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {/* Image */}
      <td className="py-4 px-4">
        <img
          src={product.image}
          alt={productName}
          className="w-20 h-20 object-cover rounded-lg shadow-sm"
        />
      </td>

      {/* Name */}
      <td className="py-4 px-4">
        <p className="font-sans-brand font-semibold text-[#155020]">{productName}</p>
        {product.requiresMilk && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
            Requiere leche
          </span>
        )}
      </td>

      {/* Category */}
      <td className="py-4 px-4">
        <span className="text-sm font-sans-brand text-gray-700">
          {categoryLabels[product.category] || product.category}
        </span>
      </td>

      {/* Price */}
      <td className="py-4 px-4">
        <p className="font-sans-brand font-bold text-[#155020]">${product.price.toFixed(2)}</p>
      </td>

      {/* Stock */}
      <td className="py-4 px-4">
        {isEditingStock ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              onBlur={handleStockSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStockSave();
                if (e.key === 'Escape') {
                  setStockInput(product.stock.toString());
                  setIsEditingStock(false);
                }
              }}
              autoFocus
              className="w-20 px-2 py-1 border-2 border-[#155020] rounded font-sans-brand text-center"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStockIncrement(-1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            
            <button
              onClick={() => setIsEditingStock(true)}
              className="min-w-[60px] px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-sans-brand font-semibold text-[#155020] transition-colors"
            >
              {product.stock}
            </button>

            <button
              onClick={() => handleStockIncrement(1)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>

            {isLowStock && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-sans-brand font-semibold">Bajo</span>
              </div>
            )}
          </div>
        )}
      </td>

      {/* Availability */}
      <td className="py-4 px-4">
        <button
          onClick={() => onToggleAvailability(product.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            product.isAvailable ? 'bg-[#155020]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              product.isAvailable ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </td>
    </motion.tr>
  );
}
