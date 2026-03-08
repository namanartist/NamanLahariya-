import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, Download, Sun, Moon } from 'lucide-react';
import useSoundEffects from '../hooks/useSoundEffects';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const { playHover, playClick, playAppear, playSwoosh } = useSoundEffects();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    playClick();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    playClick();
    if (newState) {
      playAppear();
    } else {
      playSwoosh();
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-40 flex justify-center pt-6 px-4 pointer-events-none`}
    >
      <div 
        className={`pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
          scrolled 
            ? "bg-card/80 backdrop-blur-md border border-theme shadow-lg w-full max-w-2xl" 
            : "bg-transparent w-full max-w-7xl"
        }`}
      >
        <a href="#" className="flex items-center" onClick={playClick} onMouseEnter={playHover}>
          <img src="/logo.svg" alt="NL." className={`h-10 w-auto transition-all ${theme === 'light' ? 'invert' : ''}`} />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted hover:text-accent transition-colors tracking-wide"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              {item.name}
            </a>
          ))}
          
          <button
            onClick={() => {
              toggleTheme();
              playClick();
            }}
            className="p-2 rounded-full bg-card hover:bg-black/5 dark:hover:bg-white/10 border border-theme text-muted hover:text-accent transition-all shadow-sm"
            onMouseEnter={playHover}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-black/5 dark:hover:bg-white/10 border border-theme rounded-full text-sm font-medium transition-all group text-accent shadow-sm"
              onMouseEnter={playHover}
            >
              <span>Install App</span>
              <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-4 right-4 bg-card border border-theme rounded-2xl p-6 pointer-events-auto md:hidden flex flex-col gap-4 shadow-2xl"
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-lg font-medium text-muted hover:text-accent text-center py-2"
              onClick={() => {
                setMobileMenuOpen(false);
                playClick();
                playSwoosh();
              }}
              onMouseEnter={playHover}
            >
              {item.name}
            </a>
          ))}
          
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                toggleTheme();
                playClick();
              }}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-background border border-theme text-muted hover:text-accent transition-all shadow-sm"
              onMouseEnter={playHover}
            >
              {theme === 'light' ? (
                <>
                  <Moon size={20} />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={20} />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          {deferredPrompt && (
            <button
              onClick={() => {
                handleInstallClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-theme rounded-xl text-lg font-medium transition-all group text-accent mt-2 shadow-sm"
              onMouseEnter={playHover}
            >
              <span>Install App</span>
              <Download size={20} />
            </button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
