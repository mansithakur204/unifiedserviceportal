import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language, languageLabels } from '@/lib/i18n';

const languages = Object.entries(languageLabels) as [Language, string][];

export default function LanguageSelector({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-1 ${className ?? ''}`}>
          <Globe className="w-4 h-4" />
          {languageLabels[lang]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
        {languages.map(([code, label]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLang(code)}
            className={lang === code ? 'bg-accent font-semibold' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
