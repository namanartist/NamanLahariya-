import { motion } from 'motion/react';
import { Github, Linkedin, Mail, MapPin, Download, ChevronDown } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import useSoundEffects from '../hooks/useSoundEffects';
import { useSiteData } from '../context/SiteContext';
import EditableField from './EditableField';

export default function Hero() {
  const { playSwoosh, playHover, playClick, playAppear } = useSoundEffects();
  const { siteData } = useSiteData();

  useEffect(() => {
    playSwoosh();
    // Play appear sound slightly delayed to match the text fade in
    setTimeout(() => playAppear(), 200);
  }, [playSwoosh, playAppear]);

  return (
    <div id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative inline-block"
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl mx-auto relative z-10 bg-[#1a1a1a]">
             <img 
               src={siteData.avatarUrl} 
               alt={siteData.name} 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
               onError={(e) => {
                 const target = e.currentTarget;
                 // Fallback to generic avatar if GitHub fails
                 target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(siteData.name)}&background=random`;
               }}
             />
          </div>
          {/* Decorative elements behind image */}
          <div className="absolute -top-4 -right-4 w-20 h-20 border border-accent/20 rounded-full z-0" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 border border-white/5 rounded-full z-0" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4"
        >
          Hi! I'm <EditableField field="name"><span className="text-accent italic">{siteData.name}</span></EditableField>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          <EditableField field="title" as="textarea" className="block mb-2">
            <span className="text-white font-medium">{siteData.title}</span>
          </EditableField>
          <EditableField field="bio" as="textarea" className="block">
            {siteData.bio}
          </EditableField>
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center gap-4">
            <SocialLink href={siteData.github} icon={<Github size={20} />} playHover={playHover} playClick={playClick} />
            <SocialLink href={siteData.linkedin} icon={<Linkedin size={20} />} playHover={playHover} playClick={playClick} />
            <SocialLink href={siteData.email} icon={<Mail size={20} />} playHover={playHover} playClick={playClick} />
          </div>
          
          <div className="h-px w-12 bg-white/10 hidden md:block" />
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="text-accent" />
            <EditableField field="location">
              <span>{siteData.location}</span>
            </EditableField>
          </div>

          <div className="h-px w-12 bg-white/10 hidden md:block" />

          <a 
            href={siteData.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all group"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            <span>Resume</span>
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
      >
        <ChevronDown size={24} />
      </motion.div>
    </div>
  );
}

function SocialLink({ href, icon, playHover, playClick }: { href: string; icon: ReactNode; playHover: () => void; playClick: () => void }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all duration-300"
      onMouseEnter={playHover}
      onClick={playClick}
    >
      {icon}
    </a>
  );
}
