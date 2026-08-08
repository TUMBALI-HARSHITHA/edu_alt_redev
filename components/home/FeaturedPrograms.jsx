import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MotionDiv } from "../../src/shared/hooks/useMotion";
import { PLATFORM_COURSES } from "../../data/platformCourses";
import { 
  Star, 
  Brain, 
  Code2, 
  Lightbulb, 
  TrendingUp, 
  Calculator, 
  Atom, 
  Music, 
  Palette, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Button from "../Button";

const FeaturedPrograms = () => {
  const featured = [
    { title: "Artificial Intelligence Fundamentals", icon: <Brain className="w-6 h-6 text-[#0047AB] group-hover:text-white transition-colors" />, cardBg: "bg-[#add8e6]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#0047AB] group-hover:shadow-[0_0_15px_rgba(0,71,171,0.3)]", textHover: "group-hover:text-[#0047AB]", courseIdx: 0 },
    { title: "Full Stack Development", icon: <Code2 className="w-6 h-6 text-[#047857] group-hover:text-white transition-colors" />, cardBg: "bg-[#99e6b3]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#047857] group-hover:shadow-[0_0_15px_rgba(4,120,87,0.3)]", textHover: "group-hover:text-[#047857]", courseIdx: 1 },
    { title: "Entrepreneurship & Startups", icon: <Lightbulb className="w-6 h-6 text-[#0047AB] group-hover:text-white transition-colors" />, cardBg: "bg-[#add8e6]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#0047AB] group-hover:shadow-[0_0_15px_rgba(0,71,171,0.3)]", textHover: "group-hover:text-[#0047AB]", courseIdx: 3 },
    { title: "Digital Marketing Growth", icon: <TrendingUp className="w-6 h-6 text-[#047857] group-hover:text-white transition-colors" />, cardBg: "bg-[#99e6b3]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#047857] group-hover:shadow-[0_0_15px_rgba(4,120,87,0.3)]", textHover: "group-hover:text-[#047857]", courseIdx: 2 },
    { title: "Advanced Mathematics", icon: <Calculator className="w-6 h-6 text-[#0047AB] group-hover:text-white transition-colors" />, cardBg: "bg-[#add8e6]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#0047AB] group-hover:shadow-[0_0_15px_rgba(0,71,171,0.3)]", textHover: "group-hover:text-[#0047AB]", courseIdx: 7 },
    { title: "Physics Excellence Module", icon: <Atom className="w-6 h-6 text-[#047857] group-hover:text-white transition-colors" />, cardBg: "bg-[#99e6b3]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#047857] group-hover:shadow-[0_0_15px_rgba(4,120,87,0.3)]", textHover: "group-hover:text-[#047857]", courseIdx: 8 },
    { title: "Music & Creative Arts", icon: <Music className="w-6 h-6 text-[#0047AB] group-hover:text-white transition-colors" />, cardBg: "bg-[#add8e6]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#0047AB] group-hover:shadow-[0_0_15px_rgba(0,71,171,0.3)]", textHover: "group-hover:text-[#0047AB]", courseIdx: 9 },
    { title: "Creative Digital Design", icon: <Palette className="w-6 h-6 text-[#047857] group-hover:text-white transition-colors" />, cardBg: "bg-[#99e6b3]/70 backdrop-blur-md", baseColor: "bg-white/80", hoverClasses: "group-hover:bg-[#047857] group-hover:shadow-[0_0_15px_rgba(4,120,87,0.3)]", textHover: "group-hover:text-[#047857]", courseIdx: 5 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive items per view could be managed, but for simplicity we'll show 1 or 2 at a time 
  // depending on screen size or just slide one by one.
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // To show multiple items, we slice the array and wrap around
  const getVisibleCards = () => {
    // Show 3 cards on desktop, 1 on mobile
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 4;
    
    let visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(featured[(currentIndex + i) % featured.length]);
    }
    return visible;
  };

  return (
    <section id="featured-programs" className="py-32 px-6 relative bg-transparent">
      <div className="max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            Featured Learning Programs
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Join industry-led training modules designed to prepare you for building real solutions.
          </p>
        </MotionDiv>

        <div className="relative">
          <div className="flex gap-6 overflow-hidden py-8 justify-center">
            {getVisibleCards().map((course, idx) => {
              const courseId = `pc-${course.courseIdx}`;
              const courseData = PLATFORM_COURSES[course.courseIdx];
              return (
                <Link key={course.courseIdx + '-' + idx} to={`/courses/${courseId}`} className="block w-full sm:w-[320px] shrink-0">
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{
                      y: -10,
                      boxShadow: `0 20px 40px ${course.glow}`,
                      scale: 1.02
                    }}
                    className={`group ${course.cardBg} border border-slate-200/50 rounded-[2.5rem] p-7 transition-all duration-300 hover:border-slate-300 relative flex flex-col justify-between h-[280px]`}
                  >
                    <div>
                      <div className={`w-14 h-14 rounded-2xl ${course.baseColor} flex items-center justify-center mb-6 shadow-md transition-all duration-300 ${course.hoverClasses} group-hover:scale-110`}>
                        {course.icon}
                      </div>
                      <h3 className={`text-xl font-black text-slate-900 tracking-tight leading-snug transition-colors ${course.textHover}`}>
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-2">
                        {courseData?.duration || "Industry aligned curriculum"}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Level: {courseData?.level || "Beginner-Adv"}
                      </span>
                      <span className="text-xs font-black text-[#3CB371] inline-flex items-center gap-1 group-hover:text-[#2e8b57]">
                        Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </MotionDiv>
                </Link>
              );
            })}
          </div>
          
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-12 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-[#3CB371] hover:border-[#3CB371] transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-12 w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-[#3CB371] hover:border-[#3CB371] transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="dark" to="/courses" className="bg-[#0047AB] hover:bg-[#003580] text-white border-none">
            View All Courses <ArrowRight className="w-5 h-5" />
          </Button>
        </MotionDiv>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
