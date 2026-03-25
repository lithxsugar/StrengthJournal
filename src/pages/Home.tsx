import { useState, useEffect, useMemo } from 'react';
import { db, collection, query, where, orderBy, onSnapshot, auth, handleFirestoreError, OperationType } from '../firebase';
import { JournalEntry, Quote, CHARACTER_STRENGTHS } from '../types';
import { format, isToday, isYesterday, subDays, startOfDay } from 'date-fns';
import { enUS, id } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Plus, Sparkles, Search, Filter, X, Flame, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getStrengthIcon } from '../constants';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { t, language, strengthToKey } = useLanguage();

  const dateLocale = language === 'en' ? enUS : id;

  const QUOTES: Quote[] = useMemo(() => [
    { text: t('quote_1'), author: 'Jim Rohn' },
    { text: t('quote_2'), author: 'Bob Marley' },
    { text: t('quote_3'), author: 'H. Jackson Brown Jr.' },
    { text: t('quote_4'), author: 'Heraclitus' },
    { text: t('quote_5'), author: 'Heraclitus' }
  ], [t]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'entries'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('date', 'desc')
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
  }, [language]);

  const dailyQuote = useMemo(() => {
    const today = startOfDay(new Date()).getTime();
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
    const dayOfYear = Math.floor((today - startOfYear) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }, [QUOTES]);

  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    
    const dateNumbers = entries.map(e => startOfDay(e.date.toDate()).getTime());
    const sortedDates = Array.from(new Set(dateNumbers))
      .sort((a: number, b: number) => b - a);
    
    let currentStreak = 0;
    let checkDate = startOfDay(new Date());

    // If no entry today, check if there was one yesterday to keep streak alive
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

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const strengths = entry.strengths || [];
      const matchesSearch = entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          strengths.some(s => t(strengthToKey(s)).toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = !selectedFilter || strengths.includes(selectedFilter);
      
      return matchesSearch && matchesFilter;
    });
  }, [entries, searchQuery, selectedFilter, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-accent"
        >
          <Sparkles size={32} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Quote of the Day */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 glass-card rounded-3xl border-accent/10 bg-accent/5 relative overflow-hidden"
      >
        <div className="absolute top-[-20%] right-[-5%] w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-accent/60">
            <Sparkles size={14} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{t('quote_label')}</span>
          </div>
          <p className="text-xl font-serif italic text-ink/80 leading-relaxed">
            "{dailyQuote.text}"
          </p>
          <p className="text-xs uppercase tracking-widest text-accent font-bold">— {dailyQuote.author}</p>
        </div>
      </motion.section>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-serif italic text-accent tracking-tighter">
              {t('nav_home')}
            </h1>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">
                <Flame size={14} fill="currentColor" />
                <span className="text-xs font-bold">{streak} {t('home_streak')}</span>
              </div>
            )}
          </div>
          <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold mt-2">
            {entries.length} {language === 'en' ? 'reflections recorded' : 'refleksi tercatat'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
            <input 
              type="text"
              placeholder={t('home_search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-ink/5 border border-transparent focus:border-accent/30 rounded-full outline-none transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full transition-all ${showFilters || selectedFilter ? 'bg-accent text-white' : 'bg-ink/5 text-ink/40 hover:bg-ink/10'}`}
          >
            <Filter size={20} />
          </button>
          <Link to="/new" className="hidden md:flex premium-button items-center gap-2 py-2">
            <Plus size={20} />
            {t('home_new_entry')}
          </Link>
        </div>
      </header>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-4 bg-ink/[0.02] rounded-2xl border border-ink/5">
              <button
                onClick={() => setSelectedFilter(null)}
                className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${!selectedFilter ? 'bg-accent text-white' : 'bg-ink/5 text-ink/40'}`}
              >
                {t('home_filter')}
              </button>
              {CHARACTER_STRENGTHS.map(strength => (
                <button
                  key={strength}
                  onClick={() => setSelectedFilter(strength)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${selectedFilter === strength ? 'bg-accent text-white' : 'bg-ink/5 text-ink/40'}`}
                >
                  {t(strengthToKey(strength))}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-3xl border-dashed border-2 border-ink/10">
          <Sparkles size={48} className="mx-auto text-accent/20 mb-6" />
          <h2 className="text-2xl font-serif italic text-ink/60 mb-2">
            {searchQuery || selectedFilter ? (language === 'en' ? 'No matching entries' : 'Tidak ada entri yang cocok') : t('home_no_entries')}
          </h2>
          <p className="text-ink/40 mb-8">
            {searchQuery || selectedFilter ? (language === 'en' ? 'Try adjusting your search or filters.' : 'Coba sesuaikan pencarian atau filter Anda.') : ''}
          </p>
          {!searchQuery && !selectedFilter && (
            <Link to="/new" className="premium-button inline-flex items-center gap-2">
              <Plus size={20} />
              {t('home_new_entry')}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/entry/${entry.id}`}
                  className="block glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 group border border-ink/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.02] rounded-full blur-3xl group-hover:bg-accent/[0.05] transition-colors" />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-2xl bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                          <Calendar size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink/30 group-hover:text-accent/60 transition-colors">
                            {format(entry.date.toDate(), 'EEEE', { locale: dateLocale })}
                          </span>
                          <span className="text-xs uppercase tracking-widest font-bold text-ink/50">
                            {format(entry.date.toDate(), 'd MMMM yyyy', { locale: dateLocale })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-3xl font-serif italic text-ink group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                          {entry.action}
                        </h3>
                        {entry.place && (
                          <div className="flex items-center gap-2 text-ink/30 text-[10px] uppercase tracking-widest font-bold">
                            <MapPin size={12} />
                            {entry.place}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {entry.strengths?.map(strength => {
                          const Icon = getStrengthIcon(strength);
                          return (
                            <span key={strength} className="px-3 py-1 rounded-full bg-gold/5 text-gold/60 border border-gold/10 text-[10px] uppercase tracking-widest font-bold group-hover:bg-gold/10 group-hover:text-gold transition-colors flex items-center gap-1.5">
                              <Icon size={10} />
                              {t(strengthToKey(strength))}
                            </span>
                          );
                        })}
                        {entry.time && (
                          <span className="px-3 py-1 rounded-full bg-ink/5 text-ink/30 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                            <Clock size={10} />
                            {(() => {
                              const [h, m] = entry.time.split(':');
                              const hours = parseInt(h);
                              const ampm = hours >= 12 ? 'PM' : 'AM';
                              const displayHours = hours % 12 || 12;
                              return `${displayHours}:${m} ${ampm}`;
                            })()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center self-stretch pl-6 border-l border-ink/5 group-hover:border-accent/10 transition-colors">
                      <div className="text-ink/10 group-hover:text-accent group-hover:translate-x-1 transition-all duration-500">
                        <ChevronRight size={32} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <Link 
        to="/new" 
        className="md:hidden fixed bottom-28 right-6 w-16 h-16 bg-accent text-white rounded-full shadow-2xl shadow-accent/40 flex items-center justify-center z-[60] hover:scale-110 active:scale-95 transition-all"
      >
        <Plus size={32} />
      </Link>
    </div>
  );
}
