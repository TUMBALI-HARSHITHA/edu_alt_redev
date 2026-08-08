import React from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "../../src/shared/hooks/useMotion";
import { Download, ArrowRight, FileText, BookOpen, Brain, Compass, Sparkles } from "lucide-react";

const ResourcesSection = () => {
  const resources = [
    { 
      icon: <FileText className="w-9 h-9 text-[#8B5CF6]" />, 
      title: "Free Textbook PDFs", 
      desc: "Download high-quality curated textbook notes and guides.",
      tags: ["NOTES", "GUIDES"],
      waveMainColor: "#8B5CF6",
      waveAccentColor: "rgba(139, 92, 246, 0.25)",
      bgGradient: "from-[#8B5CF6] to-[#C084FC]"
    },
    { 
      icon: <BookOpen className="w-9 h-9 text-[#FF5E36]" />, 
      title: "Topic Question Banks", 
      desc: "Sharpen knowledge with comprehensive practice questionnaires.",
      tags: ["PRACTICE", "QUIZZES"],
      waveMainColor: "#FF5E36",
      waveAccentColor: "rgba(255, 94, 54, 0.25)",
      bgGradient: "from-[#FF5E36] to-[#FFAE33]"
    },
    { 
      icon: <Brain className="w-9 h-9 text-[#00B4DB]" />, 
      title: "Conceptual Worksheets", 
      desc: "Printable review exercises designed to foster deep intuition.",
      tags: ["REVIEW", "EXERCISES"],
      waveMainColor: "#00B4DB",
      waveAccentColor: "rgba(0, 180, 219, 0.25)",
      bgGradient: "from-[#00B4DB] to-[#0083B0]"
    },
    { 
      icon: <Download className="w-9 h-9 text-[#10B981]" />, 
      title: "Academic Mock Exams", 
      desc: "Evaluate performance using board-aligned diagnostic papers.",
      tags: ["TESTS", "PAPERS"],
      waveMainColor: "#10B981",
      waveAccentColor: "rgba(16, 185, 129, 0.25)",
      bgGradient: "from-[#10B981] to-[#059669]"
    },
    { 
      icon: <Compass className="w-9 h-9 text-[#6366F1]" />, 
      title: "Professional Roadmaps", 
      desc: "Follow progressive flowcharts for engineering and design tracks.",
      tags: ["PATHWAYS", "CAREERS"],
      waveMainColor: "#6366F1",
      waveAccentColor: "rgba(99, 102, 241, 0.25)",
      bgGradient: "from-[#6366F1] to-[#3B82F6]"
    },
    { 
      icon: <Sparkles className="w-9 h-9 text-[#F43F5E]" />, 
      title: "AI Learning Manuals", 
      desc: "Unlock prompt guidelines, tutorial sheets, and code logs.",
      tags: ["PROMPTS", "TUTORIALS"],
      waveMainColor: "#F43F5E",
      waveAccentColor: "rgba(244, 63, 94, 0.25)",
      bgGradient: "from-[#F43F5E] to-[#FB7185]"
    }
  ];

  return (
    <section id="resources" className="py-32 px-6 relative bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Everything You Need to Excel
          </h2>
          <div className="pt-2">
            <Link to="/resources" className="inline-flex items-center gap-2 text-[#0047AB] font-black hover:text-[#003580] transition-colors">
              Browse All Resources <ArrowRight className="w-5 h-5 animate-pulse-soft" />
            </Link>
          </div>
        </MotionDiv>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((item, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to="/resources"
                className="group block bg-white rounded-[2.2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-slate-100/80 flex flex-col h-[360px]"
              >
                {/* Top Section (White) */}
                <div className="pt-8 pb-3 px-6 text-center bg-white flex flex-col items-center justify-center shrink-0">
                  <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* SVG Organic Wave Divider */}
                <div className="relative w-full overflow-hidden leading-none bg-white shrink-0 -mb-[1px]">
                  <svg
                    className="relative block w-full h-10 sm:h-12"
                    viewBox="0 0 500 80"
                    preserveAspectRatio="none"
                  >
                    {/* Secondary translucent background wave */}
                    <path
                      d="M0,25 C150,65 350,5 500,40 L500,80 L0,80 Z"
                      fill={item.waveAccentColor}
                    />
                    {/* Main foreground wave fill */}
                    <path
                      d="M0,48 C140,20 340,75 500,38 L500,80 L0,80 Z"
                      fill={item.waveMainColor}
                    />
                  </svg>
                </div>

                {/* Bottom Section (Vibrant Dual-Color Gradient) */}
                <div className={`flex-1 bg-gradient-to-b ${item.bgGradient} p-6 pt-2 text-white text-center flex flex-col items-center justify-between`}>
                  <p className="text-sm text-white/90 font-medium leading-relaxed px-2">
                    {item.desc}
                  </p>

                  <div className="w-full flex items-center justify-between pt-4">
                    <div className="flex gap-4 text-[11px] font-bold tracking-widest text-white/90 uppercase">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="border-b border-white/40 pb-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-white group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;

