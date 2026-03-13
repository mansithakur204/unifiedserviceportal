import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCompareArrows } from 'lucide-react';
import { localizeScheme } from '@/lib/localize';

export default function CompareSchemes() {
  const { t, td, lang } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [schemeA, setSchemeA] = useState('');
  const [schemeB, setSchemeB] = useState('');

  useEffect(() => {
    supabase.from('schemes').select('*').order('scheme_name').then(({ data }) => setSchemes(data ?? []));
  }, []);

  const a = schemes.find(s => s.id === schemeA);
  const b = schemes.find(s => s.id === schemeB);

  const rows = [
    { label: t('scheme.category'), key: 'category', dynamic: true },
    { label: t('scheme.type'), key: 'type', dynamic: true },
    { label: t('scheme.state'), key: 'state', dynamic: true },
    { label: t('scheme.funding'), key: 'funding_amount', localized: true },
    { label: t('scheme.eligibility'), key: 'eligibility', localized: true },
    { label: t('scheme.benefits'), key: 'benefits', localized: true },
    { label: t('scheme.documents'), key: 'documents', localized: true },
    { label: t('scheme.helpline'), key: 'helpline', localized: true },
    { label: t('scheme.popular'), key: 'click_count' },
  ];

  const getCellValue = (scheme: any, row: typeof rows[0]) => {
    if (!scheme) return '—';
    if (row.dynamic) return td(scheme[row.key]) || '—';
    if (row.localized) return localizeScheme(scheme, row.key, lang) || '—';
    return scheme[row.key] ?? '—';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <GitCompareArrows className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-bold">{t('nav.compareSchemes')}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Select value={schemeA} onValueChange={setSchemeA}>
          <SelectTrigger><SelectValue placeholder={lang === 'hi' ? 'योजना 1 चुनें' : 'Select Scheme 1'} /></SelectTrigger>
          <SelectContent>
            {schemes.filter(s => s.id !== schemeB).map(s => (
              <SelectItem key={s.id} value={s.id}>{localizeScheme(s, 'scheme_name', lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={schemeB} onValueChange={setSchemeB}>
          <SelectTrigger><SelectValue placeholder={lang === 'hi' ? 'योजना 2 चुनें' : 'Select Scheme 2'} /></SelectTrigger>
          <SelectContent>
            {schemes.filter(s => s.id !== schemeA).map(s => (
              <SelectItem key={s.id} value={s.id}>{localizeScheme(s, 'scheme_name', lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {a && b && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-semibold w-1/4">{lang === 'hi' ? 'फ़ील्ड' : 'Field'}</th>
                  <th className="p-3 text-left font-semibold w-[37.5%]">
                    <Badge className="bg-primary text-primary-foreground">{localizeScheme(a, 'scheme_name', lang)}</Badge>
                  </th>
                  <th className="p-3 text-left font-semibold w-[37.5%]">
                    <Badge className="bg-accent text-accent-foreground">{localizeScheme(b, 'scheme_name', lang)}</Badge>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.key} className="border-b last:border-b-0">
                    <td className="p-3 font-medium text-muted-foreground">{r.label}</td>
                    <td className="p-3">{getCellValue(a, r)}</td>
                    <td className="p-3">{getCellValue(b, r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
