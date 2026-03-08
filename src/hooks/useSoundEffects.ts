import { useCallback, useEffect } from 'react';

// Singleton AudioContext to avoid exceeding browser limits
let sharedAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioContext = new AudioContextClass();
    }
  }
  return sharedAudioContext;
};

export default function useSoundEffects() {
  useEffect(() => {
    const ctx = getAudioContext();
    
    const resumeAudio = () => {
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    };

    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);
    document.addEventListener('touchstart', resumeAudio);

    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
    };
  }, []);

  const playHover = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio playHover failed:', e);
    }
  }, []);

  const playClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio playClick failed:', e);
    }
  }, []);

  const playAppear = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio playAppear failed:', e);
    }
  }, []);

  const playSwoosh = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      
      const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
    } catch (e) {
      console.warn('Audio playSwoosh failed:', e);
    }
  }, []);

  const playVaultUnlock = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const now = ctx.currentTime;

      // 1. Mechanical Whir (Rotation)
      const whirOsc = ctx.createOscillator();
      const whirGain = ctx.createGain();
      const whirFilter = ctx.createBiquadFilter();
      
      whirOsc.connect(whirFilter);
      whirFilter.connect(whirGain);
      whirGain.connect(ctx.destination);
      
      whirOsc.type = 'sawtooth';
      whirOsc.frequency.setValueAtTime(50, now);
      whirOsc.frequency.linearRampToValueAtTime(100, now + 1.5);
      
      whirFilter.type = 'lowpass';
      whirFilter.frequency.setValueAtTime(200, now);
      whirFilter.frequency.linearRampToValueAtTime(1000, now + 1.0);
      whirFilter.frequency.linearRampToValueAtTime(200, now + 2.0);

      whirGain.gain.setValueAtTime(0, now);
      whirGain.gain.linearRampToValueAtTime(0.1, now + 0.2);
      whirGain.gain.linearRampToValueAtTime(0.1, now + 1.8);
      whirGain.gain.linearRampToValueAtTime(0, now + 2.0);
      
      whirOsc.start(now);
      whirOsc.stop(now + 2.0);

      // 2. Clicks (Tumblers)
      const playClick = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(800, time);
        osc.type = 'square';
        
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        
        osc.start(time);
        osc.stop(time + 0.05);
      };

      // Sequence of clicks
      for(let i = 0; i < 8; i++) {
        playClick(now + 0.2 + (i * 0.25)); // Regular ticks
      }

      // 3. Heavy Unlock (Clunk + Success) at 2.2s
      const unlockTime = now + 2.2;
      
      // Low Thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      
      thudOsc.frequency.setValueAtTime(80, unlockTime);
      thudOsc.frequency.exponentialRampToValueAtTime(40, unlockTime + 0.3);
      
      thudGain.gain.setValueAtTime(0.3, unlockTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, unlockTime + 0.5);
      
      thudOsc.start(unlockTime);
      thudOsc.stop(unlockTime + 0.5);

      // High Ping/Chime
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(880, unlockTime);
      
      chimeGain.gain.setValueAtTime(0, unlockTime);
      chimeGain.gain.linearRampToValueAtTime(0.1, unlockTime + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, unlockTime + 1.5);
      
      chimeOsc.start(unlockTime);
      chimeOsc.stop(unlockTime + 1.5);
    } catch (e) {
      console.warn('Audio playVaultUnlock failed:', e);
    }
  }, []);

  const playSuccess = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      
      const now = ctx.currentTime;
      
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const startTime = now + i * 0.1;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
        
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {
      console.warn('Audio playSuccess failed:', e);
    }
  }, []);

  return { playHover, playClick, playSwoosh, playSuccess, playVaultUnlock, playAppear };
}
