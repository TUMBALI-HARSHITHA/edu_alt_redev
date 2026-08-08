import { useState } from "react";
import { Lock, Mail, Loader2, Eye, EyeOff, X, Sparkles, User, Phone } from "lucide-react";
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, doc, getDoc, setDoc, serverTimestamp, collection, getDocs, query, where } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
function LoginModal({ isOpen, onClose, title = "Sign In Required", subtitle = "Log in or create a free account to unlock full access." }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const resetState = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
    setGoogleLoading(false);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        toast.success("Successfully logged in!");
        onClose();
        resetState();
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Email or password is incorrect");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const q = query(collection(db, "users"), where("phone", "==", phone));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("Phone number is already registered. Please use another one.");
        setLoading(false);
        return;
      }
      if (!userCredential.user) {
        setError("Account creation failed. Please try again.");
        setLoading(false);
        return;
      }
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        phone,
        createdAt: serverTimestamp()
      });
      await updateProfile(userCredential.user, {
        displayName: name
      });
      try {
        await setDoc(doc(collection(db, "mail")), {
          to: email,
          message: {
            subject: "Welcome to the Edu-Alt-Tech Community! \u{1F680}",
            text: `Hi ${name},

Welcome to Edu-Alt-Tech! We're excited to have you on board. You've taken the first step towards a more disciplined and structured learning journey.

What's next?
1. Explore our high-discipline curricula.
2. Apply for mentorship or find a mentor for your target subject.
3. Track your progress daily in your personal dashboard.

We're here to support you every step of the way.

Keep building,
The Edu-Alt-Tech Team`
          }
        });
      } catch (mailErr) {
        console.error("Welcome email failed", mailErr);
      }
      toast.success("Account created successfully!");
      onClose();
      resetState();
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("User already exists. Please sign in.");
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            name: result.user.displayName || "User",
            email: result.user.email,
            photoURL: result.user.photoURL,
            createdAt: serverTimestamp()
          });
          try {
            await setDoc(doc(collection(db, "mail")), {
              to: result.user.email,
              message: {
                subject: "Welcome to the Edu-Alt-Tech Community! \u{1F680}",
                text: `Hi ${result.user.displayName || "Learner"},

Welcome to Edu-Alt-Tech! We're excited to have you on board. You've taken the first step towards a more disciplined and structured learning journey.

What's next?
1. Explore our high-discipline curricula.
2. Apply for mentorship or find a mentor for your target subject.
3. Track your progress daily in your personal dashboard.

We're here to support you every step of the way.

Keep building,
The Edu-Alt-Tech Team`
              }
            });
          } catch (mailErr) {
            console.error("Welcome email failed", mailErr);
          }
        }
        toast.success("Successfully logged in with Google!");
        onClose();
        resetState();
      }
    } catch (err) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };
  return <AnimatePresence>
 {isOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {
    /* Backdrop */
  }
 <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => {
      onClose();
      resetState();
    }}
    className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
  />

 {
    /* Modal Container */
  }
 <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 20 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="relative w-full max-w-lg bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden z-10 p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
  >
 {
    /* Close Button */
  }
 <button
    onClick={() => {
      onClose();
      resetState();
    }}
    className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
  >
 <X className="w-5 h-5" />
 </button>

 {
    /* Header */
  }
 <div className="text-center mb-8 pr-8">
 <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4">
 <Sparkles className="w-6 h-6" />
 </div>
 <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">{title}</h2>
 <p className="text-sm text-slate-500 font-semibold">{subtitle}</p>
 </div>

 {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs font-bold">
 {error}
 </div>}

 {
    /* Email form */
  }
 <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
 {mode === "signup" && <>
 <div>
 <label className="block text-xs font-black uppercase text-text-secondary tracking-wider mb-2">Full Name</label>
 <div className="relative">
 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="John Doe"
    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-colors"
  />
 </div>
 </div>
 <div>
 <label className="block text-xs font-black uppercase text-text-secondary tracking-wider mb-2">Phone</label>
 <div className="relative">
 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
    type="tel"
    required
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="+91"
    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-colors"
  />
 </div>
 </div>
 </>}

 <div>
 <label className="block text-xs font-black uppercase text-text-secondary tracking-wider mb-2">Email Address</label>
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="name@example.com"
    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-colors"
  />
 </div>
 </div>

 <div>
 <label className="block text-xs font-black uppercase text-text-secondary tracking-wider mb-2">Password</label>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
    type={showPassword ? "text" : "password"}
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full pl-12 pr-12 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-colors"
  />
 <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
  >
 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {mode === "signup" && <div>
 <label className="block text-xs font-black uppercase text-text-secondary tracking-wider mb-2">Confirm Password</label>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
    type={showConfirmPassword ? "text" : "password"}
    required
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full pl-12 pr-12 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-colors"
  />
 <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
  >
 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>}

 <button
    type="submit"
    disabled={loading || googleLoading}
    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
  >
 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? "Login" : "Create Account"}
 </button>
 </form>

 {
    /* Google Sign-in */
  }
 <div className="relative my-6">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-slate-200 " />
 </div>
 <div className="relative flex justify-center text-[10px] uppercase">
 <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">Or continue with</span>
 </div>
 </div>

 <button
    type="button"
    onClick={handleGoogleLogin}
    disabled={loading || googleLoading}
    className="w-full py-3.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm flex items-center justify-center gap-3"
  >
 {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
 <svg className="w-5 h-5" viewBox="0 0 24 24">
 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
 </svg>
 Google
 </>}
 </button>

 {
    /* Footer */
  }
 <div className="text-center pt-6 border-t border-slate-100 mt-6">
 <p className="text-slate-500 text-sm font-semibold">
 {mode === "login" ? <>
 Don't have an account?{" "}
 <button
    type="button"
    onClick={() => {
      setMode("signup");
      setError("");
    }}
    className="font-bold text-slate-900 hover:text-emerald-600 transition-colors underline underline-offset-4"
  >
 Sign Up
 </button>
 </> : <>
 Already have an account?{" "}
 <button
    type="button"
    onClick={() => {
      setMode("login");
      setError("");
    }}
    className="font-bold text-slate-900 hover:text-emerald-600 transition-colors underline underline-offset-4"
  >
 Log In
 </button>
 </>}
 </p>
 </div>
 </motion.div>
 </div>}
 </AnimatePresence>;
}
export {
  LoginModal as default
};
