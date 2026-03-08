import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, Download } from 'lucide-react';
import useSoundEffects from '../hooks/useSoundEffects';

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
            ? "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg w-full max-w-2xl" 
            : "bg-transparent w-full max-w-7xl"
        }`}
      >
        <a href="#" className="flex items-center" onClick={playClick} onMouseEnter={playHover}>
          <img src="/logo.svg" alt="NL." className="h-10 w-auto" />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-300 hover:text-accent transition-colors tracking-wide"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              {item.name}
            </a>
          ))}
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all group text-accent"
              onMouseEnter={playHover}
            >
              <span>Install App</span>
              <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
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
          className="absolute top-20 left-4 right-4 bg-[#121212] border border-white/10 rounded-2xl p-6 pointer-events-auto md:hidden flex flex-col gap-4 shadow-2xl"
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-lg font-medium text-gray-300 hover:text-accent text-center py-2"
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
          {deferredPrompt && (
            <button
              onClick={() => {
                handleInstallClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-lg font-medium transition-all group text-accent mt-2"
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
