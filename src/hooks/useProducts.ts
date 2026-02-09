import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Product {
  id: string;
  name_key: string;
  category: string;
  price: number;
  image_url: string;
  requires_milk: boolean;
  stock: number;
  is_available: boolean;
}

/**
 * Hook for fetching products for the customer-facing menu
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();

    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('products_changes_customer')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Only fetch available products for customers
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('category')
        .order('name_key');

      if (fetchError) {
        console.error('Error loading products:', fetchError);
        setError('Error al cargar productos. Por favor, intente de nuevo.');
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('Unexpected error loading products:', err);
      setError('Error inesperado al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refreshProducts: loadProducts,
  };
}
