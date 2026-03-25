import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db, doc, getDoc, updateDoc, auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { motion } from 'motion/react';
import { User, Save, CheckCircle, Type, Maximize, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { fontFamily, setFontFamily, fontSize, setFontSize } = useSettings();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setDisplayName(data.displayName || '');
        setPhotoURL(data.photoURL || '');
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;

    setLoading(true);
    try {
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        photoURL: photoURL.trim(),
      });

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
          photoURL: photoURL.trim(),
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (1MB limit)
    if (file.size > 1024 * 1024) {
      alert(t('prof_upload_hint'));
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const fontFamilies: { id: 'sans' | 'serif' | 'mono'; label: string }[] = [
    { id: 'sans', label: t('prof_font_sans') },
    { id: 'serif', label: t('prof_font_serif') },
    { id: 'mono', label: t('prof_font_mono') },
  ];

  const fontSizes: { id: 'small' | 'medium' | 'large'; label: string }[] = [
    { id: 'small', label: t('prof_size_small') },
    { id: 'medium', label: t('prof_size_medium') },
    { id: 'large', label: t('prof_size_large') },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto pb-24"
    >
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-accent mb-2">{t('prof_title')}</h1>
        <div className="h-1 w-20 bg-accent/20 rounded-full" />
      </header>

      <div className="space-y-8">
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4 border-2 border-accent/20 overflow-hidden aspect-square transition-transform group-hover:scale-105">
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover aspect-square" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={56} className="aspect-square" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-0 p-2.5 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 transition-all hover:scale-110 active:scale-95"
                  title={t('prof_upload_photo')}
                >
                  <Upload size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-ink/40 text-xs uppercase tracking-widest font-bold mt-2">{user?.email}</p>
              <p className="text-ink/20 text-[10px] mt-1">{t('prof_upload_hint')}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent/60 ml-1">
                  <User size={14} />
                  <label className="label-text">{t('prof_username')}</label>
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your name..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full premium-button flex items-center justify-center gap-3 mt-4"
            >
              {success ? <CheckCircle size={20} /> : <Save size={20} />}
              {loading ? t('new_saving') : success ? t('prof_success') : t('prof_save')}
            </button>
          </form>
        </div>

        {/* App Settings */}
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-accent/60">
              <Type size={18} />
              <h2 className="label-text">{t('prof_font_family')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {fontFamilies.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setFontFamily(font.id)}
                  className={`px-4 py-3 rounded-2xl text-sm transition-all border ${
                    fontFamily === font.id
                      ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                      : 'bg-white/50 text-ink/60 border-accent/5 hover:border-accent/20'
                  }`}
                  style={{ fontFamily: font.id === 'sans' ? 'Inter' : font.id === 'serif' ? 'Playfair Display' : 'JetBrains Mono' }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-accent/60">
              <Maximize size={18} />
              <h2 className="label-text">{t('prof_font_size')}</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setFontSize(size.id)}
                  className={`px-4 py-3 rounded-2xl transition-all border ${
                    fontSize === size.id
                      ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                      : 'bg-white/50 text-ink/60 border-accent/5 hover:border-accent/20'
                  } ${
                    size.id === 'small' ? 'text-xs' : size.id === 'medium' ? 'text-sm' : 'text-base'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
