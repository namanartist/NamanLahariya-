import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, LogIn, AlertTriangle, LogOut } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { useEffect } from 'react';

export default function Login() {
  const { login, logout, isLoggedIn, isAuthReady, user } = useSiteData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthReady && isLoggedIn) {
      navigate('/admin');
    }
  }, [isAuthReady, isLoggedIn, navigate]);

  const handleGoogleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
  };

  // If user is logged in but not admin (isLoggedIn is false)
  const isUnauthorized = isAuthReady && user && !isLoggedIn;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121212] p-8 rounded-2xl border border-white/5 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isUnauthorized ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
            {isUnauthorized ? <AlertTriangle size={32} /> : <Lock size={32} />}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
        
        {isUnauthorized ? (
          <div className="text-center mb-8">
            <p className="text-red-400 font-medium mb-2">Access Denied</p>
            <p className="text-gray-400 text-sm mb-6">
              The account <strong>{user?.email}</strong> is not authorized to access the admin panel.
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-center mb-8 text-sm">
              Only authorized administrators can access this section.
            </p>
            
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
            >
              <LogIn size={20} />
              Sign in with Google
            </button>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-accent transition-colors"
          >
            Back to Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
