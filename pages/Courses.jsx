import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { auth, onAuthStateChanged, db, collection, getDocs, query } from "../lib/firebase";
import { Search, Book, Sparkles, Globe, GraduationCap, Compass, ExternalLink, Clock, CircleDollarSign, X } from "lucide-react";
import { normalizeSearch } from "../lib/search";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "../components/LoginModal";
import { PLATFORM_COURSES } from "../data/platformCourses";
import { initCourseLearningTimer, recordLearningSeconds } from "../lib/sessionTimer";
const FOLDER_MAP = {
  "Core Education": "education",
  "Language Skills": "education",
  "Music": "education",
  "Dance": "education",
  "Arts & Creativity": "education",
  "Life Skills": "education",
  "Mind Sports": "education",
  "Health & Wellness": "education"
};
const EDUCATION_FOLDERS = /* @__PURE__ */ new Set(["Core Education", "Language Skills", "Music", "Dance", "Arts & Creativity", "Life Skills", "Mind Sports", "Health & Wellness"]);
function getThumbnail(title, folder) {
  const seed = encodeURIComponent((title || folder || "course").replace(/\s+/g, "-").toLowerCase().slice(0, 50));
  return `https://picsum.photos/seed/${seed}/400/225`;
}
const PROVIDER_LOGOS = {
  "DeepLearningAI": "https://www.deeplearning.ai/favicon.ico",
  "Hugging Face": "https://huggingface.co/front/assets/huggingface_logo.svg"
};
const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        initCourseLearningTimer(u, true);
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"));
        const querySnapshot = await getDocs(q);
        const fetchedCourses = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const folder = data.folder || data.category || "";
          fetchedCourses.push({
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            category: FOLDER_MAP[folder] || "alternative",
            price: data.price ?? 0,
            thumbnailUrl: data.thumbnailUrl || getThumbnail(data.title || "Course", folder),
            folder,
            duration: data.duration,
            level: data.level,
            classLevel: data.classLevel || data.class_level || "General",
            comingSoon: data.comingSoon ?? data.coming_soon ?? false,
            createdAt: data.createdAt || data.created_at,
            createdBy: data.createdBy || ""
          });
        });
        AI_COURSES.forEach((provider, pi) => {
          provider.courses.forEach((course, ci) => {
            const courseTitle = typeof course === "string" ? course : course.title;
            const courseUrl = typeof course === "string" ? provider.url : course.url;
            fetchedCourses.push({
              id: `ai-${pi}-${ci}`,
              title: courseTitle,
              description: `Free course from ${provider.name}. Master ${courseTitle.toLowerCase()} with industry-leading curriculum.`,
              category: "alternative",
              price: 0,
              thumbnailUrl: `https://picsum.photos/seed/${provider.name.toLowerCase().replace(/\s+/g, "-")}-${ci}/400/225`,
              folder: "Artificial Intelligence",
              duration: "Self-paced",
              level: "beginner",
              classLevel: "General",
              comingSoon: false,
              provider: provider.name,
              externalUrl: courseUrl,
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              createdBy: "provider"
            });
          });
        });
        const { data: overrideRows } = await db.from("platform_overrides").select("*");
        const dbOverrides = {};
        const deletedIds = /* @__PURE__ */ new Set();
        if (overrideRows) {
          for (const row of overrideRows) {
            if (row.data?.__deleted) {
              deletedIds.add(row.id);
              continue;
            }
            dbOverrides[row.id] = row.data;
          }
        }
        const existingIds = new Set(fetchedCourses.map((c) => c.id));
        let platformCourses = PLATFORM_COURSES.map((pc, pi) => {
          const id = `pc-${pi}`;
          const base = { id, ...pc };
          return dbOverrides[id] ? { ...base, ...dbOverrides[id] } : base;
        }).filter((c) => !existingIds.has(c.id) && !deletedIds.has(c.id));
        try {
          const raw = localStorage.getItem("platformCourseOverrides");
          if (raw) {
            const localOverrides = JSON.parse(raw);
            platformCourses = platformCourses.map((c) => localOverrides[c.id] ? { ...c, ...localOverrides[c.id] } : c);
          }
          const localDeleted = JSON.parse(localStorage.getItem("platformCourseDeletions") || "[]");
          platformCourses = platformCourses.filter((c) => !localDeleted.includes(c.id));
        } catch {
        }
        fetchedCourses.push(...platformCourses);
        const providerCourses2 = fetchedCourses.filter((c) => c.id.startsWith("ai-"));
        const dbCourses2 = fetchedCourses.filter((c) => !c.id.startsWith("ai-") && !c.id.startsWith("pc-"));
        const plCourses = fetchedCourses.filter((c) => c.id.startsWith("pc-"));
        setCourses([...providerCourses2, ...plCourses, ...dbCourses2]);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  const filteredCourses = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchTerm);
    return courses.filter((course) => {
      if ((course.folder || "") === "Marketing") return false;
      const matchesSearch = !normalizedSearch || normalizeSearch(course.title).includes(normalizedSearch) || normalizeSearch(course.description || "").includes(normalizedSearch) || normalizeSearch(course.provider || "").includes(normalizedSearch) || normalizeSearch(course.folder || "").includes(normalizedSearch) || normalizeSearch(course.category || "").includes(normalizedSearch);
      let matchesCategory = true;
      if (activeFilter === "education") {
        matchesCategory = EDUCATION_FOLDERS.has(course.folder || "");
      } else if (activeFilter === "alternative") {
        matchesCategory = !EDUCATION_FOLDERS.has(course.folder || "");
      }
      let matchesPrice = true;
      const price = course.price ?? -1;
      if (priceFilter === "free") matchesPrice = price === 0;
      else if (priceFilter === "paid") matchesPrice = price > 0;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [courses, searchTerm, activeFilter, priceFilter]);
  const providerCourses = useMemo(() => filteredCourses.filter((c) => c.id.startsWith("ai-")), [filteredCourses]);
  const dbCourses = useMemo(() => filteredCourses.filter((c) => !c.id.startsWith("ai-")), [filteredCourses]);
  const displayedCourses = useMemo(() => filteredCourses, [filteredCourses]);
  return <>
  <Helmet>
    <title>Courses | Edu Alt Tech</title>
    <link rel="canonical" href="https://www.edualttech.com/#/courses" />
  </Helmet>
  <div className="min-h-screen selection:bg-emerald-500/30">
  <div className="fixed inset-0 overflow-hidden pointer-events-none"> <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[60px] rounded-full" />
  <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 blur-[60px] rounded-full" />
  </div>

  <div className="max-w-[1400px] mx-auto relative z-10 px-4 sm:px-6 py-16 md:py-24">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-4 md:mb-6 tracking-tighter leading-[1] md:leading-[0.85]">
        Explore Our{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600">
          Learning
        </span>{" "}
        Pathways.
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
        Curated courses from top providers and our own curriculum. Master in-demand skills with structured learning paths.
      </p>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-xl mx-auto">
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 backdrop-blur-xl bg-white/80 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#add8e6] transition-shadow font-medium placeholder:text-slate-400 text-sm shadow-sm"
        />
      </div>
      {(searchTerm || activeFilter !== "all" || priceFilter !== "all") && (
        <button
          onClick={() => {
            setSearchTerm("");
            setActiveFilter("all");
            setPriceFilter("all");
          }}
          className="flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 border border-slate-200 bg-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm shrink-0"
        >
          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Clear
        </button>
      )}
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10"
    >
      {[
        { id: "all", label: "All Courses", icon: Compass },
        { id: "education", label: "Subjective", icon: GraduationCap },
        { id: "alternative", label: "Alternative", icon: Sparkles }
      ].map((f) => (
        <button
          key={f.id}
          onClick={() => setActiveFilter(f.id)}
          className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black transition-all duration-200 shadow-sm ${
            activeFilter === f.id
              ? f.id === "education"
                ? "bg-[#add8e6] text-slate-900 shadow-md border border-slate-900/10"
                : f.id === "alternative"
                ? "bg-[#99e6b3] text-slate-900 shadow-md border border-slate-900/10"
                : "bg-slate-900 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
          }`}
        >
          <f.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {f.label}
        </button>
      ))}s alert)

      <div className="w-px h-7 sm:h-8 bg-slate-200 self-center mx-1" />
      {[
        { id: "all", label: "All Prices", icon: CircleDollarSign },
        { id: "free", label: "Free", icon: CircleDollarSign },
        { id: "paid", label: "Paid", icon: CircleDollarSign }
      ].map((f) => (
        <button
          key={f.id}
          onClick={() => setPriceFilter(f.id)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-200 shadow-sm ${
            priceFilter === f.id
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
          }`}
        >
          <f.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {f.label}
        </button>
      ))}
    </motion.div>

    {loading ? (
      <div className="flex flex-col items-center justify-center py-24 sm:py-40 gap-3 sm:gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ willChange: "transform" }}>
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-teal-600" />
        </motion.div>
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading courses...</p>
      </div>
    ) : filteredCourses.length > 0 ? (
      <>
        {/* Available Courses Section — paid first, then free */}
        {dbCourses.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-[#add8e6] text-slate-900 shadow-sm border border-slate-900/10">
                <Book className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Available Now</h2>
                <p className="text-xs text-slate-500 font-medium">Enroll and start learning today</p>
              </div>
            </div>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {displayedCourses.filter((c) => !c.id.startsWith("ai-")).map((course, idx) => {
                  const isBlue = idx % 2 === 0;
                  const bgColor = isBlue ? "#add8e6" : "#99e6b3";
                  const hoverGlow = isBlue
                    ? "hover:shadow-[0_20px_40px_rgba(173,216,230,0.55)]"
                    : "hover:shadow-[0_20px_40px_rgba(153,230,179,0.55)]";

                  return (
                    <motion.div
                      layout
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ backgroundColor: bgColor }}
                      className={`group rounded-[2rem] p-6 sm:p-7 text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${hoverGlow} flex flex-col justify-between relative overflow-hidden border border-white/50`}
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-3 py-1 bg-white/70 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/60">
                              {course.folder || course.category}
                            </span>
                            {course.classLevel && (
                              <span className="px-3 py-1 bg-white/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 border border-white/40">
                                {course.classLevel}
                              </span>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                              course.comingSoon
                                ? "bg-amber-500 text-white"
                                : "bg-slate-900 text-white"
                            }`}
                          >
                            {course.comingSoon ? "Coming Soon" : course.price === 0 ? "Free" : `₹${course.price}/month`}
                          </span>
                        </div>

                        {/* Soft Translucent Icon Circle */}
                        <div className="w-16 h-16 rounded-full bg-white/40 flex items-center justify-center text-slate-900 mb-6 shadow-sm mx-auto group-hover:scale-105 transition-transform duration-300 border border-white/50">
                          <Book className="w-8 h-8 text-slate-900" />
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-3 tracking-tight leading-snug line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed mb-6 line-clamp-3">
                          {course.description}
                        </p>
                      </div>

                      {/* Action Button - Routings fully intact */}
                      <div>
                        {course.comingSoon ? (
                          <span className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-amber-500/20 text-amber-900 rounded-xl font-bold text-xs sm:text-sm tracking-wide cursor-not-allowed border border-amber-500/30">
                            <Clock className="w-4 h-4" /> Coming Soon
                          </span>
                        ) : !user ? (
                          <button
                            onClick={() => navigate('/login', { state: { alert: "login to access resources..." } })}
                            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm tracking-wide hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md"
                          >
                            Explore Course →
                          </button>
                        ) : course.externalUrl ? (
                          <a
                            href={course.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm tracking-wide hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md"
                          >
                            Start Free <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <Link
                            to={`/courses/${course.id}`}
                            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm tracking-wide hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md"
                          >
                            Explore Course →
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* Provider Courses Section — free, shown after paid */}
        {providerCourses.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 sm:mb-12">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-6 flex-col sm:flex-row">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#99e6b3] text-slate-900 shadow-sm border border-slate-900/10">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">Free Courses</h2>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">From industry leaders</p>
                </div>
              </div>
              <div className="hidden sm:flex ml-auto items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">{providerCourses.length} courses</span>
                <div className="flex -space-x-2">
                  {AI_COURSES.slice(0, 5).map((p, i) => (
                    <img
                      key={i}
                      src={p.logo}
                      loading="lazy"
                      decoding="async"
                      alt={p.name}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {providerCourses.map((course, idx) => {
                const isBlue = (dbCourses.length + idx) % 2 === 0;
                const bgColor = isBlue ? "#add8e6" : "#99e6b3";
                const hoverGlow = isBlue
                  ? "hover:shadow-[0_20px_40px_rgba(173,216,230,0.55)]"
                  : "hover:shadow-[0_20px_40px_rgba(153,230,179,0.55)]";
                const provider = course.provider || "";

                return (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ backgroundColor: bgColor }}
                    className={`group rounded-[2rem] p-5 text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${hoverGlow} flex flex-col justify-between relative overflow-hidden border border-white/50`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-slate-900 shrink-0 shadow-sm border border-white/60">
                            {PROVIDER_LOGOS[provider] ? (
                              <img
                                src={PROVIDER_LOGOS[provider]}
                                loading="lazy"
                                decoding="async"
                                alt={provider}
                                className="w-4 h-4 rounded"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = '<div class="w-4 h-4 flex items-center justify-center text-xs font-bold">' + provider.charAt(0) + "</div>";
                                }}
                              />
                            ) : (
                              <span className="text-xs font-bold">{provider.charAt(0)}</span>
                            )}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 truncate max-w-[120px]">
                            {provider}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 bg-white/70 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border border-white/60">
                          Free
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 mb-2 leading-snug text-sm sm:text-base line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-800 leading-relaxed line-clamp-2 mb-4 font-medium">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-900/10 mt-auto">
                      <span className="text-[10px] font-bold text-slate-700">
                        {course.duration}
                      </span>
                      {!user ? (
                        <button
                          onClick={() => navigate('/login', { state: { alert: "login to access resources..." } })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm"
                        >
                          Start Free <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <a
                          href={course.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => recordLearningSeconds(user, 180)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm"
                        >
                          Start Free <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </>
    ) : (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 sm:py-24 px-4 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <Search className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4 sm:mb-6" />
        <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-2">No courses found</h3>
        <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6">Try a different search or filter.</p>
        <button
          onClick={() => {
            setSearchTerm("");
            setActiveFilter("all");
            setPriceFilter("all");
          }}
          className="px-6 sm:px-8 py-3 sm:py-3.5 bg-slate-900 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-md"
        >
          Reset Filters
        </button>
      </motion.div>
    )}
    <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
  </div>
  </div>
  </>;
};
const AI_COURSES = [
  { name: "DeepLearningAI", url: "https://www.deeplearning.ai/courses/", logo: "https://www.deeplearning.ai/favicon.ico", courses: [
    { title: "AI Prompting for Everyone", url: "https://www.deeplearning.ai/courses/ai-prompting-for-everyone/" },
    { title: "Build with Andrew", url: "https://www.deeplearning.ai/courses/build-with-andrew/" },
    { title: "Agentic AI", url: "https://www.deeplearning.ai/courses/agentic-ai/" },
    { title: "AI Python for Beginners", url: "https://www.deeplearning.ai/courses/ai-python-for-beginners/" },
    { title: "AI for Everyone", url: "https://www.deeplearning.ai/courses/ai-for-everyone/" },
    { title: "Generative AI for Everyone", url: "https://www.deeplearning.ai/courses/generative-ai-for-everyone/" },
    { title: "Machine Learning in Production", url: "https://www.deeplearning.ai/courses/machine-learning-in-production/" },
    { title: "RAG", url: "https://www.deeplearning.ai/courses/retrieval-augmented-generation-rag/" },
    { title: "Fast and Efficient LLM Inference with vLLM", url: "https://www.deeplearning.ai/courses/fast-and-efficient-llm-inference-with-vllm/" },
    { title: "ChatGPT Prompt Engineering for Developers", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
    { title: "LangChain for LLM Application Development", url: "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/" },
    { title: "Building Systems with ChatGPT API", url: "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/" },
    { title: "Building and Evaluating Advanced RAG", url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/" },
    { title: "Functions, Tools and Agents with LangChain", url: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/" },
    { title: "Finetuning Large Language Models", url: "https://www.deeplearning.ai/short-courses/finetuning-large-language-models/" },
    { title: "Building GenAI Apps with Gradio", url: "https://www.deeplearning.ai/short-courses/building-generative-ai-applications-with-gradio/" },
    { title: "Vector Databases: From Embeddings to Applications", url: "https://www.deeplearning.ai/short-courses/vector-databases-embeddings-applications/" },
    { title: "LLMs with Semantic Search", url: "https://www.deeplearning.ai/short-courses/large-language-models-semantic-search/" },
    { title: "How Diffusion Models Work", url: "https://www.deeplearning.ai/short-courses/how-diffusion-models-work/" },
    { title: "Building Apps with Vector Databases", url: "https://www.deeplearning.ai/short-courses/building-applications-vector-databases/" },
    { title: "Pretraining LLMs", url: "https://www.deeplearning.ai/short-courses/pretraining-llms/" },
    { title: "Generative AI with Large Language Models", url: "https://www.deeplearning.ai/courses/generative-ai-with-large-language-models/" },
    { title: "Prompt Engineering with Llama 2", url: "https://www.deeplearning.ai/short-courses/prompt-engineering-with-llama-2/" },
    { title: "Building and Evaluating Data Agents", url: "https://www.deeplearning.ai/short-courses/building-and-evaluating-data-agents/" },
    { title: "Automated Testing for LLMOps", url: "https://www.deeplearning.ai/short-courses/automated-testing-for-llmops/" },
    { title: "Quality and Safety for LLM Applications", url: "https://www.deeplearning.ai/short-courses/quality-safety-llm-applications/" },
    { title: "LangChain Chat with Your Data", url: "https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/" },
    { title: "Evaluating and Debugging Generative AI", url: "https://www.deeplearning.ai/short-courses/evaluating-debugging-generative-ai/" },
    { title: "Knowledge Graphs for RAG", url: "https://www.deeplearning.ai/short-courses/knowledge-graphs-rag/" },
    { title: "Multi AI Agent Systems with CrewAI", url: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/" },
    { title: "AI Agentic Design Patterns with AutoGen", url: "https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen/" },
    { title: "Building Agentic RAG with LlamaIndex", url: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/" },
    { title: "Serverless Agentic Workflows with Amazon Bedrock", url: "https://www.deeplearning.ai/short-courses/serverless-agentic-workflows-amazon-bedrock/" },
    { title: "AI Agents in LangGraph", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/" },
    { title: "Reasoning with o1", url: "https://www.deeplearning.ai/short-courses/reasoning-with-o1/" },
    { title: "Open Source Models with Hugging Face", url: "https://www.deeplearning.ai/short-courses/open-source-models-hugging-face/" },
    { title: "LLMOps", url: "https://www.deeplearning.ai/short-courses/llmops/" },
    { title: "AI Agents and Agentic AI", url: "https://www.deeplearning.ai/short-courses/ai-agents-and-agentic-ai/" },
    { title: "Building Code Agents with Hugging Face", url: "https://www.deeplearning.ai/short-courses/building-code-agents-hugging-face/" },
    { title: "Building Towards Computer Use with Anthropic", url: "https://www.deeplearning.ai/short-courses/building-towards-computer-use-anthropic/" },
    { title: "MCP: Build Rich-Context AI Apps with Anthropic", url: "https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/" },
    { title: "Build and Train an LLM with JAX", url: "https://www.deeplearning.ai/short-courses/build-and-train-an-llm-with-jax/" },
    { title: "Building Live Voice Agents with Google's ADK", url: "https://www.deeplearning.ai/short-courses/building-live-voice-agents-with-googles-adk/" },
    { title: "Fast Prototyping of GenAI Apps with Streamlit", url: "https://www.deeplearning.ai/short-courses/fast-prototyping-of-genai-apps-with-streamlit/" },
    { title: "Fine-tuning & RL for LLMs: Intro to Post-training", url: "https://www.deeplearning.ai/short-courses/fine-tuning-rl-for-llms-intro-to-post-training/" },
    { title: "Design, Develop and Deploy Multi-Agent Systems with CrewAI", url: "https://www.deeplearning.ai/short-courses/design-develop-deploy-multi-agent-systems-crewai/" },
    { title: "Build Apps with Windsurf's AI Coding Agents", url: "https://www.deeplearning.ai/short-courses/build-apps-with-windsurfs-ai-coding-agents/" },
    { title: "Prompt Engineering for Vision Models", url: "https://www.deeplearning.ai/short-courses/prompt-engineering-for-vision-models/" },
    { title: "Efficiently Serving LLMs", url: "https://www.deeplearning.ai/short-courses/efficiently-serving-llms/" },
    { title: "Building AI Browser Agents", url: "https://www.deeplearning.ai/short-courses/building-ai-browser-agents/" },
    { title: "Event Driven Agentic Document Workflows", url: "https://www.deeplearning.ai/short-courses/event-driven-agentic-document-workflows/" },
    { title: "Practical Multi AI Agents and Advanced Use Cases", url: "https://www.deeplearning.ai/short-courses/practical-multi-ai-agents/" },
    { title: "Building AI Powered Search Systems", url: "https://www.deeplearning.ai/short-courses/building-ai-powered-search-systems/" },
    { title: "Embedding Models From Theory to Practice", url: "https://www.deeplearning.ai/short-courses/embedding-models-from-theory-to-practice/" },
    { title: "Advanced Retrieval for AI Applications", url: "https://www.deeplearning.ai/short-courses/advanced-retrieval-for-ai-applications/" },
    { title: "Building Agent Memory Systems", url: "https://www.deeplearning.ai/short-courses/building-agent-memory-systems/" },
    { title: "Evaluating AI Agents", url: "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/" },
    { title: "Building AI Applications with Open Source Models", url: "https://www.deeplearning.ai/short-courses/building-ai-applications-open-source-models/" },
    { title: "Production RAG Systems", url: "https://www.deeplearning.ai/short-courses/production-rag-systems/" },
    { title: "Agent Communication Protocols", url: "https://www.deeplearning.ai/short-courses/agent-communication-protocols/" }
  ] },
  { name: "Hugging Face", url: "https://huggingface.co/learn", logo: "https://huggingface.co/front/assets/huggingface_logo.svg", courses: [
    { title: "LLM Course", url: "https://huggingface.co/learn/llm-course" },
    { title: "Agents Course", url: "https://huggingface.co/learn/agents-course" },
    { title: "Computer Vision Course", url: "https://huggingface.co/learn/computer-vision-course" },
    { title: "Deep Reinforcement Learning Course", url: "https://huggingface.co/learn/deep-rl-course" },
    { title: "Diffusion Course", url: "https://huggingface.co/learn/diffusion-course" },
    { title: "ML for Games Course", url: "https://huggingface.co/learn/ml-games-course" },
    { title: "Robotics Course", url: "https://huggingface.co/learn/robotics-course" },
    { title: "a smol course", url: "https://huggingface.co/learn/smol-course" },
    { title: "Open-Source AI Cookbook", url: "https://huggingface.co/learn/cookbook" }
  ] }
];
var stdin_default = Courses;
export {
  AI_COURSES,
  stdin_default as default
};
