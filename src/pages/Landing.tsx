import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import CategoryCards from '@/components/CategoryCard';
import SchemeCard from '@/components/SchemeCard';
import SchemeCardSkeleton from '@/components/SchemeCardSkeleton';
import SmartSearch from '@/components/SmartSearch';
import TrustBadges from '@/components/TrustBadges';
import heroRural from '@/assets/hero-rural.jpg';
import carouselFarmer from '@/assets/carousel-farmer.jpg';
import carouselStudents from '@/assets/carousel-students.jpg';
import carouselWomen from '@/assets/carousel-women.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Star, ChevronLeft, ChevronRight, Search as SearchIcon, LayoutGrid, MapPin } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SLIDES = [
  { img: heroRural, titleKey: 'landing.title', subtitleKey: 'landing.subtitle' },
  { img: carouselFarmer, titleKey: 'carousel.farmerTitle', subtitleKey: 'carousel.farmerSubtitle' },
  { img: carouselStudents, titleKey: 'carousel.studentTitle', subtitleKey: 'carousel.studentSubtitle' },
  { img: carouselWomen, titleKey: 'carousel.womenTitle', subtitleKey: 'carousel.womenSubtitle' },
];

export default function Landing() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [latestSchemes, setLatestSchemes] = useState<any[]>([]);
  const [popularSchemes, setPopularSchemes] = useState<any[]>([]);
  const [stateSchemes, setStateSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from('schemes').select('*').order('created_at', { ascending: false }).limit(4),
      supabase.from('schemes').select('*').eq('is_popular', true).order('click_count', { ascending: false }).limit(4),
      supabase.from('schemes').select('*').eq('type', 'State').order('created_at', { ascending: false }).limit(4),
    ]).then(([latestRes, popularRes, stateRes]) => {
      setLatestSchemes(latestRes.data ?? []);
      setPopularSchemes(popularRes.data ?? []);
      setStateSchemes(stateRes.data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (dir: number) => {
    setCurrentSlide(prev => (prev + dir + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[currentSlide];

  const renderSchemeGrid = (schemes: any[]) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <SchemeCardSkeleton key={i} />)}
        </div>
      );
    }
    if (schemes.length === 0) {
      return <p className="text-center text-muted-foreground py-8">{t('search.noResults')}</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {schemes.map(s => (
          <SchemeCard key={s.id} id={s.id} scheme={s} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden h-[55vh] md:h-[75vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img src={slide.img} alt="Rural India" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/65 to-foreground/20" />
          </motion.div>
        </AnimatePresence>

        <div className="relative container mx-auto px-4 h-full flex items-center z-10">
          <div className="max-w-2xl space-y-5">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-3">
                <LanguageSelector className="bg-card/20 border-card/30 text-card backdrop-blur-sm" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-card leading-tight tracking-tight">
                {t(slide.titleKey)}
              </h1>
              <p className="text-base md:text-lg text-card/85 mt-3 leading-relaxed max-w-lg">
                {t(slide.subtitleKey)}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/find-my-schemes">
                  <Button size="lg" className="text-base gap-2 px-6 rounded-xl shadow-lg">
                    <SearchIcon className="w-4 h-4" /> {t('nav.findMySchemes')}
                  </Button>
                </Link>
                <Link to="/home">
                  <Button size="lg" variant="outline" className="text-base gap-2 px-6 rounded-xl bg-card/10 border-card/30 text-card backdrop-blur-sm">
                    <LayoutGrid className="w-4 h-4" /> {t('landing.browseCategory')}
                  </Button>
                </Link>
                {!user && (
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-base px-6 rounded-xl bg-card/10 border-card/30 text-card backdrop-blur-sm">
                      {t('landing.login')}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => goTo(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-card/20 backdrop-blur-sm hover:bg-card/40 text-card rounded-full p-2 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => goTo(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-card/20 backdrop-blur-sm hover:bg-card/40 text-card rounded-full p-2 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? 'bg-card w-8' : 'bg-card/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Smart Search */}
      <SmartSearch />

      {/* Categories */}
      <section className="container mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t('landing.browseCategory')}</h2>
          <p className="text-muted-foreground mt-2">{t('landing.browseCategoryDesc')}</p>
        </div>
        <CategoryCards />
      </section>

      {/* Featured Schemes with Tabs */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t('featured.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('featured.subtitle')}</p>
        </div>
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="mx-auto flex w-fit mb-8 bg-muted/80 rounded-xl p-1">
            <TabsTrigger value="new" className="rounded-lg gap-1.5 px-4">
              <Clock className="w-4 h-4" /> {t('featured.new')}
            </TabsTrigger>
            <TabsTrigger value="popular" className="rounded-lg gap-1.5 px-4">
              <Star className="w-4 h-4" /> {t('featured.popular')}
            </TabsTrigger>
            <TabsTrigger value="state" className="rounded-lg gap-1.5 px-4">
              <MapPin className="w-4 h-4" /> {t('featured.state')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new">{renderSchemeGrid(latestSchemes)}</TabsContent>
          <TabsContent value="popular">{renderSchemeGrid(popularSchemes)}</TabsContent>
          <TabsContent value="state">{renderSchemeGrid(stateSchemes)}</TabsContent>
        </Tabs>
        <div className="text-center mt-8">
          <Link to="/home">
            <Button variant="outline" size="lg" className="gap-2 rounded-xl">
              {t('landing.cta')} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Section */}
      <TrustBadges />
    </div>
  );
}
