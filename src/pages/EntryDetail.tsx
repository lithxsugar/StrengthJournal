import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, updateDoc, deleteDoc, handleFirestoreError, OperationType } from '../firebase';
import { JournalEntry, VIRTUES } from '../types';
import { format } from 'date-fns';
import { enUS, id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Save, Trash2, Sparkles, Calendar, Clock, MapPin, AlertCircle, X, ChevronDown, BookOpen } from 'lucide-react';
import TimePicker from '../components/TimePicker';
import DeleteModal from '../components/DeleteModal';
import { useLanguage } from '../contexts/LanguageContext';
import { getStrengthIcon } from '../constants';

export default function EntryDetail() {
  const { id: entryId } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedVirtue, setExpandedVirtue] = useState<string | null>("Wisdom");
  const [error, setError] = useState<string | null>(null);
  const { t, language, strengthToKey } = useLanguage();
  const [formData, setFormData] = useState<Partial<JournalEntry>>({});

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

  const dateLocale = language === 'en' ? enUS : id;

  useEffect(() => {
    const fetchEntry = async () => {
      if (!entryId) return;
      try {
        const docRef = doc(db, 'entries', entryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as JournalEntry;
          setEntry(data);
          setFormData(data);
        } else {
          navigate('/');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `entries/${entryId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [entryId, navigate, language]);

  const handleUpdate = async () => {
    if (!entryId || !entry) return;
    if (formData.strengths && formData.strengths.length === 0) {
      setError(t('new_entry_strengths_error'));
      return;
    }

    setError(null);

    setSaving(true);
    try {
      await updateDoc(doc(db, 'entries', entryId), formData);
      setEntry({ ...entry, ...formData } as JournalEntry);
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `entries/${entryId}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entryId) return;
    try {
      await deleteDoc(doc(db, 'entries', entryId));
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `entries/${entryId}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleStrength = (strength: string) => {
    setFormData(prev => {
      const strengths = prev.strengths?.includes(strength)
        ? prev.strengths.filter(s => s !== strength)
        : [...(prev.strengths || []), strength];
      return { ...prev, strengths };
    });
  };

  const formatTimeDisplay = (time: string) => {
    if (!time) return t('new_entry_set_time') || 'Set Time';
    const [h, m] = time.split(':');
    const hours = parseInt(h);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${m} ${ampm}`;
  };

  if (loading) return null;
  if (!entry) return <div className="text-center py-24 font-serif italic text-ink/60">{language === 'en' ? 'Entry not found' : 'Entri tidak ditemukan'}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-ink/40 hover:text-accent transition-colors"
        >
          <div className="p-2 rounded-full group-hover:bg-accent/5 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{t('common_back') || 'Back'}</span>
        </button>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-accent font-serif italic text-lg hover:opacity-70 transition-opacity"
          >
            {isEditing ? t('common_cancel') : t('common_edit')}
          </button>
          {!isEditing && (
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-full hover:bg-red-50 text-red-400/60 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 pb-32"
      >
        {/* Hero Section: Strengths & Date */}
        <section className="relative min-h-[40vh] flex flex-col items-center justify-center text-center p-8 rounded-[3rem] bg-accent/5 border border-accent/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent-rgb),0.05),transparent_70%)]" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 space-y-8 max-w-2xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/50 backdrop-blur-sm text-accent border border-accent/10 shadow-sm"
            >
              <Calendar size={14} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                {format(entry.date.toDate(), 'EEEE, d MMMM yyyy', { locale: dateLocale })}
              </span>
            </motion.div>
            
            {isEditing ? (
              <div className="space-y-6 p-8 glass-card rounded-3xl border-gold/20 bg-white/80 text-left shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 text-gold">
                    <Sparkles size={20} />
                    <label className="label-text text-gold">{t('new_entry_strengths')}</label>
                  </div>
                </div>
                
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-500 text-sm font-serif italic border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  {Object.entries(VIRTUES).map(([virtue, strengths]) => (
                    <div key={virtue} className="border-b border-gold/10 pb-4 last:border-0">
                      <button
                        type="button"
                        onClick={() => setExpandedVirtue(expandedVirtue === virtue ? null : virtue)}
                        className="w-full flex items-center justify-between py-2 text-left group"
                      >
                        <span className="font-serif italic text-xl text-accent group-hover:opacity-70">{t(virtueToKey(virtue))}</span>
                        <ChevronDown 
                          size={16} 
                          className={`text-gold transition-transform ${expandedVirtue === virtue ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {expandedVirtue === virtue && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-2 pt-4">
                              {strengths.map(strength => {
                                const Icon = getStrengthIcon(strength);
                                return (
                                  <button
                                    key={strength}
                                    type="button"
                                    onClick={() => toggleStrength(strength)}
                                    className={`px-4 py-2 rounded-full text-sm font-serif italic transition-all border flex items-center gap-2 ${
                                      formData.strengths?.includes(strength)
                                        ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                                        : 'bg-white text-ink/60 border-ink/5 hover:border-accent/20'
                                    }`}
                                  >
                                    <Icon size={14} />
                                    {t(strengthToKey(strength))}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {(entry.strengths || []).map((s, i) => {
                  const Icon = getStrengthIcon(s);
                  return (
                    <motion.div 
                      key={s}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="text-accent/20">
                        <Icon size={24} />
                      </div>
                      <h1 className="text-5xl md:text-8xl font-serif italic text-accent tracking-tighter leading-none">
                        {t(strengthToKey(s))}{i < (entry.strengths?.length || 0) - 1 ? ',' : ''}
                      </h1>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Reflection Card */}
          <section className="md:col-span-8 p-10 rounded-[2.5rem] bg-white border border-ink/5 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-gold/5 select-none pointer-events-none">
              <BookOpen size={120} strokeWidth={0.5} />
            </div>
            
            <div className="flex items-center gap-3 text-ink/20">
              <Sparkles size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('new_entry_action')}</span>
            </div>
            
            {isEditing ? (
              <textarea 
                name="action"
                value={formData.action}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 text-3xl font-serif italic text-ink min-h-[300px] resize-none p-0"
                placeholder={t('new_entry_action_placeholder')}
              />
            ) : (
              <div className="relative">
                <p className="text-3xl md:text-4xl font-serif italic text-ink leading-[1.5] relative z-10">
                  {entry.action}
                </p>
              </div>
            )}
          </section>

          {/* Context Sidebar */}
          <div className="md:col-span-4 space-y-8">
            {/* Time & Place Card */}
            <section className="p-8 rounded-[2.5rem] bg-accent text-white shadow-xl shadow-accent/20 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 opacity-40">
                  <Clock size={16} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('new_entry_time')}</span>
                </div>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(true)}
                    className="text-3xl font-serif italic hover:opacity-70 transition-opacity text-left"
                  >
                    {formatTimeDisplay(formData.time || '')}
                  </button>
                ) : (
                  <p className="text-3xl font-serif italic">{formatTimeDisplay(entry.time || '')}</p>
                )}
              </div>

              <div className="w-full h-px bg-white/10" />

              <div className="space-y-6">
                <div className="flex items-center gap-3 opacity-40">
                  <MapPin size={16} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('new_entry_place')}</span>
                </div>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:ring-0 text-2xl font-serif italic p-0 placeholder:text-white/20"
                    placeholder={t('new_entry_place_placeholder')}
                  />
                ) : (
                  <p className="text-2xl font-serif italic">{entry.place || '—'}</p>
                )}
              </div>
            </section>

            {/* Quick Stats/Meta */}
            <section className="p-8 rounded-[2.5rem] bg-ink/5 border border-ink/5 flex flex-col items-center justify-center text-center space-y-2">
              <div className="text-4xl font-serif italic text-accent">
                {entry.strengths?.length || 0}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-ink/30">
                {language === 'en' ? 'Strengths Applied' : 'Kekuatan Diterapkan'}
              </div>
            </section>
          </div>

          {/* Bottom Insights Row */}
          <section className="md:col-span-6 p-10 rounded-[2.5rem] bg-red-500/[0.03] border border-red-500/10 space-y-6">
            <div className="flex items-center gap-3 text-red-500/40">
              <AlertCircle size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('new_entry_obstacles')}</span>
            </div>
            {isEditing ? (
              <textarea 
                name="obstacles"
                value={formData.obstacles}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 text-xl font-serif italic text-ink/70 min-h-[150px] resize-none p-0"
                placeholder={t('new_entry_obstacles_placeholder')}
              />
            ) : (
              <p className="text-xl font-serif italic text-ink/70 leading-relaxed">{entry.obstacles || '—'}</p>
            )}
          </section>

          <section className="md:col-span-6 p-10 rounded-[2.5rem] bg-gold/5 border border-gold/10 space-y-6">
            <div className="flex items-center gap-3 text-gold/60">
              <Sparkles size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('new_entry_opportunities')}</span>
            </div>
            {isEditing ? (
              <textarea 
                name="opportunities"
                value={formData.opportunities}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 text-xl font-serif italic text-ink/70 min-h-[150px] resize-none p-0"
                placeholder={t('new_entry_opportunities_placeholder')}
              />
            ) : (
              <p className="text-xl font-serif italic text-ink/70 leading-relaxed">{entry.opportunities || '—'}</p>
            )}
          </section>
        </div>

        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-12"
          >
            <button 
              onClick={handleUpdate}
              disabled={saving}
              className="w-full premium-button flex items-center justify-center gap-4 h-24 text-2xl"
            >
              {saving ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={24} />
                </motion.div>
              ) : (
                <Save size={24} />
              )}
              {saving ? t('common_saving') : t('common_save')}
            </button>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showTimePicker && (
          <TimePicker 
            value={formData.time || '12:00'}
            onChange={(time) => setFormData(prev => ({ ...prev, time }))}
            onClose={() => setShowTimePicker(false)}
          />
        )}
      </AnimatePresence>

      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
