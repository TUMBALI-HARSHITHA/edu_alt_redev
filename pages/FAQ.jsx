import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const FAQ_DATA = [
  { q: "What is Edu Alt Tech?", a: "Edu Alt Tech is a skill-based learning platform that connects students, mentors, educators, and schools through practical, interactive, and career-focused learning experiences." },
  { q: "Who can use Edu Alt Tech?", a: "Anyone can use Edu Alt Tech, including school students, college students, teachers, parents, professionals, schools, and educational institutions." },
  { q: "Is Edu Alt Tech free to use?", a: "Many resources and features are free. Some premium courses, workshops, and mentorship programs may require a fee." },
  { q: "What courses do you offer?", a: "We offer courses in AI, programming, data science, cybersecurity, digital marketing, design, communication, entrepreneurship, finance, creative arts, and many other practical skills." },
  { q: "Can beginners join?", a: "Yes. Our courses are designed for beginners as well as intermediate and advanced learners." },
  { q: "Will I receive a certificate?", a: "Yes. Eligible courses and workshops include certificates upon successful completion." },
  { q: "Can I learn at my own pace?", a: "Yes. Depending on the course, you can learn through self-paced content, live sessions, or a combination of both." },
  { q: "Can students become instructors?", a: "Yes. Skilled students can apply to become peer educators after meeting our quality standards." },
  { q: "How do I enroll in a course?", a: "Simply create an account, browse available courses, and enroll in the one that matches your interests." },
  { q: "How can schools partner with Edu Alt Tech?", a: "Schools can contact our team to organize workshops, skill-development programs, career guidance sessions, and technology awareness initiatives." },
  { q: "Is my personal information secure?", a: "Yes. We take user privacy seriously and use industry-standard security practices to protect your information." },
  { q: "Can I access Edu Alt Tech on my phone?", a: "Yes. Edu Alt Tech is designed to work on desktops, tablets, and mobile devices." },
  { q: "How can I contact support?", a: "You can reach our support team through the Contact Us page or by emailing us. We aim to respond as quickly as possible." },
  { q: "How can I become a mentor?", a: "If you have expertise in a particular field, you can apply through our Mentor Registration page. Our team will review your application and get in touch." },
  { q: "Why should I choose Edu Alt Tech?", a: "Edu Alt Tech focuses on practical, project-based learning, mentorship, career readiness, and real-world skills. Our goal is to help learners build confidence, gain experience, and prepare for future opportunities." }
];
function FAQAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(null);
  return <div className="space-y-3">
      {items.map((faq, i) => {
    const isOpen = openIdx === i;
    return <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-md">
            <button
      onClick={() => setOpenIdx(isOpen ? null : i)}
      className="w-full flex items-center justify-between gap-4 p-5 text-left"
    >
              <span className="text-sm font-bold text-slate-800 leading-snug flex-1">{faq.q}</span>
              <ChevronDown
      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
    />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && <motion.div
      key="answer"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
                  <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>;
  })}
    </div>;
}
const FAQ = () => {
  const [search, setSearch] = useState("");
  const filtered = FAQ_DATA.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );
  return <div className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-full blur-[60px] pointer-events-none" /> <Link to="/" className="mb-12 inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium relative z-10 max-w-3xl mx-auto"> <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="max-w-3xl mx-auto relative z-10"
  >
        <div className="text-center mb-10"> <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200/50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-5">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Everything you need to know about Edu Alt Tech. Can't find what you're looking for? Reach out to our team.
          </p>
        </div>

        <div className="relative mb-8"> <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
    type="text"
    placeholder="Search questions..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 placeholder-slate-400"
  />
        </div>

        <FAQAccordion items={filtered} />

        {filtered.length === 0 && <p className="text-center text-slate-400 py-12 font-medium">No questions match your search.</p>} <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm font-medium"> Still have questions?{" "}
            <Link to="/contact" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors underline underline-offset-4">
              Contact our support team
            </Link>
          </p>
        </div>
      </motion.div>
    </div>;
};
var stdin_default = FAQ;
export {
  stdin_default as default
};
