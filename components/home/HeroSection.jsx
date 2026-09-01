import React from "react";
import { MotionDiv, MotionH1, MotionP } from "../../src/shared/hooks/useMotion";
import { ArrowRight } from "lucide-react";
import Button from "../Button";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-28 sm:pt-36 pb-32 sm:pb-40 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#E0F2FE]/50 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[0%] w-[600px] h-[600px] bg-[#DCFCE7]/50 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* Hero Left: Text, Metrics, Buttons */}
        <div className="lg:col-span-6 text-left space-y-6">
          <MotionH1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]"
          >
            <span style={{ fontFamily: 'Georgia, serif' }}>Learn. Build.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0047AB] to-[#3CB371] font-bitcount" style={{ fontFamily: '"Bitcount Prop Single", cursive, sans-serif' }}>
              Innovate.
            </span>
          </MotionH1>



          {/* 2 Buttons positioned directly below Innovate */}
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-1"
          >
            <Button
              variant="dark"
              to={!user ? "/login" : "/courses"}
              state={!user ? { alert: "login to access resources..." } : undefined}
              onClick={!user ? (e) => {
                e.preventDefault();
                navigate('/login', { state: { alert: "login to access resources..." } });
              } : undefined}
              className="bg-slate-950 hover:bg-[#3CB371] text-white border-none rounded-full px-8 py-3.5 text-sm font-bold shadow-md transition-all"
            >
              Explore Courses <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" to="/contact" className="bg-gradient-to-r from-[#0047AB] to-[#3CB371] text-white hover:opacity-90 border-none rounded-full px-8 py-3.5 text-sm font-extrabold shadow-md hover:shadow-lg transition-all">
              Partner With Us
            </Button>
          </MotionDiv>

          {/* Quick Metrics - All 4 in 1 single line with smaller numbers */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-4 gap-2 sm:gap-4 py-4 border-y border-slate-200/60"
          >
            {[
              { value: "7", label: "Partner Schools" },
              { value: "500+", label: "Students Reached" },
              { value: "100+", label: "Study Resources" },
              { value: "98%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <div key={i} className="text-left">
                <div className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </MotionDiv>
        </div>

        {/* Hero Right: Image */}
        <div className="lg:col-span-6 relative flex justify-end">
          <MotionDiv
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.4 }}
             className="w-full max-w-[480px] relative mx-auto lg:mr-0"
          >
            <img 
              src="/hero_students_nobg.jpg" 
              alt="Students learning on a tablet" 
              className="w-full h-auto object-contain rounded-full"
              style={{ 
                WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 80%)', 
                maskImage: 'radial-gradient(circle, black 50%, transparent 80%)' 
              }}
            />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
