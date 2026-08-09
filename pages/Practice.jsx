import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Youtube, Code2, BookOpen, Briefcase, Sparkles, ExternalLink, GraduationCap, X } from "lucide-react";
import { normalizeSearch } from "../lib/search";
import { POPULAR_PROBLEMS, LEETCODE_150_PROBLEMS, TOP_INTERVIEW_150, FULL_COURSES, INTERVIEW_EXPERIENCES, YOUTUBE_CHANNELS, ENGLISH_EXERCISES } from "../data/problems";
import { auth, onAuthStateChanged, db, collection, getDocs, query, orderBy } from "../lib/firebase";
import LoginModal from "../components/LoginModal";
import { recordLearningActivity } from "../lib/streak";

const difficultyColors = {
  Easy: "bg-emerald-100 text-emerald-700 border-emerald-200 ",
  Medium: "bg-amber-100 text-amber-700 border-amber-200 ",
  Hard: "bg-red-100 text-red-700 border-red-200 "
};
const tabs = [
  { key: "problems", label: "Problems", icon: <Code2 className="w-4 h-4" /> }, { key: "courses", label: "Full Courses", icon: <BookOpen className="w-4 h-4" /> }, { key: "interviews", label: "Interviews", icon: <Briefcase className="w-4 h-4" /> }, { key: "english", label: "English", icon: <BookOpen className="w-4 h-4" /> }, { key: "channels", label: "Channels", icon: <GraduationCap className="w-4 h-4" /> }
];
function ProblemCard({ problem, user, onLockedClick }) {
  const handleAction = (e) => {
    if (!user) {
      e.preventDefault();
      onLockedClick();
      return;
    }
    recordLearningActivity(user, `Solved ${problem.title}`);
    (async () => {
      try {
        await db.from("practice_history").insert({
          user_id: user.uid,
          practice_type: "leetcode",
          item_id: problem.num,
          item_title: problem.title,
          opened_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch {
      }
    })();
  };
  return <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="border border-slate-300/90 bg-white/95 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-purple-500 hover:-translate-y-0.5 transition-all duration-300 min-w-0"
  >
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3"> <div className="flex-1 min-w-0">
   <div className="flex items-center gap-2 mb-1"> <span className="text-[10px] sm:text-xs font-bold text-slate-400 shrink-0">#{problem.num}</span>
                   <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate break-words">{problem.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap"> <span className="text-[11px] sm:text-xs font-medium text-slate-500 break-words">{problem.topic}</span>
  <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold border ${difficultyColors[problem.difficulty] || ""}`}>
  {problem.difficulty}
  </span>
  </div>
  {problem.companies && problem.companies.length > 0 && <div className="flex items-center gap-1.5 mt-2 flex-wrap"> {problem.companies.slice(0, 3).map((c, i) => <span key={i} className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[120px] sm:max-w-none">
  {c.name} {c.count > 0 && `(${c.count})`}
  </span>)}
  {problem.companies.length > 3 && <span className="text-[10px] text-slate-400 shrink-0">+{problem.companies.length - 3}</span>}
  </div>}
  </div>
  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
  <a
    href={problem.leetcodeUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:p-2.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-xl transition-colors text-xs sm:text-sm font-bold min-h-[38px]" title="Solve on LeetCode"
  >
  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="sm:hidden">Solve</span>
  </a>
  <a
    href={problem.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors text-xs sm:text-sm font-bold min-h-[38px]" title="Watch solution"
  >
  <Youtube className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="sm:hidden">Solution</span>
  </a>
  </div>
 </div>
 </motion.div>;
}
function CourseCard({ course, user, onLockedClick }) {
  const handleAction = (e) => {
    if (!user) {
      e.preventDefault();
      onLockedClick();
    }
  };
  return <a
    href={course.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="block border border-slate-300/90 bg-white/95 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-purple-500 hover:-translate-y-0.5 transition-all duration-300 group min-w-0"
  >
      <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-xl bg-emerald-100/20 text-emerald-500 flex items-center justify-center shrink-0">
          <Youtube className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0"> <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors whitespace-normal break-words">{course.title}</h3>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-emerald-500 transition-colors" />
      </div>
    </a>;
}
function InterviewCard({ interview, user, onLockedClick }) {
  const resultColors = {
    Hired: "text-emerald-600 bg-emerald-100/20",
    Selected: "text-blue-600 bg-blue-100/20",
    Rejected: "text-red-600 bg-red-100/20"
  };
  const handleAction = (e) => {
    if (!user) {
      e.preventDefault();
      onLockedClick();
    }
  };
  return <a
    href={interview.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="block border border-slate-300/90 bg-white/95 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-purple-500 hover:-translate-y-0.5 transition-all duration-300 group min-w-0"
  >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"> <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors whitespace-normal break-words">{interview.company}</h3> <p className="text-xs text-slate-500 mt-0.5 whitespace-normal break-words">{interview.interviewType}</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-slate-100 sm:border-t-0 shrink-0"> <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${resultColors[interview.result] || ""}`}>
            {interview.result}
          </span>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>
    </a>;
}
function EnglishExerciseCard({ exercise, user, onLockedClick }) {
  const handleAction = (e) => {
    if (!user) {
      e.preventDefault();
      onLockedClick();
      return;
    }
    recordLearningActivity(user, `English: ${exercise.title}`);
    (async () => {
      try {
        await db.from("practice_history").insert({
          user_id: user.uid,
          practice_type: "english",
          item_id: exercise.num,
          item_title: exercise.title,
          opened_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch {
      }
    })();
  };
  return <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="border border-slate-300/90 bg-white/95 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-purple-500 hover:-translate-y-0.5 transition-all duration-300 min-w-0"
  >
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3"> <div className="flex-1 min-w-0">
  <div className="flex items-center gap-2 mb-1"> <span className="text-[10px] sm:text-xs font-bold text-slate-400 shrink-0">#{exercise.num}</span>
                   <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate break-words">{exercise.title}</h3>
  </div>
 <div className="flex items-center gap-2 flex-wrap"> <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border bg-indigo-100 text-indigo-700 border-indigo-200 ">
 {exercise.level}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-2 sm:gap-1 w-full sm:w-auto shrink-0 justify-end mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
  <a
    href={exercise.practiceUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:p-2.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-xl transition-colors text-xs sm:text-sm font-bold min-h-[38px]" title="Practice on English-Exercises.org"
  >
  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="sm:hidden">Practice</span>
  </a>
  <a
    href={exercise.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors text-xs sm:text-sm font-bold min-h-[38px]" title="Watch video lesson"
  >
  <Youtube className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="sm:hidden">Video</span>
  </a>
 </div>
 </div>
 </motion.div>;
}
function ChannelCard({ channel, user, onLockedClick }) {
  const handleAction = (e) => {
    if (!user) {
      e.preventDefault();
      onLockedClick();
    }
  };
  return <div className="border border-slate-300/90 bg-white/95 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-purple-500 hover:-translate-y-0.5 transition-all duration-300 min-w-0">
      <a
    href={channel.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="flex items-center gap-3 group mb-3"
  >
        <div className="w-10 h-10 rounded-xl bg-red-100/20 text-red-500 flex items-center justify-center shrink-0"> <Youtube className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0"> <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors whitespace-normal break-words">{channel.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 whitespace-normal break-words">{channel.category}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-emerald-500 transition-colors" />
      </a>
      {channel.playlists && channel.playlists.length > 0 && <div className="border-t border-slate-100 pt-3 space-y-2">
          {channel.playlists.map((pl, i) => <a
    key={i}
    href={pl.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={handleAction}
    className="block p-2 rounded-lg hover: transition-colors group/pl"
  >
              <div className="flex items-start gap-2"> <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0"> <p className="text-xs font-semibold text-slate-700 group-hover/pl:text-emerald-600 transition-colors whitespace-normal break-words">{pl.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{pl.description}</p> <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${levelColors[pl.level] || ""}`}>
                    {pl.level}
                  </span>
                </div>
              </div>
            </a>)}
        </div>}
    </div>;
}
const levelColors = {
  Beginner: "bg-green-100/30 text-green-700 border-green-200",
  Intermediate: "bg-amber-100/30 text-amber-700 border-amber-200",
  Advanced: "bg-red-100/30 text-red-700 border-red-200"
};
const Practice = () => {
  const [tab, setTab] = useState("problems");
  const [problemSet, setProblemSet] = useState("popular");
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [englishSearch, setEnglishSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [adminProblems, setAdminProblems] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const snap = await getDocs(query(collection(db, "practice_problems"), orderBy("num", "asc")));
        const problems = snap.docs.map((d) => {
          const data = d.data();
          return { num: data.num, title: data.title, topic: data.topic || "", videoUrl: data.videoUrl || "", leetcodeUrl: data.leetcodeUrl || "", difficulty: data.difficulty || "Easy" };
        });
        setAdminProblems(problems);
      } catch {
      }
    };
    fetchAdmin();
  }, []);
  const currentProblems = problemSet === "popular" ? POPULAR_PROBLEMS : problemSet === "leetcode150" ? LEETCODE_150_PROBLEMS : problemSet === "top150" ? TOP_INTERVIEW_150 : adminProblems;
  const allTopics = useMemo(() => {
    const topics = new Set(currentProblems.map((p) => p.topic));
    return Array.from(topics).sort();
  }, [problemSet]);
  const filteredProblems = useMemo(() => {
    const normalizedSearch = normalizeSearch(search);
    return currentProblems.filter((p) => {
      const matchSearch = !normalizedSearch || normalizeSearch(p.title).includes(normalizedSearch) || String(p.num).includes(search);
      const matchTopic = !topicFilter || p.topic === topicFilter;
      const matchDiff = !diffFilter || p.difficulty === diffFilter;
      return matchSearch && matchTopic && matchDiff;
    });
  }, [currentProblems, search, topicFilter, diffFilter]);
  const displayedProblems = useMemo(() => {
    return !user ? filteredProblems.slice(0, 3) : filteredProblems;
  }, [filteredProblems, user]);
  const displayedCourses = useMemo(() => {
    return !user ? FULL_COURSES.slice(0, 3) : FULL_COURSES;
  }, [user]);
  const displayedInterviews = useMemo(() => {
    return !user ? INTERVIEW_EXPERIENCES.slice(0, 3) : INTERVIEW_EXPERIENCES;
  }, [user]);
  const filteredChannels = useMemo(() => {
    return YOUTUBE_CHANNELS.filter((c) => !channelFilter || c.category === channelFilter);
  }, [channelFilter]);
  const displayedChannels = useMemo(() => {
    return !user ? filteredChannels.slice(0, 3) : filteredChannels;
  }, [filteredChannels, user]);
  const allLevels = useMemo(() => {
    return Array.from(new Set(ENGLISH_EXERCISES.map((e) => e.level))).sort();
  }, []);
  const filteredEnglish = useMemo(() => {
    const normalizedSearch = normalizeSearch(englishSearch);
    return ENGLISH_EXERCISES.filter((e) => {
      const matchSearch = !normalizedSearch || normalizeSearch(e.title).includes(normalizedSearch) || normalizeSearch(e.level).includes(normalizedSearch) || String(e.num).includes(englishSearch);
      const matchLevel = !levelFilter || e.level === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [englishSearch, levelFilter]);
  const displayedEnglish = useMemo(() => {
    return !user ? filteredEnglish.slice(0, 3) : filteredEnglish;
  }, [filteredEnglish, user]);
  return <div className="practice-page-container min-h-screen pt-24 pb-20 sm:pt-32 sm:pb-32 px-4 md:px-6 relative overflow-hidden">
  <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[60px] rounded-full max-w-full" /> <div className="max-w-[1400px] mx-auto relative z-10">
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto mb-12 text-center flex flex-col items-center">
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight text-center">
      Master Coding & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">English Grammar</span>
    </h1>
    <p className="text-sm sm:text-lg text-slate-500 max-w-2xl font-medium text-center mx-auto">
      460+ LeetCode problems, 52 English grammar topics, video solutions, full courses, and interview prep.
    </p>
  </motion.div>

 {
    /* Tabs */
  }
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center gap-2.5 mb-8 border-b border-slate-200 pb-5 overflow-x-auto no-scrollbar">
  {tabs.map((t) => <button
    key={t.key}
    onClick={() => setTab(t.key)}
    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-sm font-extrabold transition-all whitespace-nowrap ${tab === t.key ? "bg-purple-600 text-white border border-purple-600 shadow-lg shadow-purple-500/25 scale-[1.02]" : "bg-white/90 text-slate-700 border border-slate-300/80 shadow-sm hover:border-purple-400 hover:bg-purple-50/80 hover:text-purple-700"}`}
  >
  {t.icon} {t.label}
  </button>)}
  </motion.div>

  {
    /* Tab Content Container */
  }
  <div className="min-h-[400px]">
  {
    /* Problems Tab */
  }
  {tab === "problems" && <>
   {
    /* Problem Set Toggle */
  }
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-2 sm:gap-2.5 mb-6 overflow-x-auto no-scrollbar">
    <button onClick={() => setProblemSet("popular")} className={`shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${problemSet === "popular" ? "bg-purple-600 text-white border border-purple-600 shadow-lg shadow-purple-500/25" : "bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-300 shadow-sm"}`}>Most Popular ({POPULAR_PROBLEMS.length})</button>
    <button onClick={() => setProblemSet("leetcode150")} className={`shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${problemSet === "leetcode150" ? "bg-purple-600 text-white border border-purple-600 shadow-lg shadow-purple-500/25" : "bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-300 shadow-sm"}`}>LeetCode 150 ({LEETCODE_150_PROBLEMS.length})</button>
    <button onClick={() => setProblemSet("top150")} className={`shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${problemSet === "top150" ? "bg-purple-600 text-white border border-purple-600 shadow-lg shadow-purple-500/25" : "bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-300 shadow-sm"}`}>Top Interview 150 ({TOP_INTERVIEW_150.length})</button>
    {adminProblems.length > 0 && <button onClick={() => setProblemSet("admin")} className={`shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${problemSet === "admin" ? "bg-purple-600 text-white border border-purple-600 shadow-lg shadow-purple-500/25" : "bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-300 shadow-sm"}`}>Custom ({adminProblems.length})</button>}
  </motion.div>

   {
    /* Filters */
  }
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3 mb-8"> <div className="relative w-full sm:flex-1 sm:max-w-sm">
    <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" />
    <input
    type="text"
    placeholder="Search problems..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm shadow-sm hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-900 placeholder-slate-400 transition-all"
  />
    </div>
  <div className="flex gap-2 w-full sm:w-auto">
    <select
    value={topicFilter}
    onChange={(e) => setTopicFilter(e.target.value)}
    className="flex-1 sm:flex-none px-2.5 sm:px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none min-w-0 sm:min-w-[140px] truncate transition-all"
  >
    <option value="">All Topics</option>
    {allTopics.map((t) => <option key={t} value={t}>{t}</option>)}
    </select>
    <select
    value={diffFilter}
    onChange={(e) => setDiffFilter(e.target.value)}
    className="flex-1 sm:flex-none px-2.5 sm:px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none min-w-0 sm:min-w-[140px] truncate transition-all"
  >
  <option value="">All Difficulties</option>
  <option value="Easy">Easy</option>
  <option value="Medium">Medium</option>
  <option value="Hard">Hard</option>
  </select>
  {(search || topicFilter || diffFilter) && <button
    onClick={() => {
      setSearch("");
      setTopicFilter("");
      setDiffFilter("");
    }}
    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2.5 border border-slate-200 rounded-xl text-[10px] sm:text-xs font-bold text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors shrink-0"
  >
      <X className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Clear
    </button>}
  </div>
  </motion.div>

 {
    /* Problem Grid */
  }
 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 {displayedProblems.map((p, _i) => <ProblemCard key={`${problemSet}-${p.num}`} problem={p} user={user} onLockedClick={() => setIsAuthModalOpen(true)} />)}
 </div>
 {displayedProblems.length === 0 && <p className="text-center text-slate-400 py-12 font-medium">No problems match your filters.</p>}
 </>}

  {
    /* Full Courses Tab */
  }
  {tab === "courses" && <>
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 sm:gap-4 mb-6"> <div className="relative flex-1 min-w-[140px] sm:min-w-[200px] max-w-sm">
      <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" />
      <input
    type="text"
    placeholder="Search courses..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 sm:py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm shadow-sm hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-900 placeholder-slate-400 transition-all"
  />
    </div>
  </motion.div>
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {displayedCourses.filter((c) => !search || normalizeSearch(c.title).includes(normalizeSearch(search))).map((c) => <CourseCard key={c.num} course={c} user={user} onLockedClick={() => setIsAuthModalOpen(true)} />)}
  </motion.div>
  </>}

 {
    /* Interview Experiences Tab */
  }
 {tab === "interviews" && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2">
 {displayedInterviews.map((i) => <InterviewCard key={i.num} interview={i} user={user} onLockedClick={() => setIsAuthModalOpen(true)} />)}
 </motion.div>}

 {
    /* English Exercises Tab */
  }
 {tab === "english" && <>
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-2 sm:gap-3 mb-8"> <div className="relative flex-1 min-w-[120px] sm:min-w-[160px] max-w-sm">
  <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" />
  <input
    type="text"
    placeholder="Search grammar..."
    value={englishSearch}
    onChange={(e) => setEnglishSearch(e.target.value)}
    className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 sm:py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm shadow-sm hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-900 placeholder-slate-400 transition-all"
  />
  </div>
   <select
    value={levelFilter}
    onChange={(e) => setLevelFilter(e.target.value)}
    className="px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none min-w-[100px] max-w-[140px] sm:max-w-none sm:min-w-[140px] truncate transition-all"
  >
  <option value="">All Levels</option>
  {allLevels.map((l) => <option key={l} value={l}>{l}</option>)}
  </select>
  {(englishSearch || levelFilter) && <button
    onClick={() => {
      setEnglishSearch("");
      setLevelFilter("");
    }}
    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 border border-slate-300 rounded-xl text-[10px] sm:text-xs font-bold text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors"
  >
      <X className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Clear
    </button>}
  </motion.div>
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 {displayedEnglish.map((e) => <EnglishExerciseCard key={e.num} exercise={e} user={user} onLockedClick={() => setIsAuthModalOpen(true)} />)}
 </motion.div>
 {displayedEnglish.length === 0 && <p className="text-center text-slate-400 py-12 font-medium">No English exercises match your criteria.</p>}
 </>}

  {
    /* Channels Tab */
  }
  {tab === "channels" && <>
   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-2 sm:gap-3 mb-6">
    <select
    value={channelFilter}
    onChange={(e) => setChannelFilter(e.target.value)}
    className="px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none min-w-[100px] max-w-[140px] sm:max-w-none sm:min-w-[140px] truncate transition-all"
  >
    <option value="">All Categories</option>
    {Array.from(new Set(YOUTUBE_CHANNELS.map((c) => c.category))).sort().map((cat) => <option key={cat} value={cat}>{cat}</option>)}
    </select>
    {channelFilter && <button
    onClick={() => setChannelFilter("")}
    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 border border-slate-200 rounded-xl text-[10px] sm:text-xs font-bold text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors"
  >
        <X className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Clear
      </button>}
   </motion.div>
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 {displayedChannels.map((ch) => <ChannelCard key={ch.num} channel={ch} user={user} onLockedClick={() => setIsAuthModalOpen(true)} />)}
 </motion.div>
 </>}

  </div>

  {
    /* Guest Lock Overlay */
  }
  {!user && <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative mt-12 py-8 sm:py-16 px-4 sm:px-8 rounded-3xl /20 border border-slate-200/50 backdrop-blur-2xl text-center overflow-hidden shadow-2xl"
  >
 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent pointer-events-none" /> <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
 <div className="relative z-10 max-w-md mx-auto"> <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white mb-6 shadow-xl shadow-emerald-500/20">
 <Code2 className="w-8 h-8" />
 </div>
<h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                  Unlock 450+ More Practice Items
 </h2>
 <p className="text-slate-500 mb-8 font-medium leading-relaxed">
 Join our community of developers to access complete LeetCode patterns, full video courses, real interview experiences, and premium channels.
 </p>
 <button
    onClick={() => setIsAuthModalOpen(true)}
    className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-600 hover:via-teal-600 hover:to-indigo-600 text-white rounded-2xl font-extrabold tracking-wide shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
  >
 Unlock Practice Platform
 </button>
 </div>
 </motion.div>}
 </div>
 <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
 </div>;
};
var stdin_default = Practice;
export {
  stdin_default as default
};
