import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function TimePicker({ value, onChange, onClose }: TimePickerProps) {
  const [hours, setHours] = useState(value ? parseInt(value.split(':')[0]) : 12);
  const [minutes, setMinutes] = useState(value ? parseInt(value.split(':')[1]) : 0);
  const [ampm, setAmpm] = useState(value ? (parseInt(value.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'AM');
  const { t } = useLanguage();

  const handleSave = () => {
    let h = hours;
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const formattedTime = `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onChange(formattedTime);
    onClose();
  };

  const adjustHours = (delta: number) => {
    setHours(prev => {
      let next = prev + delta;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };

  const adjustMinutes = (delta: number) => {
    setMinutes(prev => {
      let next = prev + delta;
      if (next > 59) return 0;
      if (next < 0) return 59;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xs bg-paper p-8 rounded-3xl shadow-2xl border border-ink/5"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Clock className="text-accent" size={20} />
          <h2 className="text-xl font-serif italic text-accent">{t('new_entry_time')}</h2>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Hours */}
          <div className="flex flex-col items-center gap-2">
            <button onClick={() => adjustHours(1)} className="p-2 text-ink/20 hover:text-accent transition-colors">
              <ChevronUp size={24} />
            </button>
            <div className="text-4xl font-serif italic text-ink w-16 text-center bg-ink/5 py-4 rounded-2xl">
              {hours.toString().padStart(2, '0')}
            </div>
            <button onClick={() => adjustHours(-1)} className="p-2 text-ink/20 hover:text-accent transition-colors">
              <ChevronDown size={24} />
            </button>
          </div>

          <div className="text-4xl font-serif italic text-ink/20 self-center mb-2">:</div>

          {/* Minutes */}
          <div className="flex flex-col items-center gap-2">
            <button onClick={() => adjustMinutes(1)} className="p-2 text-ink/20 hover:text-accent transition-colors">
              <ChevronUp size={24} />
            </button>
            <div className="text-4xl font-serif italic text-ink w-16 text-center bg-ink/5 py-4 rounded-2xl">
              {minutes.toString().padStart(2, '0')}
            </div>
            <button onClick={() => adjustMinutes(-1)} className="p-2 text-ink/20 hover:text-accent transition-colors">
              <ChevronDown size={24} />
            </button>
          </div>

          {/* AM/PM */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setAmpm('AM')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${ampm === 'AM' ? 'bg-accent text-white' : 'bg-ink/5 text-ink/40'}`}
            >
              AM
            </button>
            <button 
              onClick={() => setAmpm('PM')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${ampm === 'PM' ? 'bg-accent text-white' : 'bg-ink/5 text-ink/40'}`}
            >
              PM
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 rounded-2xl bg-ink/5 text-ink/60 font-serif italic">
            {t('common_cancel')}
          </button>
          <button onClick={handleSave} className="py-3 rounded-2xl bg-accent text-white font-serif italic">
            {t('common_save')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
