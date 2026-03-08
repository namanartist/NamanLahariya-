import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, handleFirestoreError, OperationType, signInWithGoogle } from '../firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

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
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore SiteData Listener
  useEffect(() => {
    if (!isAuthReady) return;

    const path = 'settings/siteData';
    const unsubscribe = onSnapshot(doc(db, path), (snapshot) => {
      if (snapshot.exists()) {
        setSiteData(snapshot.data() as SiteData);
      } else {
        // If no data in Firestore, use default and potentially save it if admin
        // But for now just use default
        setSiteData(defaultSiteData);
      }
    }, (error) => {
      // If permission denied, we might just be a regular user, which is fine
      // But we should still use the default data
      console.warn('Firestore SiteData access restricted or failed:', error.message);
    });

    return () => unsubscribe();
  }, [isAuthReady]);

  const updateSiteData = async (data: Partial<SiteData>) => {
    const newData = { ...siteData, ...data };
    setSiteData(newData);
    
    // If admin, sync to Firestore
    if (user && user.email === 'namanalahariya@gmail.com') {
      const path = 'settings/siteData';
      try {
        await setDoc(doc(db, path), newData);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      // Fallback to local storage for non-admins (preview only)
      localStorage.setItem('siteData', JSON.stringify(newData));
    }
  };

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isLoggedIn = !!user && user.email === 'namanalahariya@gmail.com';

  return (
    <SiteContext.Provider value={{ siteData, updateSiteData, isLoggedIn, user, login, logout, isAuthReady }}>
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
