import Section from './Section';
import { ExternalLink, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import useSoundEffects from '../hooks/useSoundEffects';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  demoLink: string;
  githubLink: string;
}

const categories = ['All Projects', 'Web Development', 'Graphic Design', 'Mobile Apps'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const { playHover, playClick, playAppear } = useSoundEffects();

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to fetch projects:', err));
  }, []);

  const filteredProjects = activeCategory === 'All Projects' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  // Play appear sound when category changes (and thus projects re-animate)
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    playClick();
    playAppear();
  };

  return (
    <Section id="projects">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">
            Featured <span className="text-accent italic">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-md">
            A selection of projects demonstrating my expertise in coding, mathematics, and problem-solving.
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            onMouseEnter={playHover}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              activeCategory === category
                ? 'bg-accent text-black border-accent'
                : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ 
                scale: 1.025,
                borderColor: "rgba(255, 215, 0, 0.5)",
                boxShadow: "0 10px 30px -10px rgba(255, 215, 0, 0.1)"
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative rounded-2xl overflow-hidden bg-[#121212] border border-white/5"
              onMouseEnter={playHover}
            >
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-accent text-xs font-mono uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <a href={project.githubLink} className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-accent transition-colors" onMouseEnter={playHover} onClick={playClick}>
                      <Github size={18} />
                    </a>
                    <a href={project.demoLink} className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-accent transition-colors" onMouseEnter={playHover} onClick={playClick}>
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-500 border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
