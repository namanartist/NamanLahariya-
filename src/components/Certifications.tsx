import Section from './Section';
import { motion } from 'motion/react';
import { Award, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Certification {
  id: number;
  title: string;
  issuer: string;
  link: string;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => res.json())
      .then(data => setCertifications(data))
      .catch(err => console.error('Failed to fetch certifications:', err));
  }, []);

  return (
    <Section id="certifications" className="relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
          My <span className="text-accent italic">Certifications</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Professional certifications and job simulations I've completed to enhance my skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {certifications.map((cert, index) => (
          <motion.a
            key={cert.id}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex items-center gap-6 p-6 rounded-2xl bg-[#121212] border border-white/5 hover:border-accent/30 transition-all duration-300 group"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300 shrink-0">
              <Award size={32} />
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-1">
                {cert.title}
              </h3>
              <p className="text-gray-400 text-sm">{cert.issuer}</p>
            </div>

            <ExternalLink size={20} className="text-gray-600 group-hover:text-accent transition-colors" />
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
