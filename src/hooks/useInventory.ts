import { useState, useEffect } from 'react';
import { InventoryProduct } from '../types/admin';
import { supabase } from '../lib/supabaseClient';
import { translations } from '../lib/data';

/**
 * Hook for managing inventory with real Supabase data
 */
export function useInventory() {
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();

    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          loadInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('category')
        .order('name_key');

      if (fetchError) {
        console.error('Error loading inventory:', fetchError);
        setError('Error al cargar inventario');
        return;
      }

      // Transform data to match InventoryProduct type
      const transformedProducts: InventoryProduct[] = (data || []).map((product) => ({
        id: product.id,
        nameKey: product.name_key as keyof typeof translations.en.products,
        category: product.category,
        price: parseFloat(product.price),
        image: product.image_url,
        requiresMilk: product.requires_milk,
        stock: product.stock,
        isAvailable: product.is_available,
        lowStockThreshold: product.low_stock_threshold,
      }));

      setInventory(transformedProducts);
    } catch (err) {
      console.error('Unexpected error loading inventory:', err);
      setError('Error inesperado al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: Math.max(0, newStock) })
        .eq('id', productId);

      if (updateError) {
        console.error('Error updating stock:', updateError);
        throw new Error('Error al actualizar stock');
      }

      // Optimistically update local state
      setInventory((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, stock: Math.max(0, newStock) } : item
        )
      );

      // Reload inventory to ensure consistency
      await loadInventory();
    } catch (err) {
      console.error('Error in updateStock:', err);
      throw err;
    }
  };

  const toggleAvailability = async (productId: string) => {
    try {
      // Get current availability
      const product = inventory.find((item) => item.id === productId);
      if (!product) return;

      const { error: updateError } = await supabase
        .from('products')
        .update({ is_available: !product.isAvailable })
        .eq('id', productId);

      if (updateError) {
        console.error('Error toggling availability:', updateError);
        throw new Error('Error al cambiar disponibilidad');
      }

      // Optimistically update local state
      setInventory((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, isAvailable: !item.isAvailable } : item
        )
      );

      // Reload inventory to ensure consistency
      await loadInventory();
    } catch (err) {
      console.error('Error in toggleAvailability:', err);
      throw err;
    }
  };

  const updatePrice = async (productId: string, newPrice: number) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ price: Math.max(0, newPrice) })
        .eq('id', productId);

      if (updateError) {
        console.error('Error updating price:', updateError);
        throw new Error('Error al actualizar precio');
      }

      // Optimistically update local state
      setInventory((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, price: Math.max(0, newPrice) } : item
        )
      );

      // Reload inventory to ensure consistency
      await loadInventory();
    } catch (err) {
      console.error('Error in updatePrice:', err);
      throw err;
    }
  };

  const getLowStockProducts = () => {
    return inventory.filter((item) => item.stock < item.lowStockThreshold);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all') return inventory;
    return inventory.filter((item) => item.category === category);
  };

  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return inventory.filter((item) => {
      const productName =
        translations.en.products[item.nameKey as keyof typeof translations.en.products]?.name || '';
      return productName.toLowerCase().includes(lowerQuery);
    });
  };

  return {
    inventory,
    loading,
    error,
    updateStock,
    toggleAvailability,
    updatePrice,
    getLowStockProducts,
    getProductsByCategory,
    searchProducts,
    refreshInventory: loadInventory,
  };
}
