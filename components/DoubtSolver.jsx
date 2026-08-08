import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, Sparkles, LogIn } from "lucide-react";
import { sendAIChat } from "../lib/ai";
import { trackActivity } from "../lib/analytics";
import { auth, onAuthStateChanged } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
const DoubtSolver = ({ courseId, courseTitle, moduleTitle, context }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);
  const handleAsk = async () => {
    if (!question.trim() || loading || !currentUser) return;
    setLoading(true);
    setAnswer("");
    setAsked(false);
    const contextStr = `Course: ${courseTitle || "Unknown"}
Module: ${moduleTitle || "General"}
${context ? `Context: ${context}` : ""}`;
    try {
      const res = await sendAIChat(
        `${contextStr}

Student's doubt: ${question}

Explain clearly and concisely. Include examples if helpful.`,
        "course"
      );
      setAnswer(res.content);
      setAsked(true);
      await trackActivity(currentUser.uid, "doubt_asked", courseId, { question, moduleTitle });
    } catch (e) {
      setAnswer(`Sorry, I couldn't process your doubt: ${e.message}`);
      setAsked(true);
    } finally {
      setLoading(false);
    }
  };
  return <>
 <button
    onClick={() => setIsOpen(!isOpen)}
    className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
  >
 {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
 </button>

 <AnimatePresence>
  {isOpen && <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    className="fixed bottom-24 left-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[500px]"
  >
                {!currentUser ? <div className="p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <Bot className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Sign in to ask doubts</h3>
                    <p className="text-sm text-slate-500 mb-6">Get AI-powered explanations for your course questions</p>
                    <button
    onClick={() => {
      setIsOpen(false);
      navigate("/login");
    }}
    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
  >
                      <LogIn className="w-4 h-4" /> Sign In
                    </button>
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div> : <><div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 ">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 ">Doubt Solver</span>
                      <span className="block text-[10px] font-bold text-slate-400">{courseTitle || "AI Tutor"}</span>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

 <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[350px]">
 {!asked ? <div className="text-center py-8">
 <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
 <p className="text-sm text-slate-500 font-medium">Ask any doubt about this course. I'll explain with examples.</p>
 </div> : <div className="space-y-4">
 <div className="flex justify-end">
 <div className="max-w-[85%] p-3 bg-indigo-500 text-white rounded-2xl rounded-br-md text-sm">
 {question}
 </div>
 </div>
 <div className="flex justify-start">
 <div className="max-w-[85%] p-3 bg-slate-100 text-slate-700 rounded-2xl rounded-bl-md text-sm whitespace-pre-wrap">
 {answer}
 </div>
 </div>
 </div>}
 {loading && <div className="flex justify-start">
 <div className="bg-slate-100 rounded-2xl p-4">
 <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
 </div>
 </div>}
 </div>

 <div className="p-4 border-t border-slate-100 ">
 <div className="flex gap-2">
 <input
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") handleAsk();
    }}
    placeholder="Type your doubt..."
    disabled={loading}
    className="flex-1 p-3 bg-slate-50 rounded-2xl outline-none font-medium text-sm border border-transparent focus:border-indigo-500 transition-colors"
  />
 <button
    onClick={handleAsk}
    disabled={loading || !question.trim()}
    className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl transition-colors disabled:opacity-50"
  >
 <Send className="w-5 h-5" />
 </button>
  </div>
  </div>
        </>}
    </motion.div>}
  </AnimatePresence>
 </>;
};
var stdin_default = DoubtSolver;
export {
  stdin_default as default
};
