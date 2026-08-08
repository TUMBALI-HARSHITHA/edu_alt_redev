import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Globe, Smartphone, Brain, Zap, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { SERVICES } from "../constants";
const iconMap = {
  Globe: <Globe className="w-8 h-8" />, Smartphone: <Smartphone className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />, Zap: <Zap className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />, GraduationCap: <GraduationCap className="w-8 h-8" />
};
const Services = () => {
  return <div className="min-h-screen pt-32 pb-32 px-6 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[60px] rounded-full" /> <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[60px] rounded-full" />

 <div className="max-w-[1400px] mx-auto relative z-10"> <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto mb-20">
 <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]"> Technology Solutions<br />for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">Modern Schools</span>
 </h1>
 <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium text-center">
 Comprehensive digital solutions designed to empower educational institutions with cutting-edge technology.
 </p>
 </motion.div>

  <div className="flex flex-col gap-12 mb-20 max-w-5xl mx-auto">
  {SERVICES.map((service, idx) => {
    const isEven = idx % 2 === 0;
    const bgColor = isEven ? "#add8e6" : "#99e6b3";
    const stepNumber = String(idx + 1).padStart(2, "0");

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-0 relative`}
      >
        {/* Colored Block (Step & Icon) */}
        <div
          className={`w-full md:w-1/3 p-8 flex flex-col items-center justify-center relative z-10 shadow-lg`}
          style={{ 
            backgroundColor: bgColor,
            borderRadius: isEven ? "2rem 0 0 2rem" : "0 2rem 2rem 0"
          }}
        >
          {/* Mobile border radius fallback handled below for responsiveness, but using a simple approach here */}
          <div className="text-slate-800 bg-white/40 w-32 h-32 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="scale-[1.75]">
              {iconMap[service.icon]}
            </div>
          </div>
          
          {/* The little arrow (triangle) pointing towards the content */}
          <div 
            className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent ${isEven ? "border-l-[15px] -right-[14px]" : "border-r-[15px] -left-[14px]"}`}
            style={{ 
              borderLeftColor: isEven ? bgColor : "transparent",
              borderRightColor: isEven ? "transparent" : bgColor
            }}
          />
        </div>

        {/* White Content Block */}
        <div 
          className={`w-full md:w-2/3 bg-white/80 backdrop-blur-md p-8 md:p-12 shadow-xl border border-slate-100 z-0`}
          style={{
            borderRadius: isEven ? "0 2rem 2rem 0" : "2rem 0 0 2rem"
          }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: isEven ? "#7ab8c6" : "#7ac693" }}>
                Service {stepNumber}
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">{service.title}</h2>
              <p className="text-slate-600 leading-relaxed font-medium mb-8">
                {service.description}
              </p>
            </div>
            
            <ul className="grid sm:grid-cols-2 gap-4"> 
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <div className="mt-0.5 rounded-full p-1" style={{ backgroundColor: `${bgColor}40` }}>
                    <CheckCircle className="w-4 h-4 text-slate-800 shrink-0" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </motion.div>
    );
  })}
  </div>

 <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[3rem] p-14 lg:p-20 text-center shadow-2xl overflow-hidden relative"
  >
 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" /> <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
 <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10 tracking-tighter">
 Ready to Get Started?
 </h2>
 <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto relative z-10">
 Schedule a free consultation and discover how we can transform your school with technology.
 </p>
 <div className="flex flex-wrap justify-center gap-4 relative z-10"> <Link to="/contact" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1">
 Get a Free Consultation
 </Link>
 <Link to="/resources" className="px-10 py-5 /10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-all backdrop-blur-sm hover:-translate-y-1">
 Explore Resources
 </Link>
 </div>
 </motion.div>
 </div>
 </div>;
};
var stdin_default = Services;
export {
  stdin_default as default
};
