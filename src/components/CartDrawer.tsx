import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Language, translations, MilkType, DrinkSize } from '../lib/data';
import type { Product } from '../hooks/useProducts';
import { CartItem } from '../App';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  cart: CartItem[];
  products: Product[];
  settings?: any;
  onUpdateQuantity: (productId: string, delta: number, milk?: MilkType, size?: DrinkSize) => void;
  onRemoveFromCart: (productId: string, milk?: MilkType, size?: DrinkSize) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  language,
  cart,
  products = [],
  settings,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
}: CartDrawerProps) {
  const safeProducts = Array.isArray(products) ? products : [];
  const t = translations[language];

const cartWithProducts = cart
  .map((item) => {
    const product = safeProducts.find((p) => p.id === item.productId);
    return { ...item, product };
  })
  .filter((item) => !!item.product);

const total = cart.reduce((sum, item) => {
  const product = safeProducts.find((p) => p.id === item.productId);
  if (!product) return sum;

  let itemPrice = product.price ?? 0;
  if (item.size === 'large') {
    itemPrice += (settings?.large_size_extra ?? 1);
  }
  return sum + itemPrice * item.quantity;
}, 0);

const isEmpty = cartWithProducts.length === 0;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#155020] text-white p-6 flex items-center justify-between">
              <h2 className="font-serif-brand text-3xl">{t.cart.title}</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-7 h-7" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEmpty ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
                  <h3 className="font-sans-brand text-xl text-gray-600 mb-2">
                    {t.cart.empty}
                  </h3>
                  <p className="font-sans-brand text-gray-500">
                    {t.cart.emptyDescription}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {cartWithProducts.map((item, index) => {
                    const productInfo =
  t.products[item.product!.name_key as keyof typeof t.products];

const itemPrice =
  (item.product!.price ?? 0) +
  (item.size === 'large' ? (settings?.large_size_extra ?? 1) : 0);
                    const cartKey = `${item.productId}-${item.milk || 'none'}-${item.size || 'none'}`;
                    
                    return (
                      <motion.div
                        key={cartKey}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="bg-[#F8F9F5] rounded-2xl p-4 flex gap-4"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
  src={item.product!.image_url}
  alt={productInfo?.name ?? item.product!.name_key}
  className="w-full h-full object-cover"
/>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans-brand font-semibold text-[#155020] mb-1 truncate">
                            {productInfo?.name ?? item.product!.name_key}
                          </h4>
                          {item.milk && (
                            <p className="font-sans-brand text-xs text-[#155020]/60 mb-1">
                              {t.milkSelection[item.milk]}{item.size ? ` • ${item.size}` : ''}
                            </p>
                          )}
                          <p className="font-sans-brand text-sm text-gray-600 mb-3">
                            ${itemPrice.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onUpdateQuantity(item.productId, -1, item.milk, item.size)}
                              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Minus className="w-4 h-4 text-[#155020]" />
                            </motion.button>

                            <span className="font-sans-brand font-bold text-lg text-[#155020] w-8 text-center">
                              {item.quantity}
                            </span>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onUpdateQuantity(item.productId, 1, item.milk, item.size)}
                              className="w-8 h-8 bg-[#C8D96F] rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Plus className="w-4 h-4 text-[#155020]" />
                            </motion.button>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemoveFromCart(item.productId, item.milk, item.size)}
                              className="ml-auto p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Summary & Checkout */}
            {!isEmpty && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className="border-t border-gray-200 p-6 bg-white"
              >
                {/* Total */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sans-brand text-xl text-gray-600">
                    {t.cart.total}
                  </span>
                  <span className="font-[Abril_Fatface] text-3xl text-[#155020] font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full bg-[#155020] hover:bg-[#0d3a16] text-white py-5 rounded-2xl font-sans-brand font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t.cart.finishOrder}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}