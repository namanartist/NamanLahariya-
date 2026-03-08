import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Code2, GraduationCap, Award, FileText, MessageSquare, LogOut, Database } from 'lucide-react';
import ProjectsManager from '../components/admin/ProjectsManager';
import SkillsManager from '../components/admin/SkillsManager';
import EducationManager from '../components/admin/EducationManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import CertificationsManager from '../components/admin/CertificationsManager';
import ArticlesManager from '../components/admin/ArticlesManager';
import InquiriesManager from '../components/admin/InquiriesManager';
import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { initialProjects, initialSkills, initialEducation, initialExperience, initialCertifications } from '../data/initialData';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [isSeeding, setIsSeeding] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const seedDatabase = async () => {
    if (!confirm("This will populate the database with initial data. Continue?")) return;
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);

      // Projects
      for (const p of initialProjects) {
        const ref = doc(collection(db, 'projects'));
        batch.set(ref, {
          title: p.title,
          category: p.category,
          description: p.description,
          tech: p.tech,
          demoLink: p.demoLink,
          githubLink: p.githubLink,
          featured: true,
          createdAt: new Date().toISOString()
        });
      }

      // Skills (Flattened)
      for (const cat of initialSkills) {
        for (const skillName of cat.skills) {
          const ref = doc(collection(db, 'skills'));
          batch.set(ref, {
            name: skillName,
            category: cat.title,
            level: 5,
            icon: cat.icon
          });
        }
      }

      // Education
      for (const edu of initialEducation) {
        const ref = doc(collection(db, 'education'));
        batch.set(ref, {
          degree: edu.title,
          institution: edu.subtitle,
          period: edu.year,
          description: edu.description
        });
      }

      // Experience
      for (const exp of initialExperience) {
        const ref = doc(collection(db, 'experience'));
        batch.set(ref, {
          role: exp.title,
          company: exp.subtitle,
          period: exp.year,
          description: exp.description,
          achievements: []
        });
      }

      // Certifications
      for (const cert of initialCertifications) {
        const ref = doc(collection(db, 'certifications'));
        batch.set(ref, {
          name: cert.title,
          issuer: cert.issuer,
          date: new Date().toISOString(), // Default to now as date isn't in initial data
          link: cert.link,
          image: ''
        });
      }

      await batch.commit();
      alert("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
      alert("Failed to seed database.");
    } finally {
      setIsSeeding(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsManager />;
      case 'skills': return <SkillsManager />;
      case 'education': return <EducationManager />;
      case 'experience': return <ExperienceManager />;
      case 'certifications': return <CertificationsManager />;
      case 'articles': return <ArticlesManager />;
      case 'inquiries': return <InquiriesManager />;
      default: return <InquiriesManager />;
    }
  };

  const tabs = [
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase }, // Reusing Briefcase icon
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'articles', label: 'Articles', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#121212] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold font-serif">Admin Panel</h1>
          <p className="text-xs text-gray-500">Manage your portfolio</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-accent text-black font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={seedDatabase}
            disabled={isSeeding}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-yellow-400 hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
          >
            <Database size={18} />
            {isSeeding ? 'Seeding...' : 'Seed Database'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h2>
        {renderContent()}
      </div>
    </div>
  );
}
