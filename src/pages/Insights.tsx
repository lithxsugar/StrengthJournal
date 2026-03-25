import { useState, useEffect, useMemo } from 'react';
import { db, collection, query, where, onSnapshot, auth, handleFirestoreError, OperationType } from '../firebase';
import { JournalEntry, CHARACTER_STRENGTHS } from '../types';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Sparkles, Award, Target, Zap, Shield, Heart, Flame } from 'lucide-react';
import { startOfDay, subDays } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';

export default function Insights() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, strengthToKey, language } = useLanguage();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'entries'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'entries');
    });

    return () => unsubscribe();
  }, []);

  // Calculate statistics
  const strengthCounts = entries.reduce((acc, entry) => {
    (entry.strengths || []).forEach(strength => {
      acc[strength] = (acc[strength] || 0) + 1;
    });
    return acc;
  }, {} as { [key: string]: number });

  const sortedStrengths = (Object.entries(strengthCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1]);

  const topStrengths = sortedStrengths.slice(0, 3);
  const totalEntries = entries.length;
  const uniqueStrengthsCount = Object.keys(strengthCounts).length;

  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    
    const dateNumbers = entries.map(e => startOfDay(e.date.toDate()).getTime());
    const sortedDates = Array.from(new Set(dateNumbers))
      .sort((a: number, b: number) => b - a);
    
    let currentStreak = 0;
    let checkDate = startOfDay(new Date());

    if (sortedDates[0] !== checkDate.getTime()) {
      checkDate = subDays(checkDate, 1);
      if (sortedDates[0] !== checkDate.getTime()) return 0;
    }

    for (const date of sortedDates) {
      if (date === (checkDate as Date).getTime()) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    return currentStreak;
  }, [entries]);

  if (loading) return null;

  return (
    <div className="space-y-16 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-accent/40">
            <TrendingUp size={16} />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold">{language === 'en' ? 'Performance Analytics' : 'Analisis Performa'}</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif italic text-accent tracking-tighter leading-none">
            {t('nav_insights')}
          </h1>
        </div>
        <div className="flex flex-wrap gap-8 md:gap-12">
          {streak > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-orange-500/40 font-bold">{t('home_streak')}</div>
              <div className="flex items-center gap-3 text-5xl font-serif italic text-orange-500 leading-none">
                <Flame size={32} fill="currentColor" />
                {streak}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink/20 font-bold">{t('insights_total_entries')}</div>
            <div className="text-5xl font-serif italic text-ink leading-none">{totalEntries}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink/20 font-bold">{language === 'en' ? 'Virtue Coverage' : 'Cakupan Kebajikan'}</div>
            <div className="text-5xl font-serif italic text-ink leading-none">
              {Math.round((uniqueStrengthsCount / CHARACTER_STRENGTHS.length) * 100)}%
            </div>
          </div>
        </div>
      </header>

      {totalEntries === 0 ? (
        <div className="text-center py-32 glass-card rounded-[2rem] border-dashed border border-ink/10 bg-ink/[0.02]">
          <div className="w-16 h-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={24} className="text-accent/40" />
          </div>
          <h2 className="text-2xl font-serif italic text-ink/60 mb-2">{language === 'en' ? 'Awaiting Data' : 'Menunggu Data'}</h2>
          <p className="text-ink/40 max-w-xs mx-auto text-sm">{t('home_no_entries')}</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Top Strengths & Stats */}
          <div className="lg:col-span-7 space-y-12">
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-ink/5 pb-6">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-ink/20 flex items-center gap-3">
                  <Award size={16} /> {language === 'en' ? 'Dominant Virtues' : 'Kebajikan Dominan'}
                </h2>
              </div>
              
              <div className="grid gap-6">
                {topStrengths.map(([strength, count], index) => (
                  <motion.div
                    key={strength}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative flex items-center justify-between p-6 sm:p-10 rounded-[2.5rem] bg-ink/[0.02] hover:bg-accent hover:text-white transition-all duration-700 cursor-default border border-ink/5"
                  >
                    <div className="flex items-center gap-4 sm:gap-8">
                      <span className="text-4xl sm:text-6xl font-serif italic opacity-10 group-hover:opacity-30 transition-opacity">0{index + 1}</span>
                      <div>
                        <h3 className="text-2xl sm:text-4xl font-serif italic leading-none mb-2">{t(strengthToKey(strength))}</h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-30 group-hover:opacity-60 font-bold">{language === 'en' ? 'Primary Driver' : 'Penggerak Utama'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl sm:text-5xl font-serif italic leading-none mb-1">{count}</div>
                      <div className="text-[10px] uppercase tracking-[0.3em] opacity-30 group-hover:opacity-60 font-bold">{language === 'en' ? 'Utilized' : 'Digunakan'}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gold/[0.03] border border-gold/10 space-y-6">
                <div className="p-3 w-fit rounded-xl bg-gold/10 text-gold">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-serif italic text-accent leading-none mb-2">{uniqueStrengthsCount}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-ink/20">{language === 'en' ? 'Unique Strengths' : 'Kekuatan Unik'}</div>
                </div>
              </div>
              <div className="p-8 sm:p-10 rounded-[2.5rem] bg-accent/[0.03] border border-accent/10 space-y-6">
                <div className="p-3 w-fit rounded-xl bg-accent/10 text-accent">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-serif italic text-accent leading-none mb-2">
                    {Math.round(totalEntries / 7) || 1}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-ink/20">{language === 'en' ? 'Weekly Velocity' : 'Kecepatan Mingguan'}</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Full Distribution */}
          <div className="lg:col-span-5">
            <section className="sticky top-12 space-y-10 p-6 sm:p-10 rounded-[3rem] bg-ink/[0.01] border border-ink/5">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-ink/20 flex items-center gap-3">
                  <BarChart3 size={16} /> {t('insights_distribution')}
                </h2>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink/10">{language === 'en' ? 'All Time' : 'Seluruh Waktu'}</div>
              </div>

              <div className="space-y-8 max-h-[600px] overflow-y-auto pr-6 scrollbar-hide">
                {sortedStrengths.map(([strength, count]) => {
                  const percentage = (count / totalEntries) * 100;
                  return (
                    <div key={strength} className="group space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="font-serif italic text-2xl text-ink/60 group-hover:text-accent transition-colors">
                          {t(strengthToKey(strength))}
                        </span>
                        <span className="text-[11px] font-bold text-ink/20 uppercase tracking-[0.2em]">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-accent/20 group-hover:bg-accent transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-ink/5">
                <div className="flex items-center gap-3 text-ink/40">
                  <Heart size={14} className="text-accent/40" />
                  <p className="text-[10px] uppercase tracking-widest leading-relaxed">
                    {language === 'en' 
                      ? 'Your character is a composite of these virtues. Focus on the ones with lower frequency to achieve balance.'
                      : 'Karakter Anda adalah gabungan dari kebajikan-kebajikan ini. Fokuslah pada yang frekuensinya lebih rendah untuk mencapai keseimbangan.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
