import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthCard from '../components/AuthCard';

const Login = () => {
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const msg = location.state?.alert || location.state?.message || new URLSearchParams(location.search).get('alert');
    if (msg) {
      setAlertMessage(msg);
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center pt-40 md:pt-24 lg:pt-28 pb-12 px-4 relative overflow-hidden">
      {/* 3-Second Floating Alert Banner */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-8 z-50 flex items-center gap-3 bg-slate-900/95 text-white backdrop-blur-2xl px-6 py-4 rounded-2xl border border-slate-700/80 shadow-2xl shadow-slate-950/40 max-w-md w-[92%] overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                {alertMessage}
              </p>
            </div>

            {/* 3-second animated shrinking progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-b-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft background glow matching other pages */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#E0F2FE]/60 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[0%] w-[600px] h-[600px] bg-[#DCFCE7]/60 blur-[150px] rounded-full" />
      </div>

      {/* Auth Card Box */}
      <div className="relative z-10 w-full flex justify-center">
        <AuthCard initialState="login" />
      </div>

      {/* Centered Translucent Back to Home Button Below Box */}
      <div className="w-full max-w-[850px] mt-6 relative z-10 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-950 font-bold text-sm bg-white/40 hover:bg-white/70 backdrop-blur-xl px-6 py-2.5 rounded-full transition-all border border-white/60 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 text-[#0047AB]" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
