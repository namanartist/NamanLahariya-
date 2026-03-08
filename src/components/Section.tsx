import { motion } from 'motion/react';
import { ReactNode } from 'react';
import useSoundEffects from '../hooks/useSoundEffects';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export default function Section({ children, id, className = "" }: SectionProps) {
  const { playAppear } = useSoundEffects();

  return (
    <section id={id} className={`py-20 px-4 md:px-8 max-w-7xl mx-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onAnimationStart={() => playAppear()}
      >
        {children}
      </motion.div>
    </section>
  );
}
