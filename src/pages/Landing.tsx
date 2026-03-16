import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import CategoryCards from '@/components/CategoryCard';
import SchemeCard from '@/components/SchemeCard';
import heroRural from '@/assets/hero-rural.jpg';
import carouselFarmer from '@/assets/carousel-farmer.jpg';
import carouselStudents from '@/assets/carousel-students.jpg';
import carouselWomen from '@/assets/carousel-women.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    supabase.from('schemes').select('*').order('created_at', { ascending: false }).limit(4)
      .then(({ data }) => setLatestSchemes(data ?? []));
    supabase.from('schemes').select('*').eq('is_popular', true).order('click_count', { ascending: false }).limit(4)
      .then(({ data }) => setPopularSchemes(data ?? []));
  }, []);

  // Auto-advance carousel
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

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden h-[60vh] md:h-[80vh]">
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
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative container mx-auto px-4 h-full flex items-center z-10">
          <div className="max-w-2xl space-y-6">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-4">
                <LanguageSelector className="bg-card/20 border-card/30 text-card backdrop-blur-sm" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-card leading-tight">
                {t(slide.titleKey)}
              </h1>
              <p className="text-lg md:text-xl text-card/80 mt-4">
                {t(slide.subtitleKey)}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/home">
                  <Button size="lg" className="text-lg gap-2 px-8">
                    {t('landing.cta')} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                {!user && (
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 bg-card/10 border-card/30 text-card backdrop-blur-sm">
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

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">{t('nav.schemes')}</h2>
        <CategoryCards />
      </section>

      {/* Latest Schemes */}
      {latestSchemes.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Latest Schemes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestSchemes.map(s => (
              <SchemeCard key={s.id} id={s.id} scheme={s} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Schemes */}
      {popularSchemes.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Popular Schemes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSchemes.map(s => (
              <SchemeCard key={s.id} id={s.id} scheme={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
