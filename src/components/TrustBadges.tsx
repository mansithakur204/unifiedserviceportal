import { Shield, ExternalLink, CheckCircle2, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const badges = [
  { icon: Shield, titleKey: 'trust.verified', descKey: 'trust.verifiedDesc', color: 'text-secondary' },
  { icon: ExternalLink, titleKey: 'trust.directLinks', descKey: 'trust.directLinksDesc', color: 'text-primary' },
  { icon: CheckCircle2, titleKey: 'trust.upToDate', descKey: 'trust.upToDateDesc', color: 'text-accent' },
  { icon: Award, titleKey: 'trust.official', descKey: 'trust.officialDesc', color: 'text-secondary' },
];

export default function TrustBadges() {
  const { t } = useLanguage();

  return (
    <section className="bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">{t('trust.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{t('trust.subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-3"
            >
              <div className={`mx-auto w-14 h-14 rounded-full bg-background border-2 border-border flex items-center justify-center ${b.color}`}>
                <b.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">{t(b.titleKey)}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{t(b.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
