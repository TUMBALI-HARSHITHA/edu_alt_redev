import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Download, FileText, BookOpen, Brain, FileSpreadsheet, Lock, Sparkles, ArrowRight, X, Compass } from "lucide-react";
import { normalizeSearch } from "../lib/search";
import { Link } from "react-router-dom";
import { auth, onAuthStateChanged, db, collection, getDocs } from "../lib/firebase";
import LoginModal from "../components/LoginModal";
import { getDriveSubfolders, getDriveDownloadUrl, getDriveFileCategory } from "../lib/drive";
import { PLATFORM_COURSES } from "../data/platformCourses";
import { AI_COURSES } from "./Courses";
import { recordLearningActivity } from "../lib/streak";

const DRIVE_FALLBACK_LINK = "https://drive.google.com/file/d/1toMlJExBP-titjEoCrn3TjKq6ToEC7rb/view";

const STATIC_RESOURCES = [
  {
    title: "AI & Machine Learning Complete Handbook",
    description: "Comprehensive notes covering Machine Learning algorithms, Neural Networks, Deep Learning concepts, and Prompt Engineering cheat sheets.",
    type: "pdf",
    category: "Artificial Intelligence",
    premium: false,
    downloads: "2.4k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "College/Engineering"
  },
  {
    title: "Full-Stack Web Development Roadmap & Code Snippets",
    description: "HTML5, CSS3, Modern JavaScript (ES6+), React.js, Node.js, and Express reference guides with code examples.",
    type: "notes",
    category: "Computer Science",
    premium: false,
    downloads: "3.1k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "General"
  },
  {
    title: "Data Structures & Algorithms Revision Sheet",
    description: "Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and Sorting algorithms with time & space complexities.",
    type: "notes",
    category: "Computer Science",
    premium: false,
    downloads: "4.8k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "College/Engineering"
  },
  {
    title: "JEE Main & Advanced Mathematics Formula Book",
    description: "Complete mathematical formula book covering Calculus, Algebra, Trigonometry, Coordinate Geometry, and Vectors.",
    type: "pdf",
    category: "Mathematics",
    premium: false,
    downloads: "5.2k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "JEE Main"
  },
  {
    title: "Physics Mechanics & Electromagnetism Problem Bank",
    description: "Solved practice question bank with step-by-step solutions for Physics concepts, numericals, and exam preparation.",
    type: "questions",
    category: "Physics",
    premium: false,
    downloads: "1.9k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "JEE Main"
  },
  {
    title: "Organic Chemistry Reactions & Mechanisms Guide",
    description: "Name reactions, mechanisms, functional group transformations, and reagent summary tables for competitive exams.",
    type: "pdf",
    category: "Chemistry",
    premium: false,
    downloads: "3.7k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "JEE Main"
  },
  {
    title: "English Grammar & Professional Writing Practice Book",
    description: "50+ exercises covering Tenses, Active/Passive Voice, Prepositions, Sentence Correction, and Business Writing.",
    type: "worksheet",
    category: "English",
    premium: false,
    downloads: "2.8k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "General"
  },
  {
    title: "SQL & Relational Database Management Guide",
    description: "Database queries, joins, indexing, normalization, transactions, and schema design with hands-on practice problems.",
    type: "notes",
    category: "Computer Science",
    premium: false,
    downloads: "1.5k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "College/Engineering"
  },
  {
    title: "Quantitative Aptitude & Logical Reasoning Workbook",
    description: "Shortcut tricks, practice worksheets, and solved examples for campus placements and competitive exams.",
    type: "worksheet",
    category: "Mathematics",
    premium: false,
    downloads: "4.1k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "General"
  },
  {
    title: "Python Programming Master Cheat Sheet & Exercises",
    description: "Syntax quick reference, data structures, object-oriented programming, and 30 beginner-to-advanced coding tasks.",
    type: "notes",
    category: "Computer Science",
    premium: false,
    downloads: "3.9k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "General"
  },
  {
    title: "Digital Marketing & SEO Strategy Checklist",
    description: "Keyword research template, social media calendar format, SEO audit checklist, and analytics tracking guide.",
    type: "worksheet",
    category: "Marketing",
    premium: true,
    downloads: "1.2k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "General"
  },
  {
    title: "UI/UX Design Systems & Figma Component Library",
    description: "Design tokens, grid systems, wireframing guidelines, and interactive UI component references.",
    type: "pdf",
    category: "Design",
    premium: true,
    downloads: "1.8k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "General"
  },
  {
    title: "GATE Computer Science & IT (CS) Complete Notes & Solved PYQs",
    description: "Comprehensive GATE CS study material covering OS, DBMS, Computer Networks, Theory of Computation, Compiler Design, and Algorithms with 15-year solved papers.",
    type: "pdf",
    category: "GATE Prep",
    premium: false,
    downloads: "6.4k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  },
  {
    title: "GATE Data Science & AI (DA) Complete Study Guide",
    description: "Official GATE DA syllabus notes: Probability, Statistics, Linear Algebra, Machine Learning, Python, and AI problem sets with step-by-step solutions.",
    type: "notes",
    category: "GATE Prep",
    premium: false,
    downloads: "5.8k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  },
  {
    title: "GATE Engineering Mathematics Formula Book & Practice Bank",
    description: "Complete GATE Engineering Mathematics handbook covering Linear Algebra, Calculus, Differential Equations, Complex Variables, and Probability for all streams.",
    type: "pdf",
    category: "GATE Prep",
    premium: false,
    downloads: "7.2k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  },
  {
    title: "GATE General Aptitude 15-Year Solved Papers & Shortcuts",
    description: "Verbal Ability, Numerical Ability, Spatial Aptitude, and Analytical Reasoning practice sheets with shortcut formulas and full explanations.",
    type: "worksheet",
    category: "GATE Prep",
    premium: false,
    downloads: "8.1k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  },
  {
    title: "GATE Electronics & Communication (ECE) Revision Handbook",
    description: "Quick revision notes for Signals & Systems, Digital Circuits, Analog Electronics, Communication Systems, and Electromagnetics.",
    type: "notes",
    category: "GATE Prep",
    premium: false,
    downloads: "4.3k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  },
  {
    title: "GATE Electrical Engineering (EE) Power Systems & Machines Guide",
    description: "In-depth notes on Power Systems, Electrical Machines, Control Systems, Power Electronics, and Circuit Theory with formula sheets.",
    type: "pdf",
    category: "GATE Prep",
    premium: false,
    downloads: "3.9k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  },
  {
    title: "GATE Mechanical Engineering (ME) Thermodynamics & Fluids Question Bank",
    description: "Solved numerical problem bank covering Thermodynamics, Fluid Mechanics, Heat Transfer, SOM, and Manufacturing Engineering.",
    type: "questions",
    category: "GATE Prep",
    premium: false,
    downloads: "4.7k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  },
  {
    title: "GATE Civil Engineering (CE) Structures & Geotechnical Handbook",
    description: "Structural Analysis, Concrete Structures, Geotechnical Engineering, Environmental Engineering, and Surveying quick revision guide.",
    type: "notes",
    category: "GATE Prep",
    premium: false,
    downloads: "3.5k",
    url: "https://drive.google.com/uc?export=download&id=1toMlJExBP-titjEoCrn3TjKq6ToEC7rb",
    viewUrl: DRIVE_FALLBACK_LINK,
    classLevel: "GATE Exam"
  }
];

const CATEGORIES = [
  "All",
  "GATE Prep",
  "Computer Science",
  "Artificial Intelligence",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Design"
];

const typeIcons = {
  pdf: <FileText className="w-5 h-5" />,
  notes: <BookOpen className="w-5 h-5" />,
  questions: <Brain className="w-5 h-5" />,
  worksheet: <FileSpreadsheet className="w-5 h-5" />
};

const typeLabels = {
  pdf: "PDF",
  notes: "Notes",
  questions: "Question Bank",
  worksheet: "Worksheet"
};

const Resources = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [firebaseResources, setFirebaseResources] = useState([]);
  const [driveResources, setDriveResources] = useState([]);
  const [, setLoadingDrive] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const snap = await getDocs(collection(db, "resources"));
        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            title: data.title || "",
            description: data.description || "",
            type: data.type || "pdf",
            category: data.category || "Computer Science",
            premium: data.premium || false,
            downloads: data.downloads || "0",
            url: data.url || "",
            viewUrl: data.viewUrl || data.url || DRIVE_FALLBACK_LINK,
            classLevel: data.class_level || "General"
          };
        });
        setFirebaseResources(items);
      } catch {
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        const folders = await getDriveSubfolders();
        const items = [];
        for (const folder of folders) {
          const category = getDriveFileCategory(folder.name);
          const folderLower = folder.name.toLowerCase();
          const isJee = folderLower.includes("jee") || folderLower.includes("iit") || folderLower.includes("jeee");
          for (const file of folder.files) {
            if (file.mimeType === "application/vnd.google-apps.folder") continue;
            const name = file.name.replace(/\.pdf$/i, "");
            const sizeLabel = file.size ? ` (${(Number(file.size) / 1024 / 1024).toFixed(1)} MB)` : "";
            const fileLower = name.toLowerCase();
            const isJeeFile = fileLower.includes("jee") || fileLower.includes("iit") || fileLower.includes("advance") || fileLower.includes("mains") || (["physics", "chemistry", "mathematics", "math"].includes(category.toLowerCase()) && (fileLower.includes("revision") || fileLower.includes("revison")));
            items.push({
              title: name,
              description: `${category} resource from Google Drive${sizeLabel}`,
              type: "pdf",
              category,
              premium: false,
              downloads: "0",
              url: file.webContentLink || getDriveDownloadUrl(file.id),
              viewUrl: file.webViewLink || getDriveDownloadUrl(file.id).replace("uc?export=download", "file/d") + "/view",
              classLevel: isJee || isJeeFile ? "JEE Main" : "College/Engineering"
            });
          }
        }
        setDriveResources(items);
      } catch (e) {
        console.error("Failed to load Drive resources", e);
      } finally {
        setLoadingDrive(false);
      }
    };
    fetchDrive();
  }, []);

  const MAPPED_PLATFORM_RESOURCES = useMemo(() => PLATFORM_COURSES.map((c, i) => ({
    title: c.title,
    description: c.description,
    type: "notes",
    category: c.folder || (c.category === "education" ? "Mathematics" : "Computer Science"),
    premium: false,
    downloads: `${(i + 1) * 350 + 1200}`,
    url: `/#/courses/pc-${i}`,
    viewUrl: `/#/courses/pc-${i}`,
    classLevel: c.classLevel || "General"
  })), []);

  const MAPPED_AI_RESOURCES = useMemo(() => (AI_COURSES || []).flatMap((provider) =>
    provider.courses.map((c, ci) => {
      const courseTitle = typeof c === "string" ? c : c.title;
      const courseUrl = typeof c === "string" ? provider.url : c.url;
      return {
        title: courseTitle,
        description: `Free industry course from ${provider.name}. Master ${courseTitle.toLowerCase()} with structured curriculum.`,
        type: "pdf",
        category: "Artificial Intelligence",
        premium: false,
        downloads: `${(ci + 1) * 180 + 850}`,
        url: courseUrl,
        viewUrl: courseUrl,
        classLevel: "All Ages"
      };
    })
  ), []);

  const allResources = useMemo(() => [
    ...STATIC_RESOURCES,
    ...MAPPED_PLATFORM_RESOURCES,
    ...MAPPED_AI_RESOURCES,
    ...firebaseResources.filter((fr) => !STATIC_RESOURCES.find((r) => r.title === fr.title)),
    ...driveResources.filter((dr) => !STATIC_RESOURCES.find((r) => r.title === dr.title) && !firebaseResources.find((fr) => fr.title === dr.title))
  ], [firebaseResources, driveResources]);

  const trackDownload = async (item) => {
    if (!auth.currentUser) return;
    recordLearningActivity(auth.currentUser, `Resource: ${item.title}`);
    try {
      await db.from("user_downloads").insert({
        user_id: auth.currentUser.uid,
        resource_title: item.title,
        resource_url: item.url || "",
        resource_type: item.type,
        downloaded_at: new Date().toISOString()
      });
    } catch (e) {
      console.error("Download track failed", e);
    }
  };

  const filtered = useMemo(() => {
    const normalizedSearch = normalizeSearch(search);
    return allResources.filter((r) => {
      const matchesCategory = activeCategory === "All" || (r.category && r.category.toLowerCase().includes(activeCategory.toLowerCase()));
      const haystack = normalizeSearch(r.title + " " + r.description + " " + (r.category || "") + " " + (r.classLevel || "") + " " + r.type + " " + (r.premium ? "premium" : "free"));
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [allResources, search, activeCategory]);

  const displayedResources = useMemo(() => {
    return !user ? filtered.slice(0, 9) : filtered;
  }, [filtered, user]);

  return (
    <>
      <Helmet>
        <title>Learning Resources | Edu Alt Tech</title>
        <link rel="canonical" href="https://www.edualttech.com/#/resources" />
      </Helmet>
      <div className="min-h-screen pt-40 md:pt-24 lg:pt-28 pb-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
              Free & Premium<br />Educational <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600">Resources</span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto font-medium text-center">
              Download free PDFs, notes, question banks, and worksheets. Premium resources available for enrolled students.
            </p>
          </motion.div>

          {/* Search & Category Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10 max-w-4xl mx-auto">
            <div className="relative max-w-xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, category, class level, or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#add8e6] outline-none text-slate-900 placeholder-slate-400 bg-white/80 shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pill Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 shadow-sm ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Resources Grid - Styled Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedResources.map((item, idx) => {
              const isBlue = idx % 2 === 0;
              const bgColor = isBlue ? "#add8e6" : "#99e6b3";

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{ backgroundColor: bgColor }}
                  className="group rounded-[2rem] p-6 text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between relative overflow-hidden border border-white/50"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center text-slate-900 shadow-sm border border-white/50">
                        {typeIcons[item.type]}
                      </div>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {item.classLevel && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/70 text-slate-900 shadow-sm border border-white/60">
                            {item.classLevel}
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/70 text-slate-900 shadow-sm border border-white/60">
                          {typeLabels[item.type]}
                        </span>
                        {item.premium && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-sm flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Premium
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug">
                      {!user ? (
                        <span onClick={() => setIsAuthModalOpen(true)} className="cursor-pointer hover:text-slate-700 transition-colors">
                          {item.title}
                        </span>
                      ) : item.viewUrl || item.url ? (
                        <a href={item.viewUrl || item.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 transition-colors">
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2 pt-4 border-t border-slate-900/10">
                    <span className="text-[11px] font-bold text-slate-700">{item.downloads} downloads</span>
                    <div className="flex gap-2">
                      {!user ? (
                        <>
                          <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                            <BookOpen className="w-3.5 h-3.5" /> View
                          </button>
                          <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </>
                      ) : (
                        <>
                          {(item.viewUrl || item.url) && (
                            <a href={item.viewUrl || item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                              <BookOpen className="w-3.5 h-3.5" /> View
                            </a>
                          )}
                          {item.url ? (
                            <a href={item.viewUrl || item.url} target="_blank" rel="noopener noreferrer" onClick={() => trackDownload(item)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                              <Download className="w-3.5 h-3.5" /> {item.premium ? "Unlock" : "Download"}
                            </a>
                          ) : (
                            <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                              <Download className="w-3.5 h-3.5" /> {item.premium ? "Unlock" : "Download"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Guest Lock Overlay */}
          {!user && filtered.length > 9 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-12 py-16 px-8 rounded-3xl bg-white/80 border border-slate-200/80 backdrop-blur-2xl text-center overflow-hidden shadow-xl"
            >
              <div className="relative z-10 max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white mb-6 shadow-xl">
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                  Unlock {filtered.length - 9} More Resources
                </h2>
                <p className="text-slate-600 mb-8 font-medium leading-relaxed text-sm sm:text-base">
                  Join our community to gain full access to all worksheets, revision notes, question banks, and learning materials.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold tracking-wide shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Unlock All Resources
                </button>
              </div>
            </motion.div>
          )}

          {displayedResources.length === 0 && (
            <div className="text-center py-20 bg-white/80 rounded-3xl border border-slate-200 mt-6">
              <p className="text-slate-500 text-base font-bold">No resources found matching your criteria.</p>
            </div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 bg-white/80 rounded-[2rem] p-8 sm:p-12 text-center border border-slate-200 shadow-sm">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">Want Access to Premium Resources?</h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto font-medium text-sm sm:text-base">Enroll in our courses to unlock premium resources, question banks, and personalized study materials.</p>
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5">
              Browse Courses <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
        <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </>
  );
};

export { STATIC_RESOURCES, Resources as default };

