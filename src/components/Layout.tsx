import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, logout } from '../firebase';
import { Home, Plus, BookOpen, LogOut, User, BarChart3, Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const navItems = [
    { path: '/', icon: Home, label: t('nav_home') },
    { path: '/new', icon: Plus, label: t('nav_new') },
    { path: '/strengths', icon: BookOpen, label: t('nav_strengths') },
    { path: '/insights', icon: BarChart3, label: t('nav_insights') },
  ];

  return (
    <div className="min-h-screen bg-paper flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="relative z-50 bg-paper border-b border-ink/5 px-8 py-6 flex items-center justify-between">
        <Link to="/" className="font-serif italic text-3xl text-accent tracking-tighter">
          {t('auth_title')}
        </Link>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink/5 text-ink/60 hover:text-accent transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
          >
            <Languages size={14} />
            <span>{language === 'en' ? 'EN' : 'ID'}</span>
          </button>
          
          <Link 
            to="/profile"
            className="transition-transform hover:scale-105 active:scale-95"
          >
            {auth.currentUser?.photoURL ? (
              <img 
                src={auth.currentUser.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-ink/10 shadow-sm object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent aspect-square">
                <User size={20} />
              </div>
            )}
          </Link>
          <button 
            onClick={handleLogout}
            className="text-ink/30 hover:text-red-500 transition-colors"
            title={t('nav_logout')}
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-paper/95 backdrop-blur-xl border-t border-ink/5 px-10 py-6 flex justify-between items-center z-50 md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-accent scale-110' : 'text-ink/20 hover:text-ink/40'}`}
            >
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="nav-dot"
                  className="w-1.5 h-1.5 rounded-full bg-accent mt-1"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Navigation (Tablet/Desktop) */}
      <nav className="hidden md:flex fixed left-0 top-24 bottom-0 w-24 flex-col items-center py-12 gap-10 border-r border-ink/5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`p-4 rounded-[2rem] transition-all duration-500 ${isActive ? 'bg-accent text-white shadow-xl shadow-accent/30 scale-110' : 'text-ink/20 hover:text-ink/60 hover:bg-ink/5'}`}
            >
              <item.icon size={28} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
