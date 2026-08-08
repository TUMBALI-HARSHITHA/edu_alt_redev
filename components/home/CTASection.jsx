import React from "react";
import { MotionDiv } from "../../src/shared/hooks/useMotion";
import { GraduationCap } from "lucide-react";
import Button from "../Button";

const CTASection = () => {
  return (
    <section className="py-32 px-6 relative bg-transparent">
      <div className="max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-900 via-[#0047AB]/90 to-slate-900 rounded-[3rem] p-12 lg:p-20 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#3CB371]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 animate-drift" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0047AB]/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 animate-drift-reverse" />

          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-emerald-400 mx-auto">
              <GraduationCap className="w-8 h-8" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              Ready to Redefine Education?
            </h2>
            
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
              Join our custom tracks as a student to acquire engineering skillsets, or reach out to partner as an institution to leverage our ERP and web services.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button to="/courses" size="lg" className="bg-[#3CB371] hover:bg-[#2e8b57] text-white border-none">
                Explore Learning Portal
              </Button>
              <Button variant="secondary" to="/contact" size="lg" className="bg-transparent border-[#3CB371] text-[#3CB371] hover:bg-[#3CB371] hover:text-white transition-colors">
                Consult Tech Department
              </Button>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default CTASection;
