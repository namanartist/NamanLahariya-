import Section from './Section';
import { Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import useSoundEffects from '../hooks/useSoundEffects';

export default function Journey() {
  return (
    <Section id="journey">
      <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 text-center">
        My <span className="text-accent italic">Journey</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Education Column */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="text-accent" size={32} />
            <h3 className="text-2xl font-bold">Education Journey</h3>
          </div>
          <div className="space-y-8 border-l border-theme ml-3 pl-8 relative">
            <JourneyItem 
              year="2025 - 2029"
              title="B.Tech, Mathematics and Computing"
              subtitle="Madhav Institute of Technology and Science"
              description="Pursuing undergraduate degree with a focus on computational mathematics."
            />
            <JourneyItem 
              year="2023 - 2025"
              title="Higher Secondary (12th)"
              subtitle="Bright Convent Hr. Sec. School"
              description="Completed with focus on Science and Mathematics."
            />
            <JourneyItem 
              year="2021 - 2023"
              title="Secondary School (10th)"
              subtitle="The Radiant Hr. Sec. School"
              description="Completed with academic excellence."
            />
          </div>
        </div>

        {/* Work Column */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="text-accent" size={32} />
            <h3 className="text-2xl font-bold">Work Journey</h3>
          </div>
          <div className="space-y-8 border-l border-theme ml-3 pl-8 relative">
            <JourneyItem 
              year="2026 - Present"
              title="Campus Ambassador"
              subtitle="INTERSHALA"
              description="Leading campus initiatives and promoting student opportunities."
            />
            <JourneyItem 
              year="2025"
              title="Digital Marketing Intern"
              subtitle="Corizo Edutech Pvt. Ltd."
              description="Managed digital campaigns and analyzed engagement metrics."
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function JourneyItem({ year, title, subtitle, description }: { year: string; title: string; subtitle: string; description: string }) {
  const { playHover } = useSoundEffects();
  return (
    <motion.div 
      className="relative"
      whileHover={{ x: 10 }}
      onMouseEnter={playHover}
    >
      <div className="absolute top-0 -left-[37px] w-4 h-4 rounded-full bg-background border-2 border-accent" />
      <span className="text-accent text-sm font-mono mb-1 block">{year}</span>
      <h4 className="text-xl font-bold mb-1">{title}</h4>
      <h5 className="text-muted text-sm mb-2">{subtitle}</h5>
      <p className="text-muted/80 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
