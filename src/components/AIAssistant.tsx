import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Mail, MessageSquare as MessageIcon, Phone } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import useSoundEffects from '../hooks/useSoundEffects';
import { useSiteData } from '../context/SiteContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Naman's AI Assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick, playAppear, playSwoosh } = useSoundEffects();
  const { siteData } = useSiteData();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendInterestToNaman = async (args: { clientName: string, clientEmail: string, interestDetails: string }) => {
    try {
      const response = await fetch('/api/ai/send-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      const data = await response.json();
      
      return {
        message: `${data.message}\n\nNaman has been notified of your interest.`,
        whatsappUrl: null
      };
    } catch (error) {
      console.error("Error sending interest:", error);
      return { message: "Failed to send interest. Please try again later.", whatsappUrl: null };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    playClick();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const tools = [
        {
          functionDeclarations: [
            {
              name: "sendInterestToNaman",
              description: "Sends a client's interest, name, and email directly to Naman Lahariya's inbox.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  clientName: { type: Type.STRING, description: "The name of the client or person interested." },
                  clientEmail: { type: Type.STRING, description: "The email address of the client." },
                  interestDetails: { type: Type.STRING, description: "Details about the project, hiring, or collaboration interest." }
                },
                required: ["clientName", "clientEmail", "interestDetails"]
              }
            }
          ]
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are the personal AI Assistant for Naman Lahariya. 
            Naman's details:
            Name: ${siteData.name}
            Title: ${siteData.title}
            Bio: ${siteData.bio}
            Location: ${siteData.location}
            Email: namanalahariya@gmail.com
            
            Your goal is to help visitors learn about Naman and connect them with him. 
            Be professional, friendly, and helpful. 
            
            IMPORTANT: If a user expresses interest in hiring, collaborating, or working with Naman, you MUST ask for their name and email if they haven't provided it, and then call the 'sendInterestToNaman' function to send their details to Naman.
            
            Current conversation:
            ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
            user: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "You are Naman Lahariya's personal AI assistant. Keep responses concise and helpful. Use the sendInterestToNaman tool when a user wants to connect or hire Naman.",
          tools: tools
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === "sendInterestToNaman") {
            const result = await sendInterestToNaman(call.args as any);
            setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
          }
        }
      } else {
        const aiText = response.text || "I'm sorry, I'm having trouble connecting right now. Please try again later or contact Naman directly.";
        setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error. Please contact Naman directly at namanalahariya@gmail.com." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-card border border-theme rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-theme bg-accent/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Naman's Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-muted uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setIsOpen(false); playSwoosh(); }}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent text-black rounded-tr-none' 
                      : 'bg-background border border-theme rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-background border border-theme p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-theme bg-background/50">
              <button 
                onClick={() => {
                  window.location.href = "mailto:namanalahariya@gmail.com";
                  playClick();
                }}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
              >
                <Mail size={12} /> Email Naman
              </button>
              <a 
                href="https://mail.google.com/chat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium hover:bg-blue-500/20 transition-colors"
                onClick={playClick}
              >
                <MessageSquare size={12} /> Gmail Chat
              </a>
              <button 
                onClick={() => {
                  window.open("https://mail.google.com", "_blank");
                  playClick();
                }}
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition-colors"
              >
                <Mail size={12} /> Gmail
              </button>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-theme bg-background">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-card border border-theme rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent text-black rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); playAppear(); }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-red-500 text-white rotate-90' : 'bg-accent text-black'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
