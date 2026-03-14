import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sprout, GraduationCap, Heart, FileText, Languages, Loader2, Sheet, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getGoogleSheetUrl, setGoogleSheetUrl } from '@/hooks/useSchemes';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ total: 0, farmers: 0, students: 0, women: 0, translated: 0, untranslated: 0 });
  const [translating, setTranslating] = useState(false);
  const [sheetUrl, setSheetUrlState] = useState(getGoogleSheetUrl());
  const [testingSheet, setTestingSheet] = useState(false);

  const fetchStats = async () => {
    const { data } = await supabase.from('schemes').select('category, scheme_name_hi');
    if (!data) return;
    setStats({
      total: data.length,
      farmers: data.filter(s => s.category === 'Farmers').length,
      students: data.filter(s => s.category === 'Students').length,
      women: data.filter(s => s.category === 'Women').length,
      translated: data.filter(s => s.scheme_name_hi).length,
      untranslated: data.filter(s => !s.scheme_name_hi).length,
    });
  };

  useEffect(() => { fetchStats(); }, []);

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-schemes', { body: {} });
      if (error) throw error;
      toast({ title: `${data.count} schemes translated. ${data.remaining ?? 0} remaining.` });
      fetchStats();
    } catch (err: any) {
      toast({ title: 'Translation failed', description: err.message, variant: 'destructive' });
    } finally {
      setTranslating(false);
    }
  };

  const handleSaveSheetUrl = () => {
    setGoogleSheetUrl(sheetUrl);
    toast({ title: sheetUrl ? 'Google Sheet URL saved' : 'Google Sheet URL removed' });
  };

  const handleTestSheet = async () => {
    if (!sheetUrl) return;
    setTestingSheet(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-google-sheet', {
        body: { sheetUrl },
      });
      if (error) throw error;
      toast({ title: `Sheet connected! ${data.schemes?.length ?? 0} schemes found.` });
    } catch (err: any) {
      toast({ title: 'Failed to fetch sheet', description: err.message, variant: 'destructive' });
    } finally {
      setTestingSheet(false);
    }
  };

  const cards = [
    { label: t('admin.totalSchemes'), value: stats.total, icon: FileText, color: 'gradient-saffron' },
    { label: t('category.farmers'), value: stats.farmers, icon: Sprout, color: 'gradient-green' },
    { label: t('category.students'), value: stats.students, icon: GraduationCap, color: 'gradient-navy' },
    { label: t('category.women'), value: stats.women, icon: Heart, color: 'gradient-saffron' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Card key={c.label} className={`${c.color} border-0`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary-foreground/80">{c.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary-foreground">{c.value}</span>
              <c.icon className="w-8 h-8 text-primary-foreground/60" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Google Sheet Integration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sheet className="w-5 h-5" />
            Google Sheets Data Source
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste a published Google Sheet URL below. The sheet should have columns: <code className="text-xs bg-muted px-1 py-0.5 rounded">name, category, type, state, description, benefits, eligibility, documents, amount, applyLink</code>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={e => setSheetUrlState(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveSheetUrl} variant="default" className="gap-1">
              <Check className="w-4 h-4" /> Save
            </Button>
            {sheetUrl && (
              <Button onClick={() => { setSheetUrlState(''); setGoogleSheetUrl(''); toast({ title: 'Sheet URL removed' }); }} variant="outline" className="gap-1">
                <X className="w-4 h-4" /> Clear
              </Button>
            )}
          </div>
          {sheetUrl && (
            <Button onClick={handleTestSheet} disabled={testingSheet} variant="outline" className="gap-2">
              {testingSheet ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sheet className="w-4 h-4" />}
              Test Connection
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Translation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Hindi Translation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 text-sm">
            <span className="text-muted-foreground">Translated: <strong className="text-foreground">{stats.translated}</strong></span>
            <span className="text-muted-foreground">Remaining: <strong className="text-foreground">{stats.untranslated}</strong></span>
          </div>
          {stats.untranslated > 0 && (
            <Button onClick={handleTranslate} disabled={translating} className="gap-2">
              {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              Translate Remaining Schemes
            </Button>
          )}
          {stats.untranslated === 0 && (
            <p className="text-sm text-secondary">✓ All schemes have Hindi translations!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}