import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import SchemeCard from '@/components/SchemeCard';
import { Bookmark, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function SavedSchemes() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('scheme_id')
        .eq('user_id', user.id);
      if (!bookmarks?.length) { setSchemes([]); setLoading(false); return; }
      const ids = bookmarks.map(b => b.scheme_id);
      const { data } = await supabase.from('schemes').select('*').in('id', ids);
      setSchemes(data ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <Bookmark className="w-12 h-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">{t('scheme.loginToSave')}</p>
        <Link to="/login"><Button>{t('nav.login')}</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold">{t('nav.savedSchemes')}</h1>
      </div>
      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      ) : schemes.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">{t('search.noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schemes.map(s => (
            <SchemeCard key={s.id} id={s.id} scheme={s} />
          ))}
        </div>
      )}
    </div>
  );
}
