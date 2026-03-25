import { useState } from 'react';
import { loginWithGoogle } from '../firebase';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(`Login Error: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-paper flex flex-col items-center justify-center p-8 overflow-y-auto relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold/5 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-xl w-full text-center z-10 py-12"
      >
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif italic text-accent mb-6 tracking-tighter leading-none">
          {t('auth_title')}
        </h1>
        <p className="text-ink/30 font-sans tracking-[0.4em] uppercase text-[10px] font-bold mb-8 md:mb-16">
          {t('auth_subtitle')}
        </p>

        <div className="space-y-8 md:space-y-12">
          <div className="p-8 md:p-12 glass-card rounded-[3rem] border border-ink/5 shadow-2xl shadow-accent/5">
            <p className="text-serif italic text-xl md:text-3xl text-ink/70 mb-8 md:mb-12 leading-relaxed">
              "{t('quote_1')}"
            </p>
            
            {error && (
              <p className="text-red-500 text-sm mb-6 font-sans font-medium">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full premium-button flex items-center justify-center gap-4 h-16 md:h-20 text-xl md:text-2xl"
            >
              <LogIn size={28} />
              {loading ? t('common_saving') : t('auth_button')}
            </button>
          </div>

          <p className="text-[10px] text-ink/20 uppercase tracking-[0.3em] font-bold">
            {t('quote_footer')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
