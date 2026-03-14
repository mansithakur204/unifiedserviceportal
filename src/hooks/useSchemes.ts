import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SHEET_URL_KEY = 'google_sheet_url';

export function getGoogleSheetUrl(): string {
  return localStorage.getItem(SHEET_URL_KEY) || '';
}

export function setGoogleSheetUrl(url: string) {
  if (url) {
    localStorage.setItem(SHEET_URL_KEY, url);
  } else {
    localStorage.removeItem(SHEET_URL_KEY);
  }
}

interface UseSchemeOptions {
  category?: string;
  orderBy?: string;
}

export function useSchemes(options?: UseSchemeOptions) {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'database' | 'google-sheet'>('database');

  useEffect(() => {
    let cancelled = false;
    const fetchSchemes = async () => {
      setLoading(true);
      const sheetUrl = getGoogleSheetUrl();

      // Try Google Sheet first if configured
      if (sheetUrl) {
        try {
          const { data, error } = await supabase.functions.invoke('fetch-google-sheet', {
            body: { sheetUrl },
          });
          if (!error && data?.schemes?.length > 0) {
            let result = data.schemes;
            if (options?.category) {
              result = result.filter((s: any) => s.category === options.category);
            }
            if (!cancelled) {
              setSchemes(result);
              setSource('google-sheet');
              setLoading(false);
            }
            return;
          }
        } catch {
          // Fall through to Supabase
        }
      }

      // Fallback: Supabase
      let query = supabase.from('schemes').select('*');
      if (options?.category) {
        query = query.eq('category', options.category);
      }
      query = query.order(options?.orderBy || 'created_at', { ascending: false });

      const { data } = await query;
      if (!cancelled) {
        setSchemes(data ?? []);
        setSource('database');
        setLoading(false);
      }
    };

    fetchSchemes();
    return () => { cancelled = true; };
  }, [options?.category, options?.orderBy]);

  return { schemes, loading, source };
}