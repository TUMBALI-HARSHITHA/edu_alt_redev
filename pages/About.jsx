import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Users, BookOpen, Rocket, Globe, HeartHandshake, Sparkles, Linkedin, Mail, GraduationCap, Code2, Zap, Award, CheckCircle, Play, Hammer, MapPin, MessageCircle, RefreshCw, Palette, Briefcase } from "lucide-react";
import { TEAM, SUPPORTING_TEAM } from "../constants";
import { MotionDiv } from "../src/shared/hooks/useMotion";
const About = () => {
  return <div className="min-h-screen pt-40 md:pt-24 lg:pt-28 pb-24 sm:pb-32 transition-colors duration-300 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none"> <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[60px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[60px] rounded-full" /> <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-purple-500/10 blur-[60px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">

        {
    /* Mission Hero */
  }
        <MotionDiv initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center max-w-4xl mx-auto mb-28">
          <h1 className="text-[2rem] sm:text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]"> Empowering the Next Generation of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 animate-shimmer-text">Innovators</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto mb-12">
            Education should prepare you for tomorrow, not just the next exam. We built Edu Alt Tech to bridge the gap between traditional academics and the real-world skills you actually need to thrive.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
    { icon: <Target className="w-10 h-10" />, title: "Our Vision", desc: "A world where learning and real-world skills go hand-in-hand—making every learner future-ready.", bgColor: "#add8e6" },
    { icon: <HeartHandshake className="w-10 h-10" />, title: "Our Promise", desc: "We partner with you to deliver high-quality, relevant education that actually opens doors.", bgColor: "#99e6b3" },
    { icon: <Rocket className="w-10 h-10" />, title: "Our Drive", desc: "Continuous innovation. We evolve our platform every day to keep you ahead of industry trends.", bgColor: "#add8e6" }
  ].map((item, idx) => <div
    key={idx}
    className="rounded-[2rem] p-8 text-center text-slate-800 shadow-sm transition-transform duration-300 hover:-translate-y-1"
    style={{ backgroundColor: item.bgColor }}
  >
                <div className="w-20 h-20 mx-auto rounded-full bg-white/40 flex items-center justify-center text-slate-800 mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-3">{item.title}</h3>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">{item.desc}</p>
              </div>)}
          </div>
        </MotionDiv>

        {
    /* Our Story */
  }
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 max-w-4xl mx-auto text-center">
          <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter text-center">Why We Built Edu Alt Tech</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg text-left sm:text-center">
            <p>We realized something was missing: schools teach for exams, but the real world demands skills. So, we built a platform that masters both.</p>
            <p><strong>🎓 For Students:</strong> We offer everything from AI, coding, and digital marketing to the creative arts—plus top-tier academic support in core subjects.</p>
            <p><strong>🏫 For Schools:</strong> We drive your digital transformation with custom websites, mobile apps, ERP systems, and smart AI tools.</p>
            <p className="font-medium text-slate-800">We don't just build software or host courses; we build long-term partnerships with genuine mentorship and support to help you succeed.</p>
          </div>
        </MotionDiv>

        {
    /* Team */
  }
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 relative">
          {
    /* Background decoration */
  }
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[4rem]"> <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-emerald-200/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-indigo-200/40" /> <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-teal-200/40" />
            <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-indigo-500/8 blur-[80px] rounded-full" /> <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-emerald-500/8 blur-[80px] rounded-full" />
          </div>

          <div className="text-center mb-16 relative z-10">
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter text-center"> Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-500 to-teal-500">Team</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-500 max-w-xl mx-auto text-center">The innovators, builders, and creators shaping the future of Edu Alt Tech</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {TEAM.map((member, idx) => <TeamCard key={idx} idx={idx} member={member} />)}
          </div>
        </MotionDiv>

        {
    /* Supporting Team */
  }
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 relative"> <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-orange-500/5 rounded-[4rem] blur-3xl pointer-events-none" />
          <div className="text-center mb-16 relative z-10">
            <MotionDiv
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 !text-amber-700 font-bold uppercase tracking-widest text-[10px] mb-6"
  >
              <Users className="w-4 h-4" />
              Supporting Team
            </MotionDiv>
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter"> Behind the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Scenes</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-500">The dedicated folks who keep things running smoothly</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 relative z-10"> {SUPPORTING_TEAM.map((member, idx) => <div key={idx} className="w-full sm:w-80">
                <TeamCard idx={idx} member={member} />
              </div>)}
          </div>
        </MotionDiv>

        
      </div>
    </div>;
};
const cardAccents = [
  { from: "from-emerald-500", to: "to-teal-400", glow: "shadow-emerald-500/20", ring: "ring-emerald-400/60", light: "bg-emerald-50 !text-emerald-700", dot: "bg-emerald-400" },
  { from: "from-blue-500", to: "to-indigo-400", glow: "shadow-blue-500/20", ring: "ring-blue-400/60", light: "bg-blue-50 !text-blue-700", dot: "bg-blue-400" },
  { from: "from-violet-500", to: "to-purple-400", glow: "shadow-violet-500/20", ring: "ring-violet-400/60", light: "bg-violet-50 !text-violet-700", dot: "bg-violet-400" },
  { from: "from-amber-500", to: "to-orange-400", glow: "shadow-amber-500/20", ring: "ring-amber-400/60", light: "bg-amber-50 !text-amber-700", dot: "bg-amber-400" },
  { from: "from-rose-500", to: "to-pink-400", glow: "shadow-rose-500/20", ring: "ring-rose-400/60", light: "bg-rose-50 !text-rose-700", dot: "bg-rose-400" },
  { from: "from-cyan-500", to: "to-sky-400", glow: "shadow-cyan-500/20", ring: "ring-cyan-400/60", light: "bg-cyan-50 !text-cyan-700", dot: "bg-cyan-400" },
  { from: "from-fuchsia-500", to: "to-pink-400", glow: "shadow-fuchsia-500/20", ring: "ring-fuchsia-400/60", light: "bg-fuchsia-50 !text-fuchsia-700", dot: "bg-fuchsia-400" },
  { from: "from-lime-500", to: "to-emerald-400", glow: "shadow-lime-500/20", ring: "ring-lime-400/60", light: "bg-lime-50 !text-lime-700", dot: "bg-lime-400" }
];
function TeamCard({ member, idx }) {
  const [imgError, setImgError] = React.useState(false);
  const accent = cardAccents[idx % cardAccents.length];
  return <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay: idx * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -6 }}
    className={`group relative bg-slate-900 rounded-[1.75rem] overflow-hidden shadow-2xl ${accent.glow} flex flex-col h-full`}
  >
      {
    /* Diagonal gradient background decoration */
  }
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.from} ${accent.to} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${accent.from} ${accent.to} opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4`} />

      {
    /* Index number watermark */
  }
      <div className={`absolute top-4 left-4 text-[4rem] font-black leading-none bg-gradient-to-br ${accent.from} ${accent.to} bg-clip-text text-transparent opacity-10 select-none`}>
        {String(idx + 1).padStart(2, "0")}
      </div>

      <div className="relative z-10 p-6 flex flex-col items-center text-center flex-1">
        {
    /* Avatar with glowing ring */
  }
        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 mb-5 mt-2 flex-shrink-0`}>
          {
    /* Glow ring */
  }
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accent.from} ${accent.to} blur-md opacity-50 scale-110`} />
          <div className={`relative w-full h-full rounded-full overflow-hidden ring-2 ${accent.ring} bg-slate-800`}>
            {member.image && !imgError ? <img
    src={member.image}
    loading="lazy"
    decoding="async"
    alt={member.name}
    className="w-full h-full object-cover"
    onError={() => setImgError(true)}
  /> : <div className={`w-full h-full flex items-center justify-center font-black text-2xl bg-gradient-to-br ${accent.from} ${accent.to} text-white`}>
                {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>}
          </div>
          {
    /* Online dot */
  }
          <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 ${accent.dot} rounded-full border-2 border-slate-900`} />
        </div>

        {
    /* Name */
  }
        <h3 className="text-sm sm:text-base font-black text-white mb-1.5 tracking-tight leading-snug px-1">{member.name}</h3>

        {
    /* Role badge */
  }
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${accent.light} mb-4`}>
          {member.role}
        </span>

        {
    /* Bio */
  }
        <p className="text-xs text-slate-400 leading-relaxed flex-1 mb-5">{member.bio}</p>

        {
    /* Social links */
  }
        {(member.email || member.linkedin) && <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-700/60 w-full">
            {member.email && <a
    href={`mailto:${member.email}`}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:!text-white transition-all text-xs font-semibold`}
  >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" /> Email
              </a>}
            {member.linkedin && <a
    href={member.linkedin}
    target="_blank"
    rel="noreferrer"
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-400 hover:!text-white transition-all text-xs font-semibold`}
  >
                <Linkedin className="w-3.5 h-3.5 flex-shrink-0" /> LinkedIn
              </a>}
          </div>}
      </div>
    </motion.div>;
}
var stdin_default = About;
export {
  stdin_default as default
};
