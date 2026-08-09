import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User as LucideUser, ChevronDown, ChevronRight } from "lucide-react";
import { auth, db, onAuthStateChanged, doc, getDoc } from "../lib/firebase";
import { updateLoginStreak } from "../lib/streak";
import { initGlobalSessionTimer } from "../lib/sessionTimer";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isReloadBlinking, setIsReloadBlinking] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loaded = sessionStorage.getItem("hasLoadedBefore");
    if (loaded === "true") {
      setIsReloadBlinking(true);
      const timer = setTimeout(() => {
        setIsReloadBlinking(false);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      initGlobalSessionTimer(currentUser);
      if (currentUser) {
        updateLoginStreak(currentUser);
        try {
          const docSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (docSnap.exists()) setUserProfile(docSnap.data());
        } catch (e) {
          console.error(e);
        }
      } else setUserProfile(null);
    });
    return () => unsubscribe();
  }, []);

  // Smooth scroll to hash when navigating
  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const pageSections = {
    "/": [
      { name: "Why EduAltTech", hash: "why-edualt" },
      { name: "Featured Programs", hash: "featured-programs" },
      { name: "Curated Resources", hash: "resources" },
      { name: "Learning Path", hash: "learning-path" },
      { name: "School Tech Partner", hash: "school-tech" },
      { name: "Global Footprint", hash: "stats" }
    ],
    "/about": [
      { name: "Educational Paradigm", hash: "paradigm" },
      { name: "Our Vision & Mission", hash: "vision" }
    ],
    "/services": [
      { name: "Web Services", hash: "web-services" },
      { name: "App Services", hash: "app-services" },
      { name: "Design Services", hash: "design-services" },
      { name: "School ERP Solutions", hash: "erp-solutions" }
    ],
    "/practice": [
      { name: "Interactive Quizzes", hash: "quizzes" },
      { name: "Flashcard Decks", hash: "flashcards" },
      { name: "Mock Diagnostics", hash: "mock-exams" },
      { name: "AI Doubt Solver", hash: "doubt-solver" }
    ],
    "/resources": [
      { name: "Textbook PDFs", hash: "textbooks" },
      { name: "Question Banks", hash: "question-banks" },
      { name: "Conceptual Worksheets", hash: "worksheets" },
      { name: "AI Learning Manuals", hash: "ai-manuals" }
    ],
    "/courses": [
      { name: "AI Fundamentals", hash: "ai" },
      { name: "Full Stack Development", hash: "fullstack" },
      { name: "Entrepreneurship", hash: "startups" },
      { name: "Advanced Mathematics", hash: "math" }
    ],
    "/contact": [
      { name: "Get In Touch", hash: "contact-form" },
      { name: "School Partnerships", hash: "partnerships" },
      { name: "Office Locations", hash: "locations" }
    ]
  };

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Practice", path: "/practice" },
    { name: "Resources", path: "/resources" },
    { name: "Courses", path: "/courses" },
    { name: "Contact", path: "/contact" }
  ];

  const loggedInLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Practice", path: "/practice" },
    { name: "Resources", path: "/resources" },
    { name: "Dashboard", path: "/dashboard" }
  ];

  const isAdmin = userProfile?.role === "admin" || user?.email === "ukkukk97@gmail.com" || user?.email === "umakrishnakanthchokkapu15@gmail.com";
  let navLinks = user ? [...loggedInLinks] : [...publicLinks];
  if (user && isAdmin) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  const handleSectionClick = (path, hash) => {
    setHoveredNav(null);
    setIsOpen(false);
    if (location.pathname === path) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate(`${path}#${hash}`);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-bg-secondary/80 backdrop-blur-2xl border-b border-border/60 shadow-xl shadow-border/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className={`flex items-center gap-2 group ${isReloadBlinking ? "reload-logo-blink" : ""}`}>
              <div className="w-12 h-12 flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden rounded-xl">
                <img
                  src="/logo.png"
                  loading="lazy"
                  decoding="async"
                  alt="EduAltTech Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14">LOGO</text></svg>';
                  }}
                />
              </div>
              <div>
                <span className="text-lg font-bold text-heading tracking-tight leading-tight block font-georgia" style={{ fontFamily: 'Georgia, serif' }}>EduAltTech</span>
                <span className="text-[10px] font-semibold text-emerald-600 tracking-widest uppercase leading-tight hidden sm:block">
                  Education Technology Partner
                </span>
              </div>
            </Link>

            {/* Desktop Navbar Links with Dropdowns */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => {
                  const hasSections = pageSections[link.path] && pageSections[link.path].length > 0;
                  const isHovered = hoveredNav === link.name;
                  const isActive = location.pathname === link.path;

                  return (
                    <div
                      key={link.name}
                      className="relative py-2"
                      onMouseEnter={() => setHoveredNav(link.name)}
                      onMouseLeave={() => setHoveredNav(null)}
                    >
                      <Link
                        to={link.path}
                        className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
                          isActive ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
                        }`}
                      >
                        {link.name}
                        {hasSections && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isHovered ? "rotate-180 text-primary" : "text-slate-400"
                            }`}
                          />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isHovered && hasSections && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 min-w-[210px] bg-white rounded-2xl p-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200/90 z-50 overflow-hidden"
                          >
                            <div className="flex flex-col gap-0.5">
                              {pageSections[link.path].map((sec) => (
                                <button
                                  key={sec.name}
                                  onClick={() => handleSectionClick(link.path, sec.hash)}
                                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0047AB] hover:bg-blue-50/70 transition-all flex items-center justify-between group/item"
                                >
                                  <span>{sec.name}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-[#0047AB] group-hover/item:translate-x-0.5 transition-all" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pl-6 border-l border-border">
                {!user ? (
                  <Link
                    to="/login"
                    className="relative inline-flex items-center bg-gradient-to-r from-[#0047AB] via-[#003888] to-[#002D6C] hover:from-[#003888] hover:to-[#002050] text-white rounded-2xl overflow-hidden shadow-md shadow-blue-600/25 transition-all group border border-blue-400/30 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span className="px-5 py-2.5 font-black text-sm text-white tracking-wide">
                      Log In
                    </span>
                    <div className="bg-[#00255A] h-full py-2.5 pl-3.5 pr-2.5 flex items-center justify-center [clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)]">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-0.5 transition-transform">
                        <ChevronRight className="w-4 h-4 text-[#0047AB]" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 bg-surface-2 rounded-xl hover:bg-surface transition-colors border border-border shadow-sm"
                  >
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-sm overflow-hidden">
                      {userProfile?.profilePic ? (
                        <img
                          src={userProfile.profilePic}
                          loading="lazy"
                          decoding="async"
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userProfile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setIsOpen(!isOpen)} className="text-heading p-2" aria-label="Toggle menu">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-0 z-[100] bg-bg flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-border">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="w-12 h-12 overflow-hidden rounded-xl">
                  <img src="/logo.png" loading="lazy" decoding="async" alt="EduAltTech Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-bold text-heading tracking-tight font-georgia" style={{ fontFamily: 'Georgia, serif' }}>EduAltTech</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-surface-2 rounded-xl text-heading">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-2 p-6 overflow-y-auto">
              {navLinks.map((link, idx) => {
                const hasSections = pageSections[link.path] && pageSections[link.path].length > 0;
                const isExpanded = mobileExpanded === link.name;

                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.1 }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`text-base font-semibold px-5 py-3.5 rounded-xl transition-colors flex-1 block ${
                            location.pathname === link.path
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-text-secondary hover:bg-surface hover:text-heading"
                          }`}
                        >
                          {link.name}
                        </Link>
                        {hasSections && (
                          <button
                            onClick={() => setMobileExpanded(isExpanded ? null : link.name)}
                            className="p-3 text-slate-400 hover:text-primary"
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>

                      {/* Mobile Accordion Sub-items */}
                      {hasSections && isExpanded && (
                        <div className="pl-6 pt-1 pb-2 flex flex-col gap-1">
                          {pageSections[link.path].map((sec) => (
                            <button
                              key={sec.name}
                              onClick={() => handleSectionClick(link.path, sec.hash)}
                              className="text-left px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-primary hover:bg-surface transition-colors flex items-center justify-between"
                            >
                              <span>{sec.name}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.2 }}
                className="mt-auto space-y-3"
              >
                {!user ? (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="relative flex items-center justify-between bg-gradient-to-r from-[#0047AB] via-[#003888] to-[#002D6C] text-white px-6 py-3.5 rounded-2xl font-black text-center shadow-lg shadow-blue-600/25 transition-all"
                  >
                    <span>Log In</span>
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <ChevronRight className="w-4 h-4 text-[#0047AB]" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-colors"
                  >
                    <LucideUser className="w-5 h-5" /> Profile
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

