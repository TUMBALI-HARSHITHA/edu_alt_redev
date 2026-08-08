import React from "react";
import { MotionDiv } from "../../src/shared/hooks/useMotion";
import { 
  GraduationCap, 
  School, 
  ChevronRight, 
  Compass, 
  Play, 
  Hammer, 
  Award, 
  MessageCircle, 
  Code, 
  Rocket, 
  RefreshCw 
} from "lucide-react";

const ProcessSection = () => {
  const studentSteps = [
    { title: "SELECT SKILL", desc: "Choose from our catalog of engineering & tech tracks", icon: <Compass className="w-8 h-8 text-amber-600" /> },
    { title: "JOIN SESSIONS", desc: "Participate in lectures translated in your native tongue", icon: <Play className="w-8 h-8 text-amber-600" /> },
    { title: "LAB PROJECTS", desc: "Translate theoretical learning into working software", icon: <Hammer className="w-8 h-8 text-amber-600" /> },
    { title: "QUALIFICATIONS", desc: "Secure industry credits & build portfolio assets", icon: <Award className="w-8 h-8 text-amber-600" /> }
  ];

  const schoolSteps = [
    { title: "CONSULTATION", desc: "Audit existing administration workflows & portals", icon: <MessageCircle className="w-8 h-8 text-blue-600" /> },
    { title: "CUSTOM DEV", desc: "Tailor ERP engine & school app interfaces", icon: <Code className="w-8 h-8 text-blue-600" /> },
    { title: "DEPLOYMENT", desc: "Setup directories & onboard academic departments", icon: <Rocket className="w-8 h-8 text-blue-600" /> },
    { title: "CORE SUPPORT", desc: "Provide secure cloud hosting & regular updates", icon: <RefreshCw className="w-8 h-8 text-blue-600" /> }
  ];

  const ChevronArrows = ({ colorClass = "text-amber-400" }) => (
    <div className="hidden lg:flex items-center -space-x-2 shrink-0 opacity-80 px-1">
      <ChevronRight className={`w-4 h-4 ${colorClass}`} />
      <ChevronRight className={`w-4 h-4 ${colorClass}`} />
      <ChevronRight className={`w-4 h-4 ${colorClass}`} />
      <ChevronRight className={`w-4 h-4 ${colorClass}`} />
      <ChevronRight className={`w-4 h-4 ${colorClass}`} />
    </div>
  );

  return (
    <section id="learning-path" className="py-24 px-6 relative bg-transparent border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95]">
            Your Path to Success
          </h2>
        </MotionDiv>

        {/* Student Pathway Container */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FFF9F2] rounded-[2.5rem] p-6 sm:p-10 border border-amber-200/60 shadow-sm overflow-x-auto"
        >
          <div className="min-w-[850px] flex items-center justify-between gap-4">
            
            {/* Left Highlight Badge Card */}
            <div className="bg-amber-100/80 border-2 border-amber-400/50 rounded-2xl px-5 py-5 text-center shrink-0 flex flex-col items-center justify-center shadow-md min-w-[130px] h-[150px]">
              <div className="text-sm sm:text-base font-black text-amber-800 uppercase tracking-wider leading-tight">
                FOR STUDENTS
              </div>
              <div className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-2">
                4 Steps
              </div>
            </div>

            <ChevronArrows colorClass="text-amber-400" />

            {/* Student Steps */}
            {studentSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center text-center max-w-[170px] shrink-0 group">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-amber-200/80 flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h4 className="text-xs font-black text-amber-600 tracking-wider uppercase mb-1.5 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-normal">
                    {step.desc}
                  </p>
                </div>

                {idx < studentSteps.length - 1 && (
                  <ChevronArrows colorClass="text-amber-400" />
                )}
              </React.Fragment>
            ))}

          </div>
        </MotionDiv>

        {/* School Pathway Container */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#F0F7FF] rounded-[2.5rem] p-6 sm:p-10 border border-blue-200/60 shadow-sm overflow-x-auto"
        >
          <div className="min-w-[850px] flex items-center justify-between gap-4">
            
            {/* Left Highlight Badge Card */}
            <div className="bg-blue-100/80 border-2 border-blue-400/50 rounded-2xl px-5 py-5 text-center shrink-0 flex flex-col items-center justify-center shadow-md min-w-[130px] h-[150px]">
              <div className="text-sm sm:text-base font-black text-blue-800 uppercase tracking-wider leading-tight">
                FOR SCHOOLS
              </div>
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-2">
                4 Steps
              </div>
            </div>

            <ChevronArrows colorClass="text-blue-400" />

            {/* School Steps */}
            {schoolSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center text-center max-w-[170px] shrink-0 group">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-blue-200/80 flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h4 className="text-xs font-black text-blue-600 tracking-wider uppercase mb-1.5 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-normal">
                    {step.desc}
                  </p>
                </div>

                {idx < schoolSteps.length - 1 && (
                  <ChevronArrows colorClass="text-blue-400" />
                )}
              </React.Fragment>
            ))}

          </div>
        </MotionDiv>

      </div>
    </section>
  );
};

export default ProcessSection;
