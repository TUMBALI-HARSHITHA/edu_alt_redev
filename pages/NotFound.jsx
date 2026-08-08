import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const NotFound = () => <div className="min-h-screen flex items-center justify-center px-6 "> <div className="text-center max-w-md">
      <div className="text-8xl font-black text-slate-200 mb-4">404</div> <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link
  to="/"
  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
>
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  </div>;
var stdin_default = NotFound;
export {
  stdin_default as default
};
