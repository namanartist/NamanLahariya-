import Section from './Section';
import { Code2, Database, Layout, Terminal, Cpu, Brain, Users, MessageSquare, Lightbulb, Clock } from 'lucide-react';
import { ReactNode } from 'react';
import { motion } from 'motion/react';
import useSoundEffects from '../hooks/useSoundEffects';

export default function Skills() {
  return (
    <Section id="skills" className="relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
          Skills & <span className="text-accent italic">Expertise</span>
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          A comprehensive toolkit of technical proficiencies and professional attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <SkillCard 
          title="Languages" 
          icon={<Code2 className="text-accent" size={24} />}
          skills={['C++', 'JavaScript', 'Java', 'Python']}
          delay={0}
        />
        <SkillCard 
          title="Frontend" 
          icon={<Layout className="text-blue-500 dark:text-blue-400" size={24} />}
          skills={['HTML5', 'CSS3', 'React', 'Tailwind CSS']}
          delay={0.1}
        />
        <SkillCard 
          title="Backend" 
          icon={<Database className="text-green-600 dark:text-green-400" size={24} />}
          skills={['Node.js', 'Express', 'SQL', 'MongoDB']}
          delay={0.2}
        />
        <SkillCard 
          title="Tools" 
          icon={<Terminal className="text-purple-600 dark:text-purple-400" size={24} />}
          skills={['Git', 'GitHub', 'VS Code', 'Postman']}
          delay={0.3}
        />
        <SkillCard 
          title="Core Concepts" 
          icon={<Cpu className="text-red-600 dark:text-red-400" size={24} />}
          skills={['Data Structures', 'Algorithms', 'OOPs', 'DBMS']}
          delay={0.4}
        />
        <SkillCard 
          title="Specialization" 
          icon={<Brain className="text-yellow-700 dark:text-yellow-600" size={24} />}
          skills={['Mathematics', 'Computing', 'Optimization', 'Problem Solving']}
          delay={0.5}
        />
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-serif font-bold mb-8 text-center">Soft Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SoftSkillCard icon={<Users size={20} />} title="Leadership" />
          <SoftSkillCard icon={<MessageSquare size={20} />} title="Communication" />
          <SoftSkillCard icon={<Lightbulb size={20} />} title="Creativity" />
          <SoftSkillCard icon={<Clock size={20} />} title="Time Management" />
        </div>
      </div>
    </Section>
  );
}

function SkillCard({ title, icon, skills, delay }: { title: string; icon: ReactNode; skills: string[], delay: number }) {
  const { playAppear, playHover } = useSoundEffects();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onAnimationStart={() => playAppear()}
      onMouseEnter={playHover}
      className="p-6 rounded-2xl bg-card border border-theme hover:border-accent/30 transition-all duration-300 group hover:-translate-y-1 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-white/5 dark:bg-white/5 group-hover:bg-black/5 dark:group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span key={skill} className="px-3 py-1 text-xs rounded-full bg-white/5 dark:bg-white/5 text-muted border border-theme group-hover:border-accent/20 transition-colors">
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function SoftSkillCard({ icon, title }: { icon: ReactNode; title: string }) {
  const { playHover } = useSoundEffects();
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      onMouseEnter={playHover}
      className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-theme hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-center gap-3 shadow-sm"
    >
      <div className="text-accent">{icon}</div>
      <span className="font-medium text-sm text-muted">{title}</span>
    </motion.div>
  );
}
