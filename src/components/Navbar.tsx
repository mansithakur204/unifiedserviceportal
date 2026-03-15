import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, Menu, Shield, User, X, ClipboardCheck, GitCompareArrows, Bookmark, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <span className="text-2xl">🏛️</span>
          <span className="hidden sm:inline">{t('landing.title')}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/home" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            {t('nav.home')}
          </Link>
          <Link to="/search" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            {t('nav.search')}
          </Link>
          <Link to="/eligibility" className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1">
            <ClipboardCheck className="w-4 h-4" /> {t('nav.eligibility')}
          </Link>
          <Link to="/compare" className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1">
            <GitCompareArrows className="w-4 h-4" /> {t('nav.compare')}
          </Link>
          {user && (
            <Link to="/saved" className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1">
              <Bookmark className="w-4 h-4" /> {t('nav.saved')}
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {t('nav.admin')}
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={toggleLang} className="gap-1">
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'हिंदी' : 'English'}
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="ghost" size="sm"><User className="w-4 h-4" /></Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">{t('nav.login')}</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-card px-4 py-4 space-y-3">
          <Link to="/home" className="block py-2 font-medium" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/search" className="block py-2 font-medium" onClick={() => setMenuOpen(false)}>{t('nav.search')}</Link>
          <Link to="/eligibility" className="block py-2 font-medium" onClick={() => setMenuOpen(false)}>{t('nav.eligibilityChecker')}</Link>
          <Link to="/compare" className="block py-2 font-medium" onClick={() => setMenuOpen(false)}>{t('nav.compareSchemes')}</Link>
          {user && <Link to="/saved" className="block py-2 font-medium" onClick={() => setMenuOpen(false)}>{t('nav.savedSchemes')}</Link>}
          {isAdmin && (
            <Link to="/admin" className="block py-2 font-medium" onClick={() => setMenuOpen(false)}>{t('nav.admin')}</Link>
          )}
          <Button variant="outline" size="sm" onClick={toggleLang} className="w-full gap-1">
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'हिंदी' : 'English'}
          </Button>
          {user ? (
            <div className="flex gap-2">
              <Link to="/profile" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">{t('nav.profile')}</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => { handleSignOut(); setMenuOpen(false); }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button size="sm" className="w-full">{t('nav.login')}</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
