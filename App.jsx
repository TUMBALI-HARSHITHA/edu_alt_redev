import { Suspense, lazy, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import AIAssistant from "./components/AIAssistant";
import SplashLoader from "./components/SplashLoader";
import { ErrorBoundary } from "./src/shared/components/ErrorBoundary";
const Home = lazy(() => import("./pages/Home"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const CourseClassroom = lazy(() => import("./pages/CourseClassroom"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Verification = lazy(() => import("./pages/Verification"));
const Services = lazy(() => import("./pages/Services"));
const Resources = lazy(() => import("./pages/Resources"));
const Practice = lazy(() => import("./pages/Practice"));
const BehaviorInsights = lazy(() => import("./pages/BehaviorInsights"));
const TeacherApplication = lazy(() => import("./pages/TeacherApplication"));
const TeacherPanel = lazy(() => import("./pages/TeacherPanel"));
const SearchHistory = lazy(() => import("./pages/SearchHistory"));
const AI = lazy(() => import("./pages/AI"));
const FAQPage = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};
const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isClassroomPath = location.pathname.startsWith("/classroom");
  const isTeacherPath = location.pathname.startsWith("/teacher-panel");
  const isAIPath = location.pathname.startsWith("/ai");
  const isHideLayout = isAdminPath || isClassroomPath || isTeacherPath || isAIPath;
  return <div className="flex flex-col min-h-screen">
 <SplashLoader />
 <Toaster position="top-right" toastOptions={{ className: " " }} />
 {!isHideLayout && <Navbar />}
  <div className="flex-grow w-full max-w-full overflow-hidden">
  <Suspense fallback={null}>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/services" element={<Services />} />
  <Route path="/resources" element={<Resources />} />
  <Route path="/courses" element={<Courses />} />
  <Route path="/courses/:courseId" element={<CourseDetails />} />
  <Route path="/classroom/:courseId" element={<CourseClassroom />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/verify" element={<Verification />} />
  <Route path="/practice" element={<Practice />} />
  <Route path="/admin/behavior" element={<BehaviorInsights />} />
  <Route path="/teacher-application" element={<TeacherApplication />} />
  <Route path="/teacher-panel" element={<TeacherPanel />} />
  <Route path="/search-history" element={<SearchHistory />} />
   <Route path="/ai" element={<AI />} />
   <Route path="/faq" element={<FAQPage />} />
   <Route path="*" element={<NotFound />} />
   </Routes>
  </Suspense>
  </div>
  {!isHideLayout && <Footer />}
  {!isHideLayout && !isAIPath && <AIAssistant />}
 </div>;
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
const App = () => {
  return <HelmetProvider>
   <QueryClientProvider client={queryClient}>
   <ErrorBoundary>
   <Router>
    <ScrollToTop />
    <AppContent />
   </Router>
   </ErrorBoundary>
   </QueryClientProvider>
   </HelmetProvider>;
};
var stdin_default = App;
export {
  stdin_default as default
};
