import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Language, translations } from '../lib/data';
import { CartItem, OrderExtras } from '../App';
import { ExtrasModal } from './ExtrasModal';
import { supabase } from '../lib/supabaseClient';
import { useProducts } from '../hooks/useProducts';
import { useAppSettings } from '../hooks/useAppSettings';

interface CheckoutScreenProps {
  language: Language;
  cart: CartItem[];
  orderExtras: OrderExtras;
  onSetExtras: (extras: OrderExtras) => void;
  onBackToMenu: () => void;
}

interface OrderResponse {
  order_id: string;
  order_number: string;
  kiosk_token: string;
  subtotal: number;
  extras_total: number;
  total: number;
  status: string;
  created_at: string;
}

export function CheckoutScreen({
  language,
  cart,
  orderExtras,
  onSetExtras,
  onBackToMenu,
}: CheckoutScreenProps) {
  const [showExtrasModal, setShowExtrasModal] = useState(true);
  const [extrasConfirmed, setExtrasConfirmed] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];
  const { products } = useProducts();
  const { settings } = useAppSettings();

  // ---- helpers to avoid crashes (undefined/null/strings) ----
  const num = (v: any, fallback = 0) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const money = (v: any) => num(v, 0).toFixed(2);

  const handleExtrasConfirm = (selectedExtras: string[]) => {
    onSetExtras({
      collagen: selectedExtras.includes('collagen'),
      ashwagandha: selectedExtras.includes('ashwagandha'),
      honey: selectedExtras.includes('honey'),
    });
    setExtrasConfirmed(true);
    setShowExtrasModal(false);
  };

  // Create order after extras are confirmed
  useEffect(() => {
    if (extrasConfirmed && !orderCreated && !isCreatingOrder) {
      createOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extrasConfirmed, orderCreated]);

  const createOrder = async () => {
    setIsCreatingOrder(true);
    setError(null);

    try {
      // Build payload for RPC
      const items = (cart ?? []).map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        milk: item.milk || null,
        size: item.size || 'regular',
      }));

      const payload = {
        items,
        extra_collagen: !!orderExtras?.collagen,
        extra_ashwagandha: !!orderExtras?.ashwagandha,
        extra_honey: !!orderExtras?.honey,
      };

      console.log('Creating order with payload:', payload);

      // Call RPC function
      const { data, error: rpcError } = await supabase.rpc('create_order_with_items', { payload });

      if (rpcError) {
        console.error('Error creating order:', rpcError);
        setError(
          language === 'en'
            ? 'Error creating order. Please try again.'
            : 'Error al crear el pedido. Por favor, intenta nuevamente.'
        );
        return;
      }

      console.log('Order created successfully:', data);

      // Store kiosk token in localStorage for tracking
      if (data?.kiosk_token) {
        localStorage.setItem('kiosk_token', data.kiosk_token);
      }

      setOrderData(data as OrderResponse);
      setOrderCreated(true);
    } catch (err) {
      console.error('Unexpected error creating order:', err);
      setError(
        language === 'en'
          ? 'Unexpected error. Please try again.'
          : 'Error inesperado. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Calculate totals for display (before order is created)
  const cartWithProducts = (cart ?? []).map((item) => {
    const product = (products ?? []).find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;

    const base = num(item.product.price);
    const largeExtra = num(settings?.large_size_extra);
    const itemPrice = item.size === 'large' ? base + largeExtra : base;

    return sum + itemPrice * num(item.quantity, 1);
  }, 0);

  const extrasTotal =
    (orderExtras?.collagen ? num(settings?.extra_collagen_price) : 0) +
    (orderExtras?.ashwagandha ? num(settings?.extra_ashwagandha_price) : 0) +
    (orderExtras?.honey ? num(settings?.extra_honey_price) : 0);

  const total = subtotal + extrasTotal;

  // Loading state while creating order
  if (isCreatingOrder) {
    return (
      <div className="min-h-screen bg-[#F8F9F5] flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#155020] animate-spin mx-auto mb-4" />
          <p className="text-[#155020] font-sans-brand text-xl">
            {language === 'en' ? 'Creating your order...' : 'Creando tu pedido...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9F5] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-[#155020] mb-4">
            {language === 'en' ? 'Oops!' : '¡Ups!'}
          </h2>
          <p className="text-gray-600 font-sans-brand mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setExtrasConfirmed(false);
              setShowExtrasModal(true);
            }}
            className="w-full bg-[#155020] text-white py-4 rounded-2xl font-sans-brand font-bold hover:bg-[#155020]/90 transition-colors"
          >
            {language === 'en' ? 'Try Again' : 'Intentar de Nuevo'}
          </button>
        </motion.div>
      </div>
    );
  }

  // Success state - show order confirmation
  if (orderCreated && orderData) {
    return (
      <div className="min-h-screen bg-[#F8F9F5] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="flex justify-center mb-8"
          >
            <div className="bg-[#C8D96F] rounded-full p-6">
              <CheckCircle className="w-20 h-20 text-[#155020]" />
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif-brand text-4xl md:text-5xl text-[#155020] text-center mb-4"
          >
            {t.checkout.thankYou}
          </motion.h1>

          {/* Order Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <p className="font-sans-brand text-gray-600 mb-2">{t.checkout.orderNumber}</p>
            <div className="inline-block bg-[#155020] text-white px-8 py-4 rounded-2xl">
              <span className="font-serif-brand text-5xl font-bold">{orderData.order_number}</span>
            </div>
          </motion.div>

          {/* Payment Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#C8D96F] rounded-2xl p-6 mb-8"
          >
            <p className="font-sans-brand font-bold text-[#155020] text-center text-xl md:text-2xl">
              {t.checkout.paymentMessage}
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="font-sans-brand font-bold text-[#155020] text-xl mb-4">
              {t.checkout.orderSummary}
            </h3>

            <div className="bg-[#F8F9F5] rounded-2xl p-6 space-y-4">
              {cartWithProducts.map((item) => {
                if (!item.product) return null;

                const productInfo =
                  t.products[item.product.name_key as keyof typeof t.products];

                const base = num(item.product.price);
                const largeExtra = num(settings?.large_size_extra);
                const itemPrice = item.size === 'large' ? base + largeExtra : base;

                const itemTotal = itemPrice * num(item.quantity, 1);
                const cartKey = `${item.productId}-${item.milk || 'none'}-${item.size || 'none'}`;

                return (
                  <div key={cartKey} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-sans-brand font-semibold text-[#155020]">
                        {productInfo?.name || item.product.name_key}
                      </p>
                      {item.milk && (
                        <p className="font-sans-brand text-xs text-[#155020]/60">
                          {t.milkSelection[item.milk]} • {item.size || 'regular'}
                        </p>
                      )}
                      <p className="font-sans-brand text-sm text-gray-600">
                        ${money(itemPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-sans-brand font-bold text-[#155020]">${money(itemTotal)}</p>
                  </div>
                );
              })}

              {/* Extras */}
              {num(orderData.extras_total) > 0 && (
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-sans-brand font-semibold text-[#155020] mb-2">
                    {language === 'en' ? 'Extras' : 'Extras'}
                  </p>

                  {orderExtras?.collagen && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-sans-brand text-gray-600">{t.extras.collagen}</span>
                      <span className="font-sans-brand text-gray-600">
                        +${money(settings?.extra_collagen_price)}
                      </span>
                    </div>
                  )}

                  {orderExtras?.ashwagandha && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-sans-brand text-gray-600">{t.extras.ashwagandha}</span>
                      <span className="font-sans-brand text-gray-600">
                        +${money(settings?.extra_ashwagandha_price)}
                      </span>
                    </div>
                  )}

                  {orderExtras?.honey && (
                    <div className="flex justify-between text-sm">
                      <span className="font-sans-brand text-gray-600">{t.extras.honey}</span>
                      <span className="font-sans-brand text-gray-600">
                        +${money(settings?.extra_honey_price)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
                <span className="font-sans-brand font-bold text-xl text-[#155020]">
                  {t.cart.total}
                </span>
                <span className="font-serif-brand text-3xl font-bold text-[#155020]">
                  ${money(orderData?.total)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Back to Menu Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToMenu}
            className="w-full bg-[#155020] hover:bg-[#0d3a16] text-white py-5 rounded-2xl font-sans-brand font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t.checkout.backToMenu}</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Show extras modal (initial state)
  return (
    <div className="min-h-screen bg-[#F8F9F5]">
      <ExtrasModal
        isOpen={showExtrasModal}
        onClose={() => {
          setExtrasConfirmed(true);
          setShowExtrasModal(false);
        }}
        onConfirm={handleExtrasConfirm}
        language={language}
      />
    </div>
  );
}
