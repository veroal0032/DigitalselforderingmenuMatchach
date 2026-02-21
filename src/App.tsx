import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import posthog from 'posthog-js';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainMenu } from './components/MainMenu';
import { CheckoutScreen } from './components/CheckoutScreen';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Language, MilkType, DrinkSize } from './lib/data';

posthog.init('phc_C3JrkzRzI999YqleC4kMZ30wNAF0CMgCPKGE5MLPD1i', {
  api_host: 'https://us.i.posthog.com',
  capture_pageview: true,
  autocapture: true,
});

export type AppScreen = 'welcome' | 'menu' | 'checkout';

export interface CartItem {
  productId: string;
  quantity: number;
  milk?: MilkType;
  size?: DrinkSize;
}

export interface OrderExtras {
  collagen: boolean;
  ashwagandha: boolean;
  honey: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [language, setLanguage] = useState<Language>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderExtras, setOrderExtras] = useState<OrderExtras>({
    collagen: false,
    ashwagandha: false,
    honey: false,
  });

  const handleSelectLanguage = (lang: Language) => {
    posthog.capture('language_selected', { language: lang });
    setLanguage(lang);
    setScreen('menu');
  };

  const handleAddToCart = (productId: string, milk?: MilkType, size?: DrinkSize) => {
    posthog.capture('product_added_to_cart', { product_id: productId, milk, size });
    setCart((prev) => {
      if (milk && size) {
        const existing = prev.find(
          (item) =>
            item.productId === productId &&
            item.milk === milk &&
            item.size === size
        );
        if (existing) {
          return prev.map((item) =>
            item.productId === productId &&
            item.milk === milk &&
            item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { productId, quantity: 1, milk, size }];
      }

      const existing = prev.find((item) => item.productId === productId && !item.milk);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && !item.milk
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number, milk?: MilkType, size?: DrinkSize) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          const matches = milk && size
            ? item.productId === productId && item.milk === milk && item.size === size
            : item.productId === productId && !item.milk;
          return matches
            ? { ...item, quantity: item.quantity + delta }
            : item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string, milk?: MilkType, size?: DrinkSize) => {
    posthog.capture('product_removed_from_cart', { product_id: productId });
    setCart((prev) =>
      prev.filter((item) => {
        if (milk && size) {
          return !(item.productId === productId && item.milk === milk && item.size === size);
        }
        return !(item.productId === productId && !item.milk);
      })
    );
  };

  const handleCheckout = () => {
    posthog.capture('checkout_started', { item_count: cart.length });
    setScreen('checkout');
  };

  const handleSetExtras = (extras: OrderExtras) => {
    posthog.capture('extras_selected', { ...extras });
    setOrderExtras(extras);
  };

  const handleBackToMenu = () => {
    posthog.capture('cart_abandoned');
    setCart([]);
    setOrderExtras({ collagen: false, ashwagandha: false, honey: false });
    setScreen('menu');
  };

  const handleResetToWelcome = () => {
    posthog.capture('kiosk_reset_to_welcome');
    setCart([]);
    setOrderExtras({ collagen: false, ashwagandha: false, honey: false });
    setScreen('welcome');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          screen === 'welcome' ? (
            <WelcomeScreen onSelectLanguage={handleSelectLanguage} />
          ) : screen === 'menu' ? (
            <MainMenu
              language={language}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onCheckout={handleCheckout}
              onBackToWelcome={handleResetToWelcome}
            />
          ) : screen === 'checkout' ? (
            <CheckoutScreen
              language={language}
              cart={cart}
              orderExtras={orderExtras}
              onSetExtras={handleSetExtras}
              onBackToMenu={handleBackToMenu}
            />
          ) : (
            <WelcomeScreen onSelectLanguage={handleSelectLanguage} />
          )
        } />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}