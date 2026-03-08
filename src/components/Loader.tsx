import { motion, AnimatePresence } from 'motion/react';
import useSoundEffects from '../hooks/useSoundEffects';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const { playVaultUnlock, playClick, playHover } = useSoundEffects();
  const { theme, setTheme } = useTheme();
  const [status, setStatus] = useState("SYSTEM STANDBY");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    
    // Start sound sequence
    playVaultUnlock();

    // Text sequence
    setStatus("INITIALIZATION...");
    
    setTimeout(() => setStatus("AUTHENTICATING..."), 1000);
    setTimeout(() => {
      setStatus("ACCESS GRANTED");
      setIsUnlocked(true);
    }, 2200);
    setTimeout(onComplete, 3500);
  };

  const accentColor = theme === 'light' ? '#3b82f6' : '#FFD700'; // Blue for light, Gold for dark

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="relative flex items-center justify-center w-64 h-64 cursor-pointer" onClick={handleStart}>
        {/* Glow Effect on Unlock */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-accent rounded-full blur-[100px] z-0"
            />
          )}
        </AnimatePresence>

        {/* Ring 1: Outer Dashed */}
        <motion.div
          className="absolute w-64 h-64 border border-theme rounded-full"
          animate={{ rotate: hasStarted ? 360 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-accent/50" />
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-accent/50" />
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-1 bg-accent/50" />
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-1 bg-accent/50" />
        </motion.div>

        {/* Ring 2: Middle Counter-Rotate */}
        <motion.div
          className="absolute w-48 h-48 border-2 border-theme rounded-full border-t-accent border-b-accent/20"
          animate={isUnlocked ? { rotate: 0, scale: 1.1, borderColor: accentColor } : { rotate: hasStarted ? -360 : 0 }}
          transition={isUnlocked ? { duration: 0.5 } : { duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Ring 3: Inner Fast */}
        <motion.div
          className="absolute w-32 h-32 border border-dashed border-accent/40 rounded-full"
          animate={isUnlocked ? { rotate: 0, opacity: 0 } : { rotate: hasStarted ? 360 : 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Logo */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-20 h-20 bg-card rounded-full border border-accent/20"
          animate={isUnlocked ? { 
            boxShadow: `0 0 30px ${accentColor}80`,
            borderColor: accentColor,
            scale: 1.1
          } : {}}
        >
          <motion.span
            className="text-3xl font-serif font-bold text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            NL
          </motion.span>
        </motion.div>
      </div>
      
      {/* Status Text */}
      <div className="flex flex-col items-center gap-2 mt-12">
        <motion.div
          className="font-mono text-xs tracking-[0.3em] text-accent uppercase"
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {status}
        </motion.div>
        
        {!hasStarted && (
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] tracking-widest text-muted uppercase cursor-pointer"
              onClick={handleStart}
            >
              [ Click to Initialize ]
            </motion.div>

            {/* Theme Selector */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 p-1 bg-card border border-theme rounded-full shadow-sm"
            >
              <button
                onClick={() => { setTheme('light'); playClick(); }}
                onMouseEnter={playHover}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                  theme === 'light' ? 'bg-accent text-black' : 'text-muted hover:text-foreground'
                }`}
              >
                <Sun size={12} /> Light
              </button>
              <button
                onClick={() => { setTheme('dark'); playClick(); }}
                onMouseEnter={playHover}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                  theme === 'dark' ? 'bg-accent text-black' : 'text-muted hover:text-foreground'
                }`}
              >
                <Moon size={12} /> Dark
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
