import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useWorksheetData<T>(worksheetKey: string, defaultData: T, overrideUserId?: string) {
  const { user } = useAuth();
  const effectiveUserId = overrideUserId || user?.id;
  const isAdminView = !!overrideUserId;
  const [data, setData] = useState<T>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false);

  // Load data from DB on mount
  useEffect(() => {
    if (!effectiveUserId) {
      // Fall back to localStorage for non-authenticated users
      const saved = localStorage.getItem(`cfa-${worksheetKey}`);
      if (saved) {
        try { setData(JSON.parse(saved)); } catch {}
      }
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const { data: row, error } = await supabase
          .from('worksheet_data')
          .select('data')
          .eq('user_id', effectiveUserId)
          .eq('worksheet_key', worksheetKey)
          .maybeSingle();

        if (error) throw error;

        if (row?.data) {
          setData(row.data as unknown as T);
        } else if (!isAdminView) {
          // Migrate from localStorage if exists (only for own data)
          const saved = localStorage.getItem(`cfa-${worksheetKey}`);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setData(parsed);
              await supabase.from('worksheet_data').upsert({
                user_id: effectiveUserId,
                worksheet_key: worksheetKey,
                data: parsed as any,
              }, { onConflict: 'user_id,worksheet_key' });
              localStorage.removeItem(`cfa-${worksheetKey}`);
            } catch {}
          }
        }
      } catch (err) {
        console.error('Error loading worksheet data:', err);
      } finally {
        hasLoadedRef.current = true;
        setIsLoading(false);
      }
    };

    load();
  }, [effectiveUserId, worksheetKey, isAdminView]);

  // Debounced save to DB
  const saveToDb = useCallback((newData: T) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (!effectiveUserId) {
        localStorage.setItem(`cfa-${worksheetKey}`, JSON.stringify(newData));
        return;
      }

      try {
        const { error } = await supabase.from('worksheet_data').upsert({
          user_id: effectiveUserId,
          worksheet_key: worksheetKey,
          data: newData as any,
        }, { onConflict: 'user_id,worksheet_key' });

        if (error) throw error;
      } catch (err) {
        console.error('Error saving worksheet:', err);
        toast.error('Failed to save worksheet progress');
      }
    }, 1000);
  }, [effectiveUserId, worksheetKey]);

  const updateData = useCallback((updater: T | ((prev: T) => T)) => {
    setData(prev => {
      const newData = typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater;
      saveToDb(newData);
      return newData;
    });
  }, [saveToDb]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return { data, updateData, isLoading };
}
