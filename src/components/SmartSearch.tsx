import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VoiceSearch from '@/components/VoiceSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function SmartSearch() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (gender) params.set('gender', gender);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="container mx-auto px-4 -mt-8 relative z-30"
    >
      <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center">{t('smartSearch.title')}</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t('smartSearch.placeholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="pl-11 h-12 text-base rounded-xl"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-40 h-12 rounded-xl">
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
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-full md:w-40 h-12 rounded-xl">
              <SelectValue placeholder={t('eligibility.gender')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('eligibility.selectGender')}</SelectItem>
              <SelectItem value="male">{t('eligibility.male')}</SelectItem>
              <SelectItem value="female">{t('eligibility.female')}</SelectItem>
              <SelectItem value="other">{t('eligibility.other')}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <VoiceSearch onResult={setQuery} />
            <Button onClick={handleSearch} size="lg" className="h-12 px-6 rounded-xl gap-2">
              <Search className="w-4 h-4" /> {t('nav.search')}
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
