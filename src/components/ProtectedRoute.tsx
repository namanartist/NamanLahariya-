import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isLoggedIn, isAuthReady } = useSiteData();
  
  if (!isAuthReady) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-accent">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
