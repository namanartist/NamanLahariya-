import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { useSiteData } from '../context/SiteContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface LiveAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveAssistant({ isOpen, onClose }: LiveAssistantProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const { siteData } = useSiteData();
  const [resumeData, setResumeData] = useState<any>({});

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const collections = ['projects', 'experience', 'education', 'skills', 'certifications'];
        const data: any = {};
        
        for (const col of collections) {
          const snapshot = await getDocs(collection(db, col));
          data[col] = snapshot.docs.map(doc => doc.data());
        }
        setResumeData(data);
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };
    
    fetchResumeData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      startSession();
    } else {
      stopSession();
    }
    return () => stopSession();
  }, [isOpen]);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Initialize Audio Context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Get User Media (Audio Only)
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (err) {
        throw new Error("Microphone access denied. Please allow permissions in your browser settings.");
      }
      
      mediaStreamRef.current = stream;
      
      // Initialize Gemini Live Session
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error("API Key missing. Please add VITE_GEMINI_API_KEY to your environment variables.");

      const ai = new GoogleGenAI({ apiKey });
      
      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
          },
          systemInstruction: `You are Naman Lahariya's personal AI assistant. 
          You are interacting with a user via a live audio feed.
          
          Naman's details:
          Name: ${siteData.name}
          Title: ${siteData.title}
          Bio: ${siteData.bio}
          Location: ${siteData.location}

          Resume Data:
          Projects: ${JSON.stringify(resumeData.projects || [])}
          Experience: ${JSON.stringify(resumeData.experience || [])}
          Education: ${JSON.stringify(resumeData.education || [])}
          Skills: ${JSON.stringify(resumeData.skills || [])}
          Certifications: ${JSON.stringify(resumeData.certifications || [])}
          
          CRITICAL: Speak with a natural, human-like pace and normal speed. Use pauses for emphasis. 
          Do not rush your words. Imagine you are having a relaxed, professional conversation.
          Keep responses concise but natural.`,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            nextStartTimeRef.current = audioContextRef.current!.currentTime;
            
            // Start sending audio chunks
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (!sessionRef.current) return;
              
              const inputData = e.inputBuffer.getChannelData(0);
              // Convert float32 to int16 PCM
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              
              // Convert to base64
              const base64Audio = btoa(
                String.fromCharCode(...new Uint8Array(pcmData.buffer))
              );
              
              sessionRef.current.sendRealtimeInput({
                media: { 
                  mimeType: "audio/pcm;rate=24000", 
                  data: base64Audio 
                }
              });
            };
            
            source.connect(processor);
            processor.connect(audioContextRef.current!.destination);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
              // Reset scheduling on interruption
              nextStartTimeRef.current = audioContextRef.current?.currentTime || 0;
              return;
            }
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              playAudioChunk(audioData);
            }
          },
          onclose: () => {
            setIsConnected(false);
            stopSession();
          },
          onerror: (err) => {
            console.error("Live Session Error:", err);
            stopSession();
          }
        }
      });
      
      sessionRef.current = session;

    } catch (error: any) {
      console.error("Failed to start live session:", error);
      setIsConnecting(false);
      setError(error.message || "Failed to connect. Please try again.");
    }
  };

  const playAudioChunk = (base64Audio: string) => {
    if (!audioContextRef.current) return;
    
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Data = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(int16Data.length);
    for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 0x7FFF;
    }
    
    const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
    buffer.getChannelData(0).set(float32Data);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    
    // Gain node for volume control
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    // Schedule playback
    const startTime = Math.max(audioContextRef.current.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;
  };

  const stopSession = () => {
    if (sessionRef.current) {
      // sessionRef.current.close(); // Close method might not exist on the promise wrapper, handled by disconnect
      sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-theme rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl relative"
          >
            {/* Visualizer / Avatar */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {/* Overlay UI */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {error ? (
                  <div className="flex flex-col items-center gap-4 p-6 bg-black/80 rounded-xl text-center max-w-xs mx-auto">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <X size={24} />
                    </div>
                    <p className="text-red-400 font-medium text-sm">{error}</p>
                    <button 
                      onClick={startSession}
                      className="px-4 py-2 bg-accent text-black rounded-full text-sm font-medium hover:bg-accent/90 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : isConnecting ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-accent font-medium">Connecting to Gemini Live...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-[0_0_30px_rgba(var(--accent),0.5)]">
                            <Mic size={32} className="text-black" />
                          </div>
                        </div>
                      </div>
                      {/* Sound waves animation */}
                      <div className="absolute inset-0 border-2 border-accent rounded-full animate-ping opacity-20" />
                      <div className="absolute inset-0 border-2 border-accent rounded-full animate-ping opacity-20 [animation-delay:0.5s]" />
                      <div className="absolute inset-0 border-2 border-accent rounded-full animate-ping opacity-20 [animation-delay:1s]" />
                    </div>
                    <p className="text-white/80 text-center max-w-xs font-medium">
                      Listening... Speak naturally to Naman's AI Assistant.
                    </p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls */}
            <div className="p-6 bg-card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-accent/10 text-accent'}`}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Session
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-muted" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 accent-accent"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
