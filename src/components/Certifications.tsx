import Section from './Section';
import { Award, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import useSoundEffects from '../hooks/useSoundEffects';

interface Certification {
  id: number;
  title: string;
  issuer: string;
  link: string;
}

import { initialCertifications } from '../data/initialData';

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { playHover, playClick } = useSoundEffects();

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCertifications(data);
        } else {
          setCertifications(initialCertifications);
        }
      })
      .catch(err => {
        console.error('Failed to fetch certifications, using fallback:', err);
        setCertifications(initialCertifications);
      });
  }, []);

  return (
    <Section id="certifications">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">
          My <span className="text-accent italic">Certifications</span>
        </h2>
        <p className="text-muted max-w-md">
          Professional certifications and achievements demonstrating my commitment to continuous learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, index) => (
          <motion.a
            key={cert.id}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-6 rounded-2xl bg-card border border-theme hover:border-accent/30 transition-all duration-300 flex flex-col justify-between h-full shadow-sm"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                {cert.title}
              </h3>
              <p className="text-muted text-sm mb-4">
                Issued by {cert.issuer}
              </p>
            </div>
            <div className="flex items-center text-sm text-accent font-medium gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              View Certificate <ExternalLink size={14} />
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
