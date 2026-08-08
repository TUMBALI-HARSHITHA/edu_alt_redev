import React, { useRef } from "react";
import { MotionDiv } from "../../src/shared/hooks/useMotion";
import { Target, Globe, Users, BookOpen, Star } from "lucide-react";
import AnimatedCounter from "../AnimatedCounter";
import { useInView } from "framer-motion";

// Custom component to wrap AnimatedCounter so it triggers when in view
const CounterTrigger = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      {isInView ? <AnimatedCounter value={value} suffix={suffix} /> : "0" + (suffix || "")}
    </div>
  );
};

const StatsSection = () => {
  const metrics = [
    { value: 500, label: "Students", icon: <Users className="w-6 h-6" />, suffix: "+" },
    { value: 150, label: "Courses", icon: <BookOpen className="w-6 h-6" />, suffix: "+" },
    { value: 98, label: "Success Rate", icon: <Target className="w-6 h-6" />, suffix: "%" },
    { value: 50, label: "Expert Mentors", icon: <Star className="w-6 h-6" />, suffix: "+" }
  ];

  return (
    <section id="stats" className="py-32 px-6 relative bg-gradient-to-br from-slate-900 via-[#0047AB]/90 to-slate-900 overflow-hidden text-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3CB371]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-drift" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0047AB]/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 animate-drift-reverse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
            Our Global Footprint
          </h2>
        </MotionDiv>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, idx) => (
            <MotionDiv
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md group hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                {metric.icon}
              </div>
              <div className="text-5xl font-black text-white mb-2 tracking-tight">
                <CounterTrigger value={metric.value} suffix={metric.suffix || ""} />
              </div>
              <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider">{metric.label}</div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
