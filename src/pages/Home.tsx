import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSchemes } from '@/hooks/useSchemes';
import CategoryCards from '@/components/CategoryCard';
import SchemeCard from '@/components/SchemeCard';
import SchemeCardSkeleton from '@/components/SchemeCardSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VoiceSearch from '@/components/VoiceSearch';
import { Search, Loader2, Filter } from 'lucide-react';

const PAGE_SIZE = 12;

export default function Home() {
  const { t, td } = useLanguage();
  const { schemes, loading } = useSchemes();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return schemes.filter(s => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        s.scheme_name?.toLowerCase().includes(q) ||
        s.details?.toLowerCase().includes(q) ||
        s.scheme_name_hi?.toLowerCase().includes(q) ||
        s.details_hi?.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchesType = typeFilter === 'all' || s.type === typeFilter;
      const matchesGender = genderFilter === 'all' ||
        (genderFilter === 'female' && s.category === 'Women') ||
        genderFilter !== 'female';

      return matchesSearch && matchesCategory && matchesType && matchesGender;
    });
  }, [schemes, search, categoryFilter, typeFilter, genderFilter]);

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setGenderFilter('all');
    setVisibleCount(PAGE_SIZE);
  };

  const hasActiveFilters = search || categoryFilter !== 'all' || typeFilter !== 'all' || genderFilter !== 'all';

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <CategoryCards />

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('nav.schemes')}</h2>

        {/* Search & Filters */}
        <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('smartSearch.placeholder')}
                value={search}
                onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                className="pl-10 text-base h-11 rounded-lg"
              />
            </div>
            <VoiceSearch onResult={setSearch} />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setVisibleCount(PAGE_SIZE); }}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg">
                <SelectValue placeholder={t('search.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allCategories')}</SelectItem>
                <SelectItem value="Farmers">{t('category.farmers')}</SelectItem>
                <SelectItem value="Students">{t('category.students')}</SelectItem>
                <SelectItem value="Women">{t('category.women')}</SelectItem>
                <SelectItem value="General">{t('category.general')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setVisibleCount(PAGE_SIZE); }}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg">
                <SelectValue placeholder={t('search.allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allTypes')}</SelectItem>
                <SelectItem value="Central">{td('Central')}</SelectItem>
                <SelectItem value="State">{td('State')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={v => { setGenderFilter(v); setVisibleCount(PAGE_SIZE); }}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg">
                <SelectValue placeholder={t('eligibility.gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('eligibility.selectGender')}</SelectItem>
                <SelectItem value="male">{t('eligibility.male')}</SelectItem>
                <SelectItem value="female">{t('eligibility.female')}</SelectItem>
                <SelectItem value="other">{t('eligibility.other')}</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                ✕ Clear
              </Button>
            )}
          </div>
          {!loading && (
            <p className="text-sm text-muted-foreground">
              {filtered.length} {t('search.schemesFound')}
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SchemeCardSkeleton key={i} />)}
          </div>
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
                <Button variant="outline" onClick={() => setVisibleCount(c => c + PAGE_SIZE)} className="gap-2 rounded-xl">
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
