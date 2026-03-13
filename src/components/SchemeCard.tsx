import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, IndianRupee, Sprout, GraduationCap, Heart, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { localizeScheme } from '@/lib/localize';

interface SchemeCardProps {
  id: string;
  scheme: any;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Farmers: <Sprout className="w-5 h-5" />,
  Students: <GraduationCap className="w-5 h-5" />,
  Women: <Heart className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  Farmers: 'bg-secondary text-secondary-foreground',
  Students: 'bg-accent text-accent-foreground',
  Women: 'bg-primary text-primary-foreground',
};

export default function SchemeCard({ id, scheme }: SchemeCardProps) {
  const { t, td, lang } = useLanguage();
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  const schemeName = localizeScheme(scheme, 'scheme_name', lang);
  const details = localizeScheme(scheme, 'details', lang);
  const fundingAmount = localizeScheme(scheme, 'funding_amount', lang);
  const category = scheme.category;
  const type = scheme.type;
  const applicationLink = scheme.application_link;

  useEffect(() => {
    if (!user) return;
    supabase.from('bookmarks').select('id').eq('user_id', user.id).eq('scheme_id', id).maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [user, id]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: t('scheme.loginToSave'), variant: 'destructive' });
      return;
    }
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('scheme_id', id);
      setBookmarked(false);
      toast({ title: t('scheme.removedFromSaved') });
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, scheme_id: id });
      setBookmarked(true);
      toast({ title: t('scheme.schemeSaved') });
    }
  };

  const trackClick = () => {
    supabase.rpc('increment_click_count', { scheme_id: id });
  };

  return (
    <Card className="category-card-hover flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <Badge className={categoryColors[category] ?? 'bg-muted text-muted-foreground'}>
            <span className="mr-1">{categoryIcons[category]}</span>
            {td(category)}
          </Badge>
          <div className="flex items-center gap-1">
            <Badge variant="outline">{td(type)}</Badge>
            <button onClick={toggleBookmark} className="p-1 rounded hover:bg-muted transition-colors">
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-2">{schemeName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3">{details}</p>
        {fundingAmount && (
          <div className="flex items-center gap-1 mt-3 text-sm font-semibold text-secondary">
            <IndianRupee className="w-4 h-4" />
            {fundingAmount}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <Link to={`/scheme/${id}`} className="flex-1" onClick={trackClick}>
          <Button variant="outline" className="w-full" size="sm">{t('scheme.details')}</Button>
        </Link>
        {applicationLink && (
          <a href={applicationLink} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-1">
              {t('scheme.apply')} <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
