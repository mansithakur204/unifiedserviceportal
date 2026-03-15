import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSchemes } from '@/hooks/useSchemes';
import SchemeCard from '@/components/SchemeCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const STATES = [
  'All India', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan',
  'West Bengal', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat',
  'Andhra Pradesh', 'Telangana', 'Kerala', 'Punjab', 'Haryana',
  'Odisha', 'Jharkhand', 'Chhattisgarh', 'Assam', 'Delhi'
];

export default function FindMySchemes() {
  const { t, td, lang } = useLanguage();
  const { schemes, loading: schemesLoading } = useSchemes();
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleFind = async () => {
    if (!category) {
      toast({ title: lang === 'hi' ? 'कृपया श्रेणी चुनें' : 'Please select a category', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setSearched(true);

    try {
      // Build a compact summary of available schemes for the AI
      const schemesSummary = schemes.map((s: any) => ({
        id: s.id,
        name: s.scheme_name,
        category: s.category,
        state: s.state,
        type: s.type,
        eligibility: s.eligibility?.substring(0, 150),
        benefits: s.benefits?.substring(0, 150),
        details: s.details?.substring(0, 100),
        funding_amount: s.funding_amount,
      }));

      const userProfile = {
        category,
        state: state || 'Any',
        age: age || 'Not specified',
        income,
        occupation: occupation || 'Not specified',
        gender: gender || 'Not specified',
      };

      const { data, error } = await supabase.functions.invoke('recommend-schemes', {
        body: { userProfile, schemes: schemesSummary },
      });

      if (error) throw error;

      const recommendedIds: string[] = data?.recommendedIds ?? [];
      // Preserve AI ordering
      const matched = recommendedIds
        .map((id: string) => schemes.find((s: any) => s.id === id))
        .filter(Boolean);

      setRecommended(matched);
    } catch (err) {
      console.error('Recommendation error:', err);
      // Fallback: simple client-side filtering
      let filtered = [...schemes];
      if (category) filtered = filtered.filter((s: any) => s.category === category);
      if (state) filtered = filtered.filter((s: any) => s.state === state || s.state === 'All India');
      if (gender === 'Female') {
        filtered.sort((a: any, b: any) => (b.category === 'Women' ? 1 : 0) - (a.category === 'Women' ? 1 : 0));
      }
      setRecommended(filtered.slice(0, 10));
      toast({ title: lang === 'hi' ? 'AI अनुपलब्ध, बुनियादी फ़िल्टर का उपयोग किया गया' : 'AI unavailable, used basic filtering', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold">
          {lang === 'hi' ? 'मेरी योजनाएं खोजें' : 'Find My Schemes'}
        </h1>
      </div>
      <p className="text-muted-foreground mb-6">
        {lang === 'hi'
          ? 'अपनी जानकारी भरें और AI-संचालित अनुशंसाएं प्राप्त करें।'
          : 'Fill in your details and get AI-powered scheme recommendations tailored for you.'}
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">
            {lang === 'hi' ? 'अपना विवरण दर्ज करें' : 'Enter Your Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('scheme.category')} *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder={t('eligibility.selectCategory')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Farmers">{t('category.farmers')}</SelectItem>
                <SelectItem value="Students">{t('category.students')}</SelectItem>
                <SelectItem value="Women">{t('category.women')}</SelectItem>
                <SelectItem value="General">{t('category.general')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('scheme.state')}</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger><SelectValue placeholder={lang === 'hi' ? 'राज्य चुनें' : 'Select State'} /></SelectTrigger>
              <SelectContent>
                {STATES.map(s => <SelectItem key={s} value={s}>{td(s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{lang === 'hi' ? 'आयु' : 'Age'}</Label>
            <Input
              type="number"
              min={1}
              max={120}
              placeholder={lang === 'hi' ? 'अपनी आयु दर्ज करें' : 'Enter your age'}
              value={age}
              onChange={e => setAge(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('eligibility.income')}</Label>
            <Select value={income} onValueChange={setIncome}>
              <SelectTrigger><SelectValue placeholder={lang === 'hi' ? 'आय चुनें' : 'Select Income'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="below-1l">{t('eligibility.below1l')}</SelectItem>
                <SelectItem value="1l-2.5l">₹1,00,000 - ₹2,50,000</SelectItem>
                <SelectItem value="2.5l-5l">₹2,50,000 - ₹5,00,000</SelectItem>
                <SelectItem value="5l-10l">₹5,00,000 - ₹10,00,000</SelectItem>
                <SelectItem value="above-10l">{t('eligibility.above10l')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('eligibility.occupation')}</Label>
            <Select value={occupation} onValueChange={setOccupation}>
              <SelectTrigger><SelectValue placeholder={lang === 'hi' ? 'व्यवसाय चुनें' : 'Select Occupation'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Farmer">{t('category.farmers')}</SelectItem>
                <SelectItem value="Student">{t('category.students')}</SelectItem>
                <SelectItem value="Worker">{lang === 'hi' ? 'कामगार' : 'Worker'}</SelectItem>
                <SelectItem value="Business">{lang === 'hi' ? 'व्यापार' : 'Business'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('eligibility.gender')}</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder={t('eligibility.selectGender')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t('eligibility.male')}</SelectItem>
                <SelectItem value="Female">{t('eligibility.female')}</SelectItem>
                <SelectItem value="Other">{t('eligibility.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Button onClick={handleFind} disabled={loading || schemesLoading} className="w-full gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {lang === 'hi' ? 'मेरी योजनाएं खोजें' : 'Find My Schemes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {lang === 'hi' ? 'आपके लिए अनुशंसित' : 'Recommended for You'}
          </h2>
          {recommended.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((s: any) => (
                <SchemeCard key={s.id} id={s.id} scheme={s} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {lang === 'hi' ? 'कोई मिलान योजना नहीं मिली। कृपया अपने फ़िल्टर बदलें।' : 'No matching schemes found. Try adjusting your filters.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
