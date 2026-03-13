import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, ExternalLink, IndianRupee, CheckCircle, FileText, Gift, Phone, HelpCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { localizeScheme } from '@/lib/localize';

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, td, lang } = useLanguage();
  const { user } = useAuth();
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    supabase.from('schemes').select('*').eq('id', id!).single().then(({ data }) => {
      setScheme(data);
      setLoading(false);
    });
    supabase.rpc('increment_click_count', { scheme_id: id! });
    if (user) {
      supabase.from('bookmarks').select('id').eq('user_id', user.id).eq('scheme_id', id!).maybeSingle()
        .then(({ data }) => setBookmarked(!!data));
    }
  }, [id, user]);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">{t('common.loading')}</div>;
  if (!scheme) return <div className="container mx-auto px-4 py-16 text-center">{t('scheme.notFound')}</div>;

  const schemeName = localizeScheme(scheme, 'scheme_name', lang);
  const details = localizeScheme(scheme, 'details', lang);
  const eligibility = localizeScheme(scheme, 'eligibility', lang);
  const benefits = localizeScheme(scheme, 'benefits', lang);
  const documents = localizeScheme(scheme, 'documents', lang);
  const helpline = localizeScheme(scheme, 'helpline', lang);
  const fundingAmount = localizeScheme(scheme, 'funding_amount', lang);

  const faqItems: { question: string; answer: string }[] = Array.isArray(scheme.faq) ? scheme.faq : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/home" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> {t('common.back')}
      </Link>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary text-primary-foreground">{td(scheme.category)}</Badge>
            <Badge variant="outline">{td(scheme.type)}</Badge>
            {scheme.state && scheme.state !== 'All India' && <Badge variant="secondary">{td(scheme.state)}</Badge>}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">{schemeName}</h1>

          <Button
            variant={bookmarked ? 'default' : 'outline'}
            size="sm"
            className="gap-2 w-fit"
            onClick={async () => {
              if (!user) { toast({ title: t('scheme.loginToSave'), variant: 'destructive' }); return; }
              if (bookmarked) {
                await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('scheme_id', id!);
                setBookmarked(false);
                toast({ title: t('scheme.removedFromSaved') });
              } else {
                await supabase.from('bookmarks').insert({ user_id: user.id, scheme_id: id! });
                setBookmarked(true);
                toast({ title: t('scheme.schemeSaved') });
              }
            }}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {bookmarked ? t('scheme.saved') : t('scheme.save')}
          </Button>

          {fundingAmount && (
            <div className="flex items-center gap-2 text-lg font-semibold text-secondary">
              <IndianRupee className="w-5 h-5" />
              {t('scheme.funding')}: {fundingAmount}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">{t('scheme.details')}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{details}</p>
          </div>

          {eligibility && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-secondary" /> {t('scheme.eligibility')}
              </h3>
              <p className="text-muted-foreground">{eligibility}</p>
            </div>
          )}

          {benefits && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                <Gift className="w-4 h-4 text-primary" /> {t('scheme.benefits')}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{benefits}</p>
            </div>
          )}

          {documents && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                <FileText className="w-4 h-4 text-accent" /> {t('scheme.documents')}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{documents}</p>
            </div>
          )}

          {helpline && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                <Phone className="w-4 h-4 text-secondary" /> {t('scheme.helpline')}
              </h3>
              <p className="text-muted-foreground">{helpline}</p>
            </div>
          )}

          {faqItems.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-primary" /> {t('scheme.faq')}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {scheme.application_link && (
            <a href={scheme.application_link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full gap-2 text-lg mt-4">
                {t('scheme.apply')} <ExternalLink className="w-5 h-5" />
              </Button>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
