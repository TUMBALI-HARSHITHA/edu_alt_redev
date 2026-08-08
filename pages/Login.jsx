import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthCard from '../components/AuthCard';

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
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
