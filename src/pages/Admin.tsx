import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Code2, GraduationCap, Award, FileText, MessageSquare, LogOut } from 'lucide-react';
import ProjectsManager from '../components/admin/ProjectsManager';
import SkillsManager from '../components/admin/SkillsManager';
import EducationManager from '../components/admin/EducationManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import CertificationsManager from '../components/admin/CertificationsManager';
import ArticlesManager from '../components/admin/ArticlesManager';
import InquiriesManager from '../components/admin/InquiriesManager';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('inquiries');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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

        <div className="p-4 border-t border-white/5">
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
