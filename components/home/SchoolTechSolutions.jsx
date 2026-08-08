import React from "react";
import { School, Smartphone, Sparkle, ArrowRight } from "lucide-react";
import Button from "../Button";

const SchoolTechSolutions = () => {
  return (
    <section id="school-tech" className="py-32 px-6 relative bg-transparent">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Context */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Complete Education Technology Partner
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              We design custom websites, ERP platforms, and responsive mobile apps tailored for schools, administrators, students, and parents.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Bespoke Portals", text: "Custom web development tailored for schools." },
                { label: "ERP Systems", text: "Admissions, grading, and finance dashboards." },
                { label: "Mobile Apps", text: "Cross-platform access for school updates." },
                { label: "Curriculum Sync", labelIcon: <Sparkle className="w-4.5 h-4.5 text-[#3CB371] inline mr-1" />, text: "Digital study material integration." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm hover:border-[#3CB371]/30 transition-colors">
                  <div className="font-bold text-slate-900 text-sm">
                    {item.labelIcon}{item.label}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{item.text}</div>
                </div>
              ))}
            </div>

            <Button variant="dark" to="/services" className="bg-[#0047AB] hover:bg-[#003580] text-white border-none">
              Explore Tech Services <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Right Column: Interactive ERP Mockup Panel */}
          <div className="lg:col-span-7">
            <div className="glow-card rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl bg-white p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative">
              
              {/* Mock ERP header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#3CB371] flex items-center justify-center text-white shrink-0 shadow-lg">
                    <School className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Genesis Portal</h4>
                    <span className="text-[9px] sm:text-[10px] text-[#3CB371] font-bold uppercase tracking-wider block">Alt-Tech ERP Active</span>
                  </div>
                </div>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase">
                  Admin Panel
                </span>
              </div>

              {/* Dashboard Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { title: "Admissions", val: "1,240", change: "+12% this term", color: "text-[#3CB371]" },
                  { title: "Platform Active", val: "94.6%", change: "Real-time sync", color: "text-[#0047AB]" },
                  { title: "Course Progress", val: "88.2%", change: "+4.2% average", color: "text-purple-600" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all">
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-tight">{stat.title}</div>
                    <div className={`text-base sm:text-2xl font-black ${stat.color} my-1`}>{stat.val}</div>
                    <div className="text-[8px] sm:text-[10px] text-slate-400 font-bold leading-none">{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* ERP Activity log Simulator */}
              <div className="bg-slate-950 text-white rounded-2xl p-3.5 sm:p-5 border border-slate-800 space-y-2.5 sm:space-y-3 font-mono text-[10px] sm:text-xs">
                <div className="text-[9px] sm:text-[10px] text-[#3CB371] font-bold uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-[#3CB371] animate-ping" />
                  Edu-Alt-Tech ERP Database Logs
                </div>
                <div className="space-y-1 sm:space-y-1.5 text-slate-300">
                  <div className="break-words">[09:20:41] <span className="text-[#3CB371]">SUCCESS</span>: Synchronized class recordings (Physics L3)</div>
                  <div className="break-words">[09:25:12] <span className="text-[#3CB371]">SUCCESS</span>: Subtitle translations generated (Hindi, Telugu)</div>
                  <div className="break-words">[09:31:00] <span className="text-[#0047AB]">INFO</span>: Pushed grade reports to 542 parent mobile applications</div>
                  <div className="break-words">[09:40:02] <span className="text-[#3CB371]">SUCCESS</span>: ERP Billing gateway resolved. System online.</div>
                </div>
              </div>

              {/* Connected Node Diagram teaser */}
              <div className="border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-slate-50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700">Integrate Website + Parents Mobile Apps</span>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <div className="w-2 h-2 rounded-full bg-[#3CB371] animate-pulse-soft" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">Dual Node Connected</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SchoolTechSolutions;
