import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, LogIn } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export default function Login() {
  const { login, isLoggedIn, isAuthReady } = useSiteData();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await login();
  };

  if (isAuthReady && isLoggedIn) {
    navigate('/admin');
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121212] p-8 rounded-2xl border border-white/5 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <Lock size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
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
