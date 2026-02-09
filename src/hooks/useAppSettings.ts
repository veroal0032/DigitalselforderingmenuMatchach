import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface AppSettings {
  sweets_coming_soon: boolean;
  // Add more settings as needed
}

/**
 * Hook for fetching app settings from Supabase
 */
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    sweets_coming_soon: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();

    // Set up real-time subscription for settings updates
    const channel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings',
        },
        () => {
          loadSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('app_settings')
        .select('*')
        .limit(1)
        .single();

      if (fetchError) {
        // If settings don't exist, use defaults
        if (fetchError.code === 'PGRST116') {
          console.log('No app settings found, using defaults');
          setSettings({
            sweets_coming_soon: true,
          });
          return;
        }
        
        console.error('Error loading app settings:', fetchError);
        setError('Error al cargar configuración');
        return;
      }

      if (data) {
        setSettings({
          sweets_coming_soon: data.sweets_coming_soon ?? true,
        });
      }
    } catch (err) {
      console.error('Unexpected error loading settings:', err);
      setError('Error inesperado al cargar configuración');
      // Use defaults on error
      setSettings({
        sweets_coming_soon: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    refreshSettings: loadSettings,
  };
}
