import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSchemes } from '@/hooks/useSchemes';
import CategoryCards from '@/components/CategoryCard';
import SchemeCard from '@/components/SchemeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VoiceSearch from '@/components/VoiceSearch';
import { Search, Loader2 } from 'lucide-react';

const PAGE_SIZE = 12;

export default function Home() {
  const { t } = useLanguage();
  const { schemes, loading } = useSchemes();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = schemes.filter(s =>
    s.scheme_name.toLowerCase().includes(search.toLowerCase()) ||
    s.details?.toLowerCase().includes(search.toLowerCase()) ||
    s.scheme_name_hi?.toLowerCase().includes(search.toLowerCase()) ||
    s.details_hi?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <CategoryCards />

      <div>
        <h2 className="text-2xl font-bold mb-4">{t('nav.schemes')}</h2>
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              value={search}
              onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="pl-10 text-base"
            />
          </div>
          <VoiceSearch onResult={setSearch} />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-8">{t('common.loading')}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('search.noResults')}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.slice(0, visibleCount).map(s => (
                <SchemeCard key={s.id} id={s.id} scheme={s} />
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
    </div>
  );
}