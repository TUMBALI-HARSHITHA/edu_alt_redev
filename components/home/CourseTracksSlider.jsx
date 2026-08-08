import React, { useState, useEffect } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { MotionDiv } from "../../src/shared/hooks/useMotion";
import { Link } from "react-router-dom";

const courseTracks = [
  {
    id: 1,
    title: "Academic Subjects",
    category: "Structured Tracks",
    items: [
      "Mathematics Mastery",
      "Conceptual Physics",
      "Core Chemistry",
      "English Language Studies",
    ],
    color: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-[0_20px_50px_-10px_rgba(16,185,129,0.35)]",
  },
  {
    id: 2,
    title: "Future Tech Skills",
    category: "Structured Tracks",
    items: [
      "Artificial Intelligence",
      "Full Stack Development",
      "Information Security",
      "Analytics & Databases",
    ],
    color: "from-blue-500 to-indigo-500",
    shadowColor: "shadow-[0_20px_50px_-10px_rgba(59,130,246,0.35)]",
  },
  {
    id: 3,
    title: "Professional Careers",
    category: "Structured Tracks",
    items: [
      "Digital Marketing Hub",
      "Public Speaking",
      "Personal Finance",
      "Startup Incubation",
    ],
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-[0_20px_50px_-10px_rgba(245,158,11,0.35)]",
  },
  {
    id: 4,
    title: "Creative Fields",
    category: "Structured Tracks",
    items: [
      "Instrumental Music",
      "Choreography & Dance",
      "Visual UI/UX Design",
      "Cinematography Basics",
    ],
    color: "from-purple-500 to-pink-500",
    shadowColor: "shadow-[0_20px_50px_-10px_rgba(168,85,247,0.35)]",
  },
];

const CourseTracksSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % courseTracks.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = courseTracks[currentSlide];

  return (
    <div className="relative w-full max-w-md mx-auto lg:ml-0 h-[450px] my-4">
      {/* Decorative background cards to build the deck visual effect */}
      <div className="absolute inset-0 bg-white/50 rounded-[2.5rem] border border-slate-200/60 transform rotate-3 scale-[0.96] translate-y-2 shadow-md transition-all duration-500" />
      <div className="absolute inset-0 bg-white/80 rounded-[2.5rem] border border-slate-200/80 transform -rotate-2 scale-[0.98] translate-y-1 shadow-lg transition-all duration-500" />

      {/* Main active sliding card */}
      <MotionDiv
        key={slide.id}
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -40, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`absolute inset-0 bg-white border border-slate-200 rounded-[2.5rem] p-7 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 ${slide.shadowColor}`}
      >
        <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${slide.color} opacity-20 blur-3xl rounded-full`} />
        
        <div className="relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 tracking-tight">
            {slide.title}
          </h3>
          <ul className="space-y-3.5">
            {slide.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#3CB371]" />
                <span className="text-slate-700 font-bold text-sm sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3CB371]" />
            Syllabus Available
          </span>
          <Link to="/courses" className="text-sm font-black text-[#3CB371] hover:text-emerald-700 inline-flex items-center gap-1 group transition-colors">
            Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </MotionDiv>

      {/* Dots navigation */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2.5">
        {courseTracks.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "bg-[#3CB371] w-8" : "bg-slate-300 hover:bg-emerald-300 w-2.5"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseTracksSlider;

