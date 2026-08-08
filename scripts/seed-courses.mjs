import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zcfdapjacuwzujlvfcri.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Set SUPABASE_SERVICE_KEY env var');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const courses = [
  // AI & Tech Courses (from first table)
  { title: 'AI Tools for Students', description: 'Learn ChatGPT, Gemini, Claude, and AI productivity tools.', folder: 'Artificial Intelligence', price: 999, category: 'Artificial Intelligence', level: 'beginner', duration: '2 hours', class_level: 'General' },
  { title: 'Startup Basics for Beginners', description: 'Learn how to turn ideas into startups and validate business concepts.', folder: 'Entrepreneurship', price: 799, category: 'Entrepreneurship', level: 'beginner', duration: '2 hours', class_level: 'College/Professional' },
  { title: 'Future Careers in AI', description: 'Explore high-demand AI careers and required skills.', folder: 'Career Development', price: 599, category: 'Career Development', level: 'beginner', duration: '1.5 hours', class_level: 'Class 11-12' },
  { title: 'Personal Branding 101', description: 'Build a professional online presence and portfolio.', folder: 'Career Development', price: 699, category: 'Career Development', level: 'beginner', duration: '2 hours', class_level: 'College/Professional' },
  { title: 'Digital Marketing Essentials', description: 'Learn SEO, social media marketing, and content strategy.', folder: 'Marketing', price: 999, category: 'Marketing', level: 'beginner', duration: '3 hours', class_level: 'College/Professional' },
  { title: 'Financial Literacy for Students', description: 'Understand budgeting, saving, investing, and money management.', folder: 'Finance', price: 599, category: 'Finance', level: 'beginner', duration: '2 hours', class_level: 'Class 11-12' },
  { title: 'Design Thinking Fundamentals', description: 'Solve problems creatively using innovation frameworks.', folder: 'Innovation', price: 799, category: 'Innovation', level: 'beginner', duration: '2 hours', class_level: 'Class 11-12' },
  { title: 'Public Speaking Mastery', description: 'Improve communication, confidence, and presentation skills.', folder: 'Life Skills', price: 699, category: 'Life Skills', level: 'beginner', duration: '2 hours', class_level: 'College/Professional' },
  { title: 'LinkedIn Growth Blueprint', description: 'Build a powerful LinkedIn profile and network effectively.', folder: 'Career Development', price: 599, category: 'Career Development', level: 'beginner', duration: '1.5 hours', class_level: 'College/Professional' },
  { title: 'No-Code Website Creation', description: 'Create websites without coding using modern tools.', folder: 'Technology', price: 999, category: 'Technology', level: 'beginner', duration: '3 hours', class_level: 'College/Professional' },
  { title: 'Productivity & Time Management', description: 'Learn techniques to maximize focus and efficiency.', folder: 'Life Skills', price: 599, category: 'Life Skills', level: 'beginner', duration: '1.5 hours', class_level: 'General' },
  { title: 'Introduction to Robotics', description: 'Understand robotics basics and future applications.', folder: 'Robotics', price: 1299, category: 'Robotics', level: 'beginner', duration: '3 hours', class_level: 'Class 9-10' },
  { title: 'AI Prompt Engineering', description: 'Learn how to write effective prompts for AI systems.', folder: 'Artificial Intelligence', price: 999, category: 'Artificial Intelligence', level: 'intermediate', duration: '2 hours', class_level: 'College/Professional' },
  { title: 'Cyber Safety & Digital Security', description: 'Protect yourself online and understand cybersecurity basics.', folder: 'Cybersecurity', price: 699, category: 'Cybersecurity', level: 'beginner', duration: '2 hours', class_level: 'General' },
  { title: 'Content Creation for Beginners', description: 'Learn video creation, editing, and audience growth.', folder: 'Creator Economy', price: 999, category: 'Creator Economy', level: 'beginner', duration: '3 hours', class_level: 'General' },
  { title: 'Freelancing Fundamentals', description: 'Start earning online through freelancing platforms.', folder: 'Career Development', price: 799, category: 'Career Development', level: 'beginner', duration: '2 hours', class_level: 'College/Professional' },
  { title: 'Innovation Mindset for Students', description: 'Develop creative thinking and problem-solving abilities.', folder: 'Innovation', price: 599, category: 'Innovation', level: 'beginner', duration: '1.5 hours', class_level: 'Class 9-10' },
  { title: 'Future Technologies Explained', description: 'Learn about AI, Blockchain, Quantum Computing, and Web3.', folder: 'Future Technologies', price: 1199, category: 'Future Technologies', level: 'beginner', duration: '3 hours', class_level: 'College/Professional' },
  { title: 'Entrepreneurship for Teenagers', description: 'Build business thinking and entrepreneurial skills early.', folder: 'Entrepreneurship', price: 899, category: 'Entrepreneurship', level: 'beginner', duration: '2 hours', class_level: 'Class 11-12' },
  { title: 'Resume & Interview Mastery', description: 'Create ATS-friendly resumes and ace interviews.', folder: 'Career Development', price: 699, category: 'Career Development', level: 'beginner', duration: '2 hours', class_level: 'College/Professional' },

  // Short / Micro Courses (maths, physics, music, dance, etc.)
  { title: 'Mathematics Mastery Basics', description: 'Improve problem-solving, algebra, and logical thinking skills.', folder: 'Core Education', price: 499, category: 'Core Education', level: 'beginner', duration: '1.5 hours', class_level: 'Class 9-10' },
  { title: 'Physics Made Simple', description: 'Understand motion, energy, forces, and real-world physics concepts.', folder: 'Core Education', price: 499, category: 'Core Education', level: 'beginner', duration: '1.5 hours', class_level: 'Class 9-10' },
  { title: 'Chemistry Fundamentals', description: 'Learn atoms, reactions, and chemistry through practical examples.', folder: 'Core Education', price: 499, category: 'Core Education', level: 'beginner', duration: '1.5 hours', class_level: 'Class 9-10' },
  { title: 'Biology Explorer', description: 'Discover life sciences, human anatomy, and ecosystems.', folder: 'Core Education', price: 499, category: 'Core Education', level: 'beginner', duration: '1.5 hours', class_level: 'Class 9-10' },
  { title: 'Spoken English Essentials', description: 'Build confidence in speaking, vocabulary, and communication.', folder: 'Language Skills', price: 599, category: 'Language Skills', level: 'beginner', duration: '2 hours', class_level: 'Class 6-8' },
  { title: 'Creative Writing Basics', description: 'Learn storytelling, writing techniques, and content creation.', folder: 'Language Skills', price: 599, category: 'Language Skills', level: 'beginner', duration: '2 hours', class_level: 'Class 6-8' },
  { title: 'Keyboard for Beginners', description: 'Learn notes, chords, and simple songs on the keyboard.', folder: 'Music', price: 799, category: 'Music', level: 'beginner', duration: '3 hours', class_level: 'Class 6-8' },
  { title: 'Guitar Fundamentals', description: 'Master basic chords, strumming, and song playing.', folder: 'Music', price: 799, category: 'Music', level: 'beginner', duration: '3 hours', class_level: 'Class 6-8' },
  { title: 'Vocal Music Training', description: 'Improve singing techniques, pitch, and rhythm.', folder: 'Music', price: 699, category: 'Music', level: 'beginner', duration: '2 hours', class_level: 'Class 6-8' },
  { title: 'Classical Dance Basics', description: 'Learn fundamental dance movements and expressions.', folder: 'Dance', price: 799, category: 'Dance', level: 'beginner', duration: '3 hours', class_level: 'Class 6-8' },
  { title: 'Contemporary Dance Foundation', description: 'Build rhythm, coordination, and stage confidence.', folder: 'Dance', price: 799, category: 'Dance', level: 'beginner', duration: '3 hours', class_level: 'Class 6-8' },
  { title: 'Drawing & Sketching', description: 'Learn shading, perspective, and creative illustration.', folder: 'Arts & Creativity', price: 699, category: 'Arts & Creativity', level: 'beginner', duration: '2 hours', class_level: 'Class 6-8' },
  { title: 'Public Speaking for Students', description: 'Improve confidence and presentation skills.', folder: 'Life Skills', price: 599, category: 'Life Skills', level: 'beginner', duration: '1.5 hours', class_level: 'Class 6-8' },
  { title: 'Chess Strategy Basics', description: 'Learn openings, tactics, and strategic thinking.', folder: 'Mind Sports', price: 599, category: 'Mind Sports', level: 'beginner', duration: '2 hours', class_level: 'Class 6-8' },
  { title: 'Coding for Kids & Beginners', description: 'Learn programming concepts through fun projects.', folder: 'Technology', price: 899, category: 'Technology', level: 'beginner', duration: '3 hours', class_level: 'Class 6-8' },
  { title: 'AI Basics for Everyone', description: 'Understand AI tools and their practical applications.', folder: 'Technology', price: 999, category: 'Technology', level: 'beginner', duration: '2 hours', class_level: 'General' },
  { title: 'Financial Literacy Basics', description: 'Learn saving, budgeting, and smart money habits.', folder: 'Finance', price: 599, category: 'Finance', level: 'beginner', duration: '1.5 hours', class_level: 'Class 6-8' },
  { title: 'Entrepreneurship Starter Class', description: 'Turn ideas into business opportunities.', folder: 'Entrepreneurship', price: 799, category: 'Entrepreneurship', level: 'beginner', duration: '2 hours', class_level: 'Class 6-8' },
  { title: 'Yoga & Mindfulness', description: 'Improve focus, flexibility, and mental well-being.', folder: 'Health & Wellness', price: 599, category: 'Health & Wellness', level: 'beginner', duration: '1.5 hours', class_level: 'General' },
  { title: 'Personality Development', description: 'Build confidence, leadership, and communication skills.', folder: 'Life Skills', price: 699, category: 'Life Skills', level: 'beginner', duration: '2 hours', class_level: 'Class 9-10' },
];

const { data, error } = await supabase.from('courses').insert(courses).select('id, title');

if (error) {
  console.error('Error inserting courses:', error.message);
  process.exit(1);
}

console.log(`✅ Successfully inserted ${data.length} courses:`);
data.forEach(c => console.log(`  - ${c.title} (${c.id})`));
