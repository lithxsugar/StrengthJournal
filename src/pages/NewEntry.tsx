import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc, serverTimestamp, auth, Timestamp, handleFirestoreError, OperationType } from '../firebase';
import { CHARACTER_STRENGTHS, VIRTUES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Save, Sparkles, X, Clock, ChevronDown } from 'lucide-react';
import TimePicker from '../components/TimePicker';
import { useLanguage } from '../contexts/LanguageContext';
import { getStrengthIcon } from '../constants';

export default function NewEntry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [expandedVirtue, setExpandedVirtue] = useState<string | null>("Wisdom");
  const [error, setError] = useState<string | null>(null);
  const { t, strengthToKey, language } = useLanguage();
  const [formData, setFormData] = useState({
    action: '',
    time: formatTime(new Date()),
    place: '',
    obstacles: '',
    opportunities: '',
    strengths: [] as string[],
    date: new Date().toISOString().split('T')[0],
  });

  function formatTime(date: Date) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (formData.strengths.length === 0) {
      setError(t('new_entry_strengths_error'));
      return;
    }

    setError(null);

    setLoading(true);
    try {
      const entryData = {
        userId: auth.currentUser.uid,
        date: Timestamp.fromDate(new Date(formData.date)),
        action: formData.action,
        time: formData.time,
        place: formData.place,
        obstacles: formData.obstacles,
        opportunities: formData.opportunities,
        strengths: formData.strengths,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'entries'), entryData);
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'entries');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleStrength = (strength: string) => {
    setFormData(prev => {
      const strengths = prev.strengths.includes(strength)
        ? prev.strengths.filter(s => s !== strength)
        : [...prev.strengths, strength];
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

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-ink/5 transition-colors text-ink/40"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-serif italic text-accent tracking-tighter">
          {t('new_entry_title')}
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <form onSubmit={handleSubmit} className="space-y-12 pb-24">
        {/* Date Section */}
        <section className="space-y-4">
          <label className="label-text">{t('new_entry_date') || 'Date of Action'}</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </section>

        {/* Action Section */}
        <section className="space-y-4">
          <label className="label-text">{t('new_entry_action')}</label>
          <textarea 
            name="action"
            value={formData.action}
            onChange={handleChange}
            required
            placeholder={t('new_entry_action_placeholder')}
            className="input-field min-h-[100px] resize-none"
          />
        </section>

        {/* Context Section */}
        <div className="grid md:grid-cols-2 gap-12">
          <section className="space-y-4">
            <label className="label-text">{t('new_entry_time')}</label>
            <button
              type="button"
              onClick={() => setShowTimePicker(true)}
              className="w-full flex items-center justify-between p-4 bg-ink/5 rounded-2xl border border-transparent hover:border-accent/20 transition-all text-left"
            >
              <span className="text-2xl font-serif italic text-accent">
                {formatTimeDisplay(formData.time)}
              </span>
              <Clock className="text-accent/40" size={20} />
            </button>
          </section>
          <section className="space-y-4">
            <label className="label-text">{t('new_entry_place')}</label>
            <input 
              type="text" 
              name="place"
              value={formData.place}
              onChange={handleChange}
              placeholder={t('new_entry_place_placeholder')}
              className="input-field"
            />
          </section>
        </div>

        {/* Challenges & Opportunities */}
        <div className="grid md:grid-cols-2 gap-12">
          <section className="space-y-4">
            <label className="label-text">{t('new_entry_obstacles')}</label>
            <textarea 
              name="obstacles"
              value={formData.obstacles}
              onChange={handleChange}
              placeholder={t('new_entry_obstacles_placeholder')}
              className="input-field min-h-[100px] resize-none"
            />
          </section>
          <section className="space-y-4">
            <label className="label-text">{t('new_entry_opportunities')}</label>
            <textarea 
              name="opportunities"
              value={formData.opportunities}
              onChange={handleChange}
              placeholder={t('new_entry_opportunities_placeholder')}
              className="input-field min-h-[100px] resize-none"
            />
          </section>
        </div>

        {/* Strength Section */}
        <section className="space-y-6 p-8 glass-card rounded-3xl border-gold/20 bg-gold/5">
          <div className="flex items-center gap-3 text-gold">
            <Sparkles size={20} />
            <label className="label-text text-gold">{t('new_entry_strengths')}</label>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl bg-red-50 text-red-500 text-sm font-serif italic border border-red-100"
            >
              {error}
            </motion.div>
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
                                formData.strengths.includes(strength)
                                  ? 'bg-accent text-white border-accent'
                                  : 'bg-white/50 text-ink/60 border-ink/5 hover:border-accent/20'
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
          
          <p className="text-xs text-ink/40 italic">
            {t('new_entry_strengths_help') || 'Select one or more strengths you embodied during this action.'}
          </p>
        </section>

        <div className="pt-8">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full premium-button flex items-center justify-center gap-3 h-16"
          >
            <Save size={24} />
            {loading ? t('common_saving') : t('common_save')}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showTimePicker && (
          <TimePicker 
            value={formData.time}
            onChange={(time) => setFormData(prev => ({ ...prev, time }))}
            onClose={() => setShowTimePicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
