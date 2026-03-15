import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, td, lang } = useLanguage();

  return (
    <footer className="border-t bg-card mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t('footer.portal')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.home')}</Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors">{t('footer.searchSchemes')}</Link></li>
              <li><Link to="/home" className="hover:text-primary transition-colors">{t('footer.allSchemes')}</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t('footer.categories')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/Farmers" className="hover:text-primary transition-colors">{td('Farmers')}</Link></li>
              <li><Link to="/category/Students" className="hover:text-primary transition-colors">{td('Students')}</Link></li>
              <li><Link to="/category/Women" className="hover:text-primary transition-colors">{td('Women')}</Link></li>
              <li><Link to="/category/General" className="hover:text-primary transition-colors">{td('General')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t('footer.information')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/disclaimer" className="hover:text-primary transition-colors">{t('footer.disclaimer')}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t('footer.dataSources')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">india.gov.in</a></li>
              <li><a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">myscheme.gov.in</a></li>
              <li><a href="https://pmjdy.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">pmjdy.gov.in</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {lang === 'hi' ? 'ग्रामीण सेवा पोर्टल' : 'Rural Services Portal'}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}