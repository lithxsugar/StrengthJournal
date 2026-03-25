import { useState } from 'react';
import { CHARACTER_STRENGTHS_DATA, VIRTUES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getStrengthIcon } from '../constants';

export default function Strengths() {
  const [selectedStrength, setSelectedStrength] = useState<string | null>(null);
  const { t, strengthToKey, language } = useLanguage();

  const virtueToKey = (virtue: string) => {
    const keyMap: { [key: string]: string } = {
      "Wisdom": "virtue_wisdom",
      "Courage": "virtue_courage",
      "Humanity": "virtue_humanity",
      "Justice": "virtue_justice",
      "Temperance": "virtue_temperance",
      "Transcendence": "virtue_transcendence"
    };
    return keyMap[virtue] || virtue;
  };

  const strengthToDescKey = (strength: string) => {
    const keyMap: { [key: string]: string } = {
      "Teamwork": "desc_teamwork",
      "Kindness": "desc_kindness",
      "Hope": "desc_hope",
      "Perspective": "desc_perspective",
      "Religiousness/spirituality": "desc_religiousness",
      "Creativity": "desc_creativity",
      "Gratitude": "desc_gratitude",
      "Persistence/perseverence": "desc_persistence",
      "Open-mindedness/judgement": "desc_open_mindedness",
      "Forgiveness": "desc_forgiveness",
      "Appreciation of beauty and excellence": "desc_appreciation",
      "Leadership": "desc_leadership",
      "Love of learning": "desc_love_of_learning",
      "Fairness": "desc_fairness",
      "Curiosity": "desc_curiosity",
      "Bravery": "desc_bravery",
      "Zest": "desc_zest",
      "Humor": "desc_humor",
      "Modesty/humility": "desc_modesty",
      "Social Intelligence": "desc_social_intelligence",
      "Self-regulation": "desc_self_regulation",
      "Prudence": "desc_prudence",
      "Love": "desc_love"
    };
    return keyMap[strength] || strength;
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-serif italic text-accent tracking-tighter">
            {t('nav_strengths')}
          </h1>
          <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold mt-2">
            {language === 'en' ? 'The 24 VIA classification of virtues' : '24 klasifikasi kebajikan VIA'}
          </p>
        </div>
        <div className="hidden md:flex p-3 rounded-full bg-accent/5 text-accent">
          <BookOpen size={24} />
        </div>
      </header>

      <div className="space-y-16">
        {Object.entries(VIRTUES).map(([virtue, strengths], vIndex) => (
          <section key={virtue} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-serif italic text-accent">{t(virtueToKey(virtue))}</h2>
              <div className="flex-1 h-px bg-accent/10" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strengths.map((strength, index) => (
                <motion.div
                  key={strength}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (vIndex * 5 + index) * 0.02 }}
                  onClick={() => setSelectedStrength(strength)}
                  className="glass-card p-6 rounded-2xl border border-ink/5 hover:border-accent/20 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent/30 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                      {(() => {
                        const Icon = getStrengthIcon(strength);
                        return <Icon size={18} />;
                      })()}
                    </div>
                    <h3 className="text-xl font-serif italic text-ink group-hover:text-accent transition-colors">
                      {t(strengthToKey(strength))}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Definition Modal */}
      <AnimatePresence>
        {selectedStrength && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStrength(null)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-paper p-8 rounded-3xl shadow-2xl border border-ink/5"
            >
              <button 
                onClick={() => setSelectedStrength(null)}
                className="absolute top-6 right-6 text-ink/20 hover:text-ink transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-accent/5 text-accent">
                  {(() => {
                    const Icon = getStrengthIcon(selectedStrength);
                    return <Icon size={32} />;
                  })()}
                </div>
                <h2 className="text-4xl font-serif italic text-accent tracking-tighter">
                  {t(strengthToKey(selectedStrength))}
                </h2>
              </div>
              
              <div className="w-12 h-px bg-gold/30 mb-6" />
              
              <p className="text-2xl font-serif italic text-ink/80 leading-relaxed">
                {t(strengthToDescKey(selectedStrength))}
              </p>
              
              <button 
                onClick={() => setSelectedStrength(null)}
                className="mt-12 w-full premium-button h-14"
              >
                {t('common_cancel')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="mt-12 p-8 glass-card rounded-3xl border-gold/20 bg-gold/5">
        <h2 className="text-2xl font-serif italic text-accent mb-4">{language === 'en' ? 'About VIA Strengths' : 'Tentang Kekuatan VIA'}</h2>
        <p className="text-ink/60 leading-relaxed font-serif text-lg italic">
          {language === 'en' 
            ? '"Character strengths are the positive parts of your personality that make you feel authentic and engaged. When you know your best character strengths, you can use them to improve your life and thrive."'
            : '"Kekuatan karakter adalah bagian positif dari kepribadian Anda yang membuat Anda merasa otentik dan terlibat. Ketika Anda mengetahui kekuatan karakter terbaik Anda, Anda dapat menggunakannya untuk meningkatkan kehidupan Anda dan berkembang."'}
        </p>
      </section>
    </div>
  );
}
