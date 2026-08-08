# Edu-Alt-Tech

**Bridging the execution gap through peer-to-peer teaching, mentor-guided accountability, and assistive AI.**

Edu-Alt-Tech is a full-stack alternative education platform where students learn real-world skills with real mentors. It combines structured courses, AI-powered learning assistance, practice problems, teacher management, and payment processing — all in a modern, dark-mode-capable interface.

**[Visit Live Site](https://www.edualttech.com)** | **[Dashboard](https://www.edualttech.com/dashboard)**

---

## Tech Stack

**Frontend** · React 19 · TypeScript · Vite 6 · Tailwind CSS 3 · Framer Motion · React Router 7

**Backend** · Vercel Serverless Functions (Node.js)

**Database** · Supabase (PostgreSQL) with Row-Level Security

**Auth** · Supabase Auth (email/password + Google OAuth)

**AI** · OpenRouter API (multi-model proxy)

**Payments** · Razorpay

**Email** · Resend

---

## Features

### 🎓 Learning Platform
- Course catalog with 16+ platform courses across Education and Alternative categories
- Course details with syllabus, pricing (INR), levels, and demo classes
- Virtual classroom for enrolled students
- Certificates upon completion

### 🤖 AI Assistant (Kyo Ai)
- Floating chat widget with 4 modes: General Chat, AI Mentor, Course Help, Admin Tool
- Full-page AI interface at `/ai`
- Personalized mentoring based on user progress metrics
- Course catalog-aware recommendations
- AI-generated flashcards and learning paths
- Search history for past queries

### 👨‍🏫 Teacher & Mentor System
- Teacher application and approval workflow
- Teacher panel with class scheduling, student rosters, and earnings tracking
- Recurring class scheduling with meeting links
- Course-specific community and direct chat
- Mentor-student communication

### 💰 Payments (Razorpay)
- Payment order creation and signature verification
- Trial, first-class, and full enrollment plans
- All amounts in INR

### 📝 Practice Problems
- 130+ LeetCode-style problems with video solutions
- Company tags (Amazon, Google, Microsoft, Meta, etc.)
- Difficulty levels and topic categorization
- LeetCode 150 curated set
- English exercises

### 🔐 Security
- Row-Level Security on all Supabase tables
- Rate-limited AI API (20 req/min per IP)
- Input sanitization and validation
- Content-Security-Policy headers
- HSTS, nosniff, X-Frame-Options, Permissions-Policy
- Server-side API key management (OpenRouter, Razorpay secret, Resend)

### 🎨 UI/UX
- Dark mode with persistent toggle
- Smooth scroll (Lenis) and page transitions (Framer Motion)
- Responsive design for mobile and desktop
- Toast notifications
- SEO with React Helmet and structured data

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- OpenRouter API key
- Razorpay account (optional for payments)
- Resend API key (optional for email)

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase (required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenRouter (required for AI features)
OPENROUTER_API_KEY=sk-or-v1-...
VITE_OPENROUTER_MODEL=z-ai/glm-4.5-air:free

# Razorpay (required for payments)
RAZORPAY_KEY_SECRET=your-secret
VITE_RAZORPAY_KEY_ID=rzp_live_...

# Resend (required for email)
RESEND_API_KEY=re_...
```

### Install & Run

```bash
npm install
npm run dev        # Start dev server with HMR
npm run build      # Type-check and build for production
npm run preview    # Preview production build locally
```

### Deploy to Vercel

```bash
npx vercel --prod
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Architecture

### Frontend Routing (HashRouter)

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero, features, stats |
| `/courses` | Courses | Course catalog |
| `/courses/:id` | CourseDetails | Individual course (auth required) |
| `/classroom/:id` | CourseClassroom | Virtual classroom |
| `/dashboard` | Dashboard | User dashboard |
| `/login` | Login | Sign-in |
| `/signup` | Signup | Registration |
| `/admin` | AdminDashboard | Admin panel |
| `/teacher-panel` | TeacherPanel | Teacher dashboard |
| `/practice` | Practice | Coding & English practice |
| `/ai` | AI | Full-page AI assistant |
| `/resources` | Resources | Learning resources |
| `/profile` | Profile | User profile settings |

### API Endpoints (Serverless)

| Endpoint | Purpose |
|---|---|
| `POST /api/chat` | Proxy chat to OpenRouter AI |
| `POST /api/createOrder` | Create Razorpay payment order |
| `POST /api/verifyPayment` | Verify Razorpay payment signature |
| `POST /api/send-email` | Send email via Resend |

### Database (Supabase)

Key tables: `courses`, `enrollments`, `users`, `teacher_applications`, `chat_messages`, `user_progress`, `learning_paths`, `practice_problems`, `analytics`, `notifications`, `quiz_attempts`, `user_metrics`.

All tables use Row-Level Security. A helper function `is_admin()` centralizes admin privilege checks.

---

## Project Structure

```
├── api/                  # Vercel Serverless Functions
│   ├── chat.ts
│   ├── createOrder.ts
│   ├── verifyPayment.ts
│   └── send-email.ts
├── components/           # React components
│   ├── sections/         # Home page sections
│   ├── AIAssistant.tsx   # Floating AI chat widget
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                  # Utilities and wrappers
│   ├── firebase.ts       # Supabase → Firebase-compatible API
│   ├── ai.ts             # AI client helpers
│   └── drive.ts          # Google Drive API
├── pages/                # Route page components
├── public/               # Static assets
├── supabase/             # SQL migrations
│   ├── init.sql
│   └── migration_security_rls_fix.sql
├── data/                 # Static data
├── types.ts              # TypeScript interfaces
├── vite.config.ts
├── tailwind.config.js
└── vercel.json
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + build for production |
| `npm run preview` | Preview production build |
| `node scripts/seed-courses.mjs` | Seed courses into Supabase (requires `SUPABASE_SERVICE_KEY`) |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

Private · All rights reserved.
>>>>>>> 12cc1f7 (feat: implement custom splash loader on first-load and brand blink animation on page refresh, remove hamster loader)
