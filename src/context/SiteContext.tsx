import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteData {
  name: string;
  title: string;
  bio: string;
  location: string;
  github: string;
  linkedin: string;
  email: string;
  resumeLink: string;
  avatarUrl: string;
}

const defaultSiteData: SiteData = {
  name: 'Naman Lahariya',
  title: 'B.Tech in Mathematics and Computing at MITS Gwalior.',
  bio: 'Passionate about building intelligent digital solutions and contributing through hard work and adaptability.',
  location: 'Gwalior, India',
  github: 'https://github.com/namanartist',
  linkedin: 'https://www.linkedin.com/in/naman-lahariya',
  email: 'mailto:namanalahariya@gmail.com',
  resumeLink: 'https://drive.google.com/drive/folders/1T6Hf1ZuXB6IPZwF8xeG9zIZK1NUJWC7V?usp=sharing',
  avatarUrl: 'https://github.com/namanartist.png'
};

interface SiteContextType {
  siteData: SiteData;
  updateSiteData: (data: Partial<SiteData>) => void;
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('siteData');
    if (storedData) {
      try {
        setSiteData({ ...defaultSiteData, ...JSON.parse(storedData) });
      } catch (e) {
        console.error('Failed to parse stored site data', e);
      }
    }
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const updateSiteData = (data: Partial<SiteData>) => {
    const newData = { ...siteData, ...data };
    setSiteData(newData);
    localStorage.setItem('siteData', JSON.stringify(newData));
  };

  const login = (password: string) => {
    // Simple mock authentication
    if (password === 'admin') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <SiteContext.Provider value={{ siteData, updateSiteData, isLoggedIn, login, logout }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
}
