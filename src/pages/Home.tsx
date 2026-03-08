import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Journey from '../components/Journey';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import BlogSection from '../components/BlogSection';
import Contact from '../components/Contact';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-accent selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Journey />
        <Projects />
        <Certifications />
        <BlogSection />
        <Contact />
      </main>
    </div>
  );
}
