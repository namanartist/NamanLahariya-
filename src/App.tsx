import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Loader from './components/Loader';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import CustomCursor from './components/CustomCursor';
import { SiteProvider } from './context/SiteContext';
import { ThemeProvider } from './context/ThemeContext';
import AIAssistant from './components/AIAssistant';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <SiteProvider>
        <CustomCursor />
        <AIAssistant />
        <Router>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" exit={{ opacity: 0 }}>
                <Loader onComplete={() => setLoading(false)} />
              </motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Home />} /> {/* For now, blog list is on home */}
                  <Route path="/blog/:id" element={<BlogPost />} />
                </Routes>
              </motion.div>
            )}
          </AnimatePresence>
        </Router>
        </SiteProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
