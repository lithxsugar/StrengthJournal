import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, auth, db, doc, getDoc, setDoc, serverTimestamp } from './firebase';
import Home from './pages/Home';
import Auth from './pages/Auth';
import NewEntry from './pages/NewEntry';
import EntryDetail from './pages/EntryDetail';
import Strengths from './pages/Strengths';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Ensure user document exists in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
          });
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-paper">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-accent font-serif italic text-2xl"
        >
          Strengths Journal
        </motion.div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <SettingsProvider>
        <AuthContext.Provider value={{ user, loading }}>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
                <Route element={user ? <Layout /> : <Navigate to="/auth" />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/new" element={<NewEntry />} />
                  <Route path="/entry/:id" element={<EntryDetail />} />
                  <Route path="/strengths" element={<Strengths />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </Router>
        </AuthContext.Provider>
      </SettingsProvider>
    </LanguageProvider>
  );
}
