import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Clock, Target, CheckCircle2, Circle, RotateCw, Zap } from "lucide-react";
import { getLearningPath, generateLearningPath, updateModuleStatus } from "../lib/learningPath";
import { auth, onAuthStateChanged } from "../lib/firebase";
import { trackActivity } from "../lib/analytics";
const CACHE_KEY = (courseId) => `roadmap_${courseId}`;
const LearningPathView = ({ courseId, courseTitle, courseDescription }) => {
  const [path, setPath] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY(courseId));
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!path);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("beginner");
  const [showSetup, setShowSetup] = useState(!path);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const existing = await getLearningPath(u.uid, courseId);
        if (existing) {
          setPath(existing);
          localStorage.setItem(CACHE_KEY(courseId), JSON.stringify(existing));
          setShowSetup(false);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [courseId]);
  const handleGenerate = useCallback(async () => {
    if (!user) return;
    setGenerating(true);
    setError("");
    try {
      const newPath = await generateLearningPath(user.uid, courseId, courseTitle, courseDescription, goal || "Complete the course", level);
      setPath(newPath);
      localStorage.setItem(CACHE_KEY(courseId), JSON.stringify(newPath));
      setShowSetup(false);
      await trackActivity(user.uid, "mentor_session", courseId, { action: "roadmap_generated", goal });
    } catch (e) {
      setError("AI generation failed. Using default roadmap.");
      const fallback = {
        id: `${user.uid}_${courseId}`,
        userId: user.uid,
        courseId,
        goal: goal || "Complete the course",
        modules: [
          { moduleId: "m1", title: "Introduction & Setup", description: "Get started with the fundamentals", order: 1, status: "pending", estimatedHours: 1 },
          { moduleId: "m2", title: "Core Concepts", description: "Learn the essential building blocks", order: 2, status: "pending", estimatedHours: 2 },
          { moduleId: "m3", title: "Hands-On Practice", description: "Apply what you learned with exercises", order: 3, status: "pending", estimatedHours: 3 },
          { moduleId: "m4", title: "Advanced Topics", description: "Deep dive into complex subjects", order: 4, status: "pending", estimatedHours: 3 },
          { moduleId: "m5", title: "Final Project", description: "Build something real to showcase your skills", order: 5, status: "pending", estimatedHours: 4 }
        ],
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        currentDifficulty: level
      };
      setPath(fallback);
      localStorage.setItem(CACHE_KEY(courseId), JSON.stringify(fallback));
      setShowSetup(false);
    } finally {
      setGenerating(false);
    }
  }, [user, courseId, courseTitle, courseDescription, goal, level]);
  const toggleModuleStatus = async (moduleId, currentStatus) => {
    if (!user || !path) return;
    const newStatus = currentStatus === "completed" ? "pending" : currentStatus === "in_progress" ? "completed" : "in_progress";
    await updateModuleStatus(user.uid, courseId, moduleId, newStatus);
    setPath((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        modules: prev.modules.map((m) => m.moduleId === moduleId ? { ...m, status: newStatus } : m)
      };
      localStorage.setItem(CACHE_KEY(courseId), JSON.stringify(updated));
      return updated;
    });
  };
  if (loading) {
    return <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-4">
          <div className="w-40 h-4 bg-slate-100 rounded-full animate-pulse" />
          <div className="w-full h-2 bg-slate-100 rounded-full animate-pulse" />
          {[1, 2, 3, 4].map((i) => <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-7 h-7 rounded-xl bg-slate-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-slate-100 rounded-full animate-pulse" />
                <div className="w-1/2 h-3 bg-slate-100 rounded-full animate-pulse" />
              </div>
            </div>)}
        </div>
      </div>;
  }
  const completedModules = path?.modules.filter((m) => m.status === "completed").length || 0;
  const totalModules = path?.modules.length || 0;
  const progressPercent = totalModules === 0 ? 0 : Math.round(completedModules / totalModules * 100);
  return <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
      <AnimatePresence mode="wait">
        {showSetup ? <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Personalized Roadmap</h3>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-6">AI will create a step-by-step learning plan tailored to your goals.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Your Learning Goal</label>
                <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Master the basics and build a project" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Current Level</label>
                <div className="flex gap-2">
                  {["beginner", "intermediate", "advanced"].map((l) => <button
    key={l}
    onClick={() => setLevel(l)}
    className={`flex-1 p-4 rounded-2xl font-bold text-sm capitalize transition-colors ${level === l ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
  >{l}</button>)}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={generating} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {generating ? "Generating..." : "Generate My Roadmap"}
              </button>
            </div>
          </motion.div> : path ? <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="p-8 border-b border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-black tracking-tight">Your Roadmap</h3>
                    {error && <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">{error}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-500 font-medium">{completedModules}/{totalModules} modules completed</p>
                    <button onClick={() => setShowSetup(true)} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 transition-colors">
                      <RotateCw className="w-3 h-3" /> Regenerate
                    </button>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {path.currentDifficulty}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div className="bg-emerald-500 h-full" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1 }} />
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {path.modules.map((mod, i) => <motion.div
    key={mod.moduleId}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05 }}
    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
    onClick={() => toggleModuleStatus(mod.moduleId, mod.status)}
  >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${mod.status === "completed" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : mod.status === "in_progress" ? "bg-emerald-500/20 text-emerald-500 border-2 border-emerald-500" : "bg-slate-100 text-slate-400"}`}>
                    {mod.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : mod.status === "in_progress" ? <Circle className="w-4 h-4" /> : <span className="text-xs font-black">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${mod.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>{mod.title}</p>
                    {mod.description && <p className="text-[10px] text-slate-400 font-medium truncate">{mod.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                    <Clock className="w-3 h-3" /> {mod.estimatedHours}h
                  </div>
                </motion.div>)}
            </div>
          </motion.div> : <div className="p-8 text-center">
            <p className="text-slate-500 font-medium">Could not load roadmap. Try generating one.</p>
            <button onClick={() => setShowSetup(true)} className="mt-4 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl">
              Generate Roadmap
            </button>
          </div>}
      </AnimatePresence>
    </div>;
};
var stdin_default = LearningPathView;
export {
  stdin_default as default
};
