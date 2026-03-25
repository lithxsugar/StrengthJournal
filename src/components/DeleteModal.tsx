import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message }: DeleteModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
            className="relative w-full max-w-md bg-paper p-8 rounded-3xl shadow-2xl border border-ink/5"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-ink/20 hover:text-ink transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Trash2 size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif italic text-ink">
                  {title || t('common_delete_confirm_title') || 'Delete Entry?'}
                </h2>
                <p className="text-ink/60 font-serif italic">
                  {message || t('common_delete_confirm') || 'Are you sure you want to delete this entry? This action cannot be undone.'}
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={onConfirm}
                  className="w-full h-14 bg-red-500 text-white rounded-2xl font-serif italic text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  {t('common_delete') || 'Delete'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full h-14 bg-ink/5 text-ink/60 rounded-2xl font-serif italic text-lg hover:bg-ink/10 transition-colors"
                >
                  {t('common_cancel')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
