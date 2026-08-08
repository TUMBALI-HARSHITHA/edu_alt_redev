import React from "react";
import { MotionDiv } from "../../src/shared/hooks/useMotion";
import CourseTracksSlider from "./CourseTracksSlider";

const WhyEduAlt = () => {
  const highlights = [
    { title: "Academic Excellence", image: "/why_academic_excellence.jpg" }, 
    { title: "Future Skills", image: "/why_future_skills.jpg" },       
    { title: "Career Development", image: "/why_career_dev.jpg" }, 
    { title: "Industry Mentorship", image: "/why_mentorship.jpg" },    
    { title: "Hands-on Projects", image: "/why_projects.jpg" },       
    { title: "Verified Degree Pathways", image: "/why_degree_pathways.jpg" }  
  ];

  return (
    <section id="why-edualt" className="pt-20 sm:pt-28 pb-20 px-6 relative bg-transparent border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-6 items-start">
          
          {/* Left Side: Heading, Subtitle & 2x3 Grid of Square Cards */}
          <div className="lg:col-span-7 space-y-6">
            <MotionDiv
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4 text-left"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.95] pb-2">
                Why Edu Alt Tech?
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl pb-3">
                One platform to explore, learn, and turn knowledge into real-world opportunities.
              </p>
            </MotionDiv>

            {/* 2 Rows of 3 Square Cards Grid */}
            <div className="grid grid-cols-3 gap-4 sm:gap-5 w-full max-w-2xl pt-2">
              {highlights.map((item, idx) => {
                const stepNumber = idx + 1;
                return (
                  <MotionDiv
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end"
                  >
                    {/* Background 3D Illustration Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Right Step Badge */}
                    <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/85 backdrop-blur-md text-[10px] sm:text-xs font-black text-slate-900 flex items-center justify-center shadow-md z-10 border border-white/50">
                      0{stepNumber}
                    </div>

                    {/* Translucent Lower Heading Banner */}
                    <div className="relative z-10 p-3.5 sm:p-4 bg-black/60 backdrop-blur-md border-t border-white/20 text-white min-h-[56px] sm:min-h-[66px] flex items-center">
                      <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-[#3CB371] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </div>

          {/* Right Side: Moving Sliding Cards Deck positioned down */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start pl-0 lg:pl-2 pt-10 lg:pt-28">
            <CourseTracksSlider />
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyEduAlt;




