import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, setDoc, doc, serverTimestamp } from '../lib/firebase';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthCard = ({ initialState = 'login', onSuccess }) => {
  const [isLogin, setIsLogin] = useState(initialState === 'login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alertNotice, setAlertNotice] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const msg = location?.state?.alert || location?.state?.message || new URLSearchParams(location?.search || '').get('alert');
    if (msg) {
      setAlertNotice(msg);
      const timer = setTimeout(() => {
        setAlertNotice('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const toggleState = () => {
    setIsAnimating(true);
    setError('');
    setIsLogin((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Firebase Login
        const loginEmail = email || (username.includes('@') ? username : `${username}@example.com`);
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
        if (onSuccess) {
          onSuccess({ type: 'login', username, email: loginEmail });
        } else {
          navigate('/dashboard');
        }
      } else {
        // Firebase Register
        const registerEmail = email || `${username}@example.com`;
        const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, password);
        
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: username || 'Learner'
          });
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: username || 'Learner',
            email: registerEmail,
            createdAt: serverTimestamp()
          });
        }

        if (onSuccess) {
          onSuccess({ type: 'register', username, email: registerEmail });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid username/email or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('User already exists. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      {/* Outer Card Container with Fresh Green Ambient Glow & Rounded Border */}
      <motion.div
        animate={{
          boxShadow: isAnimating
            ? '0 0 45px rgba(16,185,129,0.7), 0 0 80px rgba(52,211,153,0.45), 0 20px 60px rgba(0,0,0,0.12)'
            : '0 0 35px rgba(16,185,129,0.4), 0 0 60px rgba(52,211,153,0.2), 0 20px 50px -10px rgba(0,0,0,0.1)'
        }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="w-full max-w-[850px] min-h-[520px] bg-white/95 backdrop-blur-xl border border-emerald-400/40 ring-4 ring-emerald-400/10 rounded-3xl relative overflow-hidden flex flex-col md:block shadow-2xl"
      >
        {/* DESKTOP / TABLET LAYOUT */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          
          {/* BRAND PANEL - Sliding Diagonal Background: Fresh Green Gradient */}
          <motion.div
            initial={false}
            animate={{
              left: isLogin ? '44%' : '0%',
              clipPath: isLogin
                ? 'polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%)'
                : 'polygon(0% 0%, 100% 0%, 84% 100%, 0% 100%)'
            }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
            className={`absolute top-0 w-[56%] h-full bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669] z-10 flex flex-col items-center justify-center py-8 text-center shadow-2xl transition-all duration-300 ${
              isLogin ? 'pl-20 pr-8' : 'pl-8 pr-20'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'welcome-back' : 'welcome'}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="max-w-[260px] space-y-4"
              >
                <h2 className="text-[36px] font-black text-[#002355] tracking-wide whitespace-nowrap leading-[1.2]">
                  <span className="italic font-georgia" style={{ fontFamily: 'Georgia, serif' }}>Welcome</span>
                  {isLogin ? ' Back!' : '!'}
                </h2>
                <p className="text-[#002355]/90 text-[15px] font-medium leading-[1.6]">
                  {isLogin
                    ? 'To keep connected with us please login with your personal info'
                    : 'Enter your personal details and start your journey with us'}
                </p>
                <div className="pt-2">
                  <div className="w-12 h-1 bg-[#002355]/30 rounded-full mx-auto" />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* FORM PANEL CONTAINER */}
          <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
            
            {/* LOGIN FORM */}
            <AnimatePresence mode="wait">
              {isLogin && (
                <motion.div
                  key="login-form-panel"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute left-0 top-0 w-[55%] h-full pl-[60px] pr-[40px] py-10 flex flex-col justify-center bg-white/95 pointer-events-auto"
                >
                  <h1 className="text-[34px] font-black text-[#0047AB] mb-6 leading-[1.2] italic font-georgia" style={{ fontFamily: 'Georgia, serif' }}>
                    Login
                  </h1>

                  <AnimatePresence>
                    {alertNotice && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{alertNotice}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                        Username / Email
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setEmail(e.target.value);
                          }}
                          placeholder="Enter your username or email"
                          className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-10 outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-400 font-medium"
                        />
                        <User className="w-5 h-5 text-slate-400 absolute right-2 bottom-2.5 pointer-events-none group-focus-within:text-[#3CB371] transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                        Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-12 outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-400 font-medium"
                        />
                        <div className="absolute right-2 bottom-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-[#3CB371] transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#3CB371] transition-colors pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-full font-extrabold text-white text-[16px] uppercase tracking-[0.5px] bg-[#0047AB] hover:bg-[#003888] shadow-lg shadow-[#0047AB]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                      </button>
                    </div>

                    <p className="text-slate-500 text-[14px] text-center font-normal pt-2">
                      Don't have an account?{' '}
                      <span
                        onClick={toggleState}
                        className="text-[#10B981] hover:underline font-extrabold cursor-pointer ml-1"
                      >
                        Sign Up
                      </span>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REGISTER FORM */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="register-form-panel"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute right-0 top-0 w-[55%] h-full pr-[60px] pl-[40px] py-10 flex flex-col justify-center bg-white/95 pointer-events-auto"
                >
                  <h1 className="text-[34px] font-black text-[#0047AB] mb-6 leading-[1.2] italic font-georgia" style={{ fontFamily: 'Georgia, serif' }}>
                    Register
                  </h1>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                        Username
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Choose a username"
                          className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-10 outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-400 font-medium"
                        />
                        <User className="w-5 h-5 text-slate-400 absolute right-2 bottom-2.5 pointer-events-none group-focus-within:text-[#10B981] transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                        Email
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-10 outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-400 font-medium"
                        />
                        <Mail className="w-5 h-5 text-slate-400 absolute right-2 bottom-2.5 pointer-events-none group-focus-within:text-[#10B981] transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                        Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-12 outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-400 font-medium"
                        />
                        <div className="absolute right-2 bottom-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-[#10B981] transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#10B981] transition-colors pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-full font-extrabold text-white text-[16px] uppercase tracking-[0.5px] bg-[#0047AB] hover:bg-[#003888] shadow-lg shadow-[#0047AB]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
                      </button>
                    </div>

                    <p className="text-slate-500 text-[14px] text-center font-normal pt-1">
                      Already have an account?{' '}
                      <span
                        onClick={toggleState}
                        className="text-[#10B981] hover:underline font-extrabold cursor-pointer ml-1"
                      >
                        Sign in
                      </span>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE STACKED LAYOUT (<768px) */}
        <div className="md:hidden flex flex-col w-full">
          <div className="w-full py-8 px-6 bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669] text-center shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'mob-login-head' : 'mob-reg-head'}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-[32px] font-black text-[#002355] tracking-wide">
                  <span className="italic font-georgia" style={{ fontFamily: 'Georgia, serif' }}>Welcome</span>
                  {isLogin ? ' Back!' : '!'}
                </h2>
                <p className="text-[#002355]/90 text-[14px] mt-2 font-medium">
                  {isLogin ? 'Sign in to access your account' : 'Register to get started with us'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-white">
            <h1 className="text-[28px] font-black text-[#0047AB] mb-4 italic font-georgia" style={{ fontFamily: 'Georgia, serif' }}>
              {isLogin ? 'Login' : 'Register'}
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                  Username / Email
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setEmail(e.target.value);
                    }}
                    placeholder="Username or email"
                    className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-10 outline-none focus:border-[#10B981]"
                  />
                  <User className="w-5 h-5 text-slate-400 absolute right-2 bottom-2.5 pointer-events-none" />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                    Email
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-10 outline-none focus:border-[#10B981]"
                    />
                    <Mail className="w-5 h-5 text-slate-400 absolute right-2 bottom-2.5 pointer-events-none" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-500 text-[12px] font-bold uppercase tracking-[0.5px] block">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent border-b border-slate-300 text-slate-900 text-[15px] py-2.5 pr-12 outline-none focus:border-[#10B981]"
                  />
                  <div className="absolute right-2 bottom-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Lock className="w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full font-extrabold text-white text-[16px] uppercase tracking-[0.5px] bg-[#0047AB] hover:bg-[#003888] shadow-lg shadow-[#0047AB]/25 mt-4 flex items-center justify-center gap-2 transition-all cursor-pointer border-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? 'Login' : 'Register'}
              </button>

              <p className="text-slate-500 text-[14px] text-center font-normal pt-2">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <span
                  onClick={toggleState}
                  className="text-[#10B981] hover:underline font-extrabold cursor-pointer ml-1"
                >
                  {isLogin ? 'Sign Up' : 'Sign in'}
                </span>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
