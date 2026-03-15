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

      // Always fetch DB schemes
      let query = supabase.from('schemes').select('*');
      if (options?.category) {
        query = query.eq('category', options.category);
      }
      query = query.order(options?.orderBy || 'created_at', { ascending: false });
      const { data: dbSchemes } = await query;
      const dbList = dbSchemes ?? [];

      const sheetUrl = getGoogleSheetUrl();
      if (sheetUrl) {
        try {
          const { data, error } = await supabase.functions.invoke('fetch-google-sheet', {
            body: { sheetUrl },
          });
          if (!error && data?.schemes?.length > 0) {
            let sheetSchemes: any[] = data.schemes;
            if (options?.category) {
              sheetSchemes = sheetSchemes.filter((s: any) => s.category === options.category);
            }

            // Build lookup sets from DB for deduplication
            const existingNames = new Set(
              dbList.map((s: any) => (s.scheme_name || '').trim().toLowerCase()).filter(Boolean)
            );
            const existingLinks = new Set(
              dbList.map((s: any) => (s.application_link || '').trim().toLowerCase()).filter(Boolean)
            );

            // Filter out sheet schemes that already exist in DB
            const newFromSheet = sheetSchemes.filter((s: any) => {
              const name = (s.scheme_name || '').trim().toLowerCase();
              const link = (s.application_link || '').trim().toLowerCase();
              if (name && existingNames.has(name)) return false;
              if (link && existingLinks.has(link)) return false;
              return true;
            });

            // Also deduplicate within sheet data itself
            const seenNames = new Set<string>();
            const seenLinks = new Set<string>();
            const uniqueSheet = newFromSheet.filter((s: any) => {
              const name = (s.scheme_name || '').trim().toLowerCase();
              const link = (s.application_link || '').trim().toLowerCase();
              if (name && seenNames.has(name)) return false;
              if (link && seenLinks.has(link)) return false;
              if (name) seenNames.add(name);
              if (link) seenLinks.add(link);
              return true;
            });

            if (!cancelled) {
              setSchemes([...dbList, ...uniqueSheet]);
              setSource(uniqueSheet.length > 0 ? 'google-sheet' : 'database');
              setLoading(false);
            }
            return;
          }
        } catch {
          // Fall through to DB-only
        }
      }

      if (!cancelled) {
        setSchemes(dbList);
        setSource('database');
        setLoading(false);
      }
    };

    fetchSchemes();
    return () => { cancelled = true; };
  }, [options?.category, options?.orderBy]);

  return { schemes, loading, source };
}