import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import SchemeCard from '@/components/SchemeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VoiceSearch from '@/components/VoiceSearch';
import { Search, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { t, td } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.from('schemes').select('*').eq('category', category!).order('created_at', { ascending: false });
      setSchemes(data ?? []);
      setLoading(false);
      setVisibleCount(PAGE_SIZE);
    };
    fetchData();
  }, [category]);

  const states = Array.from(new Set(schemes.map(s => s.state).filter(Boolean)));

  const filtered = schemes.filter(s => {
    const matchSearch = s.scheme_name.toLowerCase().includes(search.toLowerCase()) || s.details?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    const matchState = stateFilter === 'all' || s.state === stateFilter;
    return matchSearch && matchType && matchState;
  });

  const categoryTitle = td(category) || category;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{categoryTitle}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t('search.placeholder')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <VoiceSearch onResult={setSearch} />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.filter')}</SelectItem>
            <SelectItem value="Central">{t('scheme.central')}</SelectItem>
            <SelectItem value="State">{t('scheme.state')}</SelectItem>
          </SelectContent>
        </Select>
        {states.length > 1 && (
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder={t('scheme.state')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.allStates')}</SelectItem>
              {states.map(s => <SelectItem key={s} value={s}>{td(s)}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">{t('common.loading')}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">{t('search.noResults')}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, visibleCount).map(s => (
              <SchemeCard key={s.id} id={s.id} schemeName={s.scheme_name} details={s.details} type={s.type} category={s.category} fundingAmount={s.funding_amount} applicationLink={s.application_link} />
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => setVisibleCount(c => c + PAGE_SIZE)} className="gap-2">
                <Loader2 className="w-4 h-4" /> {t('search.loadMore')} ({filtered.length - visibleCount} {t('search.remaining')})
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
