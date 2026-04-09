import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getAuthState } = useContext(AppContext);

  const [state, setState] = useState('Login'); 
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = state === 'Sign Up' ? '/api/auth/register' : '/api/auth/login';
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password };
      const { data } = await axios.post(backendUrl + endpoint, payload);
      
      if (data.success) {
        toast.success(state === 'Sign Up' ? "Account Created" : "Welcome back");
        await getAuthState();
        navigate(state === 'Sign Up' ? '/email-verify' : '/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal system error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] font-sans overflow-hidden">
      
      {/* --- Left Side: Authentication Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 z-10">
        
        {/* Typographic Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-[#6D28D9] flex items-center justify-center shadow-lg shadow-purple-100 rotate-3">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">Arthya</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[420px] bg-white p-10 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(109,40,217,0.1)] border border-slate-100"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {state === 'Sign Up' ? 'Initialize Dashboard' : 'Authenticate'}
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              {state === 'Sign Up' 
                ? 'Create your profile to access strategic financial clarity.' 
                : 'Enter your specific credentials to access your dashboard.'}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-5">
            {state === 'Sign Up' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Your Identity</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-[#6D28D9] transition-colors" size={18} />
                  <input 
                    onChange={e => setName(e.target.value)} value={name}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-[#6D28D9] focus:bg-white transition-all font-medium text-slate-700" 
                    type="text" placeholder="Full Name" required 
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Primary Contact</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-[#6D28D9] transition-colors" size={18} />
                <input 
                  onChange={e => setEmail(e.target.value)} value={email}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-[#6D28D9] focus:bg-white transition-all font-medium text-slate-700" 
                  type="email" placeholder="Email Address" required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unique Key</label>
                {state === 'Login' && (
                  <span onClick={() => navigate('/reset-password')} className="text-xs text-[#6D28D9] hover:underline font-bold cursor-pointer">Reset?</span>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-[#6D28D9] transition-colors" size={18} />
                <input 
                  onChange={e => setPassword(e.target.value)} value={password}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:border-[#6D28D9] focus:bg-white transition-all font-medium text-slate-700" 
                  type="password" placeholder="Password" required 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-[#6D28D9] text-white rounded-2xl font-bold hover:bg-[#5B21B6] shadow-lg shadow-purple-100 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 mt-4 group"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {state === 'Sign Up' ? 'Create Account' : 'Initialize Dashboard'} 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {state === 'Sign Up' ? 'Existing Member?' : "No Account?"}{' '}
              <button 
                onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')} 
                className="text-[#6D28D9] font-black hover:underline underline-offset-4 ml-1"
              >
                {state === 'Login' ? 'Initialize' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
        
        <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
           Strict Confidentiality. Real Indian Bank Data.
        </p>
      </div>

      {/* --- Right Side: Visual Narrative (Matching Landing) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F8F9FF] items-center justify-center relative">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <img 
            src="https://media.base44.com/images/public/69d206a558379c18063c54f1/ba34dd0a8_generated_image.png" 
            alt="Strategic Clarity" 
            className="w-full max-w-lg drop-shadow-2xl mb-8"
          />
          <div className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-[2rem] max-w-sm mx-auto shadow-xl shadow-purple-100/20">
             <div className="flex items-center gap-3 mb-2 justify-center">
                <ShieldCheck className="text-[#6D28D9]" size={20} />
                <span className="font-bold text-slate-800">Strategic Clarity</span>
             </div>
             <p className="text-slate-500 text-sm font-medium">
               Your financial journey is backed by real-time data and human-readable insights.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;