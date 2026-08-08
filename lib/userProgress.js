import { db, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, collection, addDoc, query, where, getDocs, orderBy, limit } from "./firebase";
import { trackActivity } from "./analytics";
const METRICS_COLLECTION = "user_metrics";
async function getOrCreateMetrics(userId, courseId, totalModules = 1) {
  const ref = doc(db, METRICS_COLLECTION, `${userId}_${courseId}`);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  const data = {
    userId,
    courseId,
    avgScore: 0,
    totalTimeSpent: 0,
    completedModules: 0,
    totalModules,
    quizAttempts: 0,
    currentDifficulty: "beginner",
    strengths: [],
    weaknesses: [],
    lastActivityAt: serverTimestamp(),
    engagementScore: 0,
    consistencyScore: 0,
    predictedDropoutRisk: "low",
    recommendations: []
  };
  await setDoc(ref, data);
  return { id: ref.id, ...data };
}
async function recordQuizAttempt(attempt) {
  const ref = await addDoc(collection(db, "quiz_attempts"), {
    ...attempt,
    completedAt: serverTimestamp()
  });
  await trackActivity(attempt.userId, "quiz_attempt", attempt.courseId, {
    score: attempt.score,
    total: attempt.totalQuestions,
    title: attempt.title
  });
  await updateMetricsFromQuiz(attempt.userId, attempt.courseId);
  return ref.id;
}
async function updateMetricsFromQuiz(userId, courseId) {
  const q = query(
    collection(db, "quiz_attempts"),
    where("userId", "==", userId),
    where("courseId", "==", courseId)
  );
  const snap = await getDocs(q);
  const attempts = snap.docs.map((d) => d.data());
  if (attempts.length === 0) return;
  const avgScore = attempts.reduce((s, a) => s + a.score / a.totalQuestions * 100, 0) / attempts.length;
  const allMistakes = [];
  const allCorrect = [];
  for (const a of attempts) {
    for (let i = 0; i < a.questions.length; i++) {
      const q2 = a.questions[i];
      const isCorrect = a.userAnswers[i] === q2?.correctAnswer;
      if (isCorrect && q2?.topic) allCorrect.push(q2.topic);
      else if (!isCorrect && q2?.topic) allMistakes.push(q2.topic);
    }
  }
  const weaknessCounts = {};
  allMistakes.forEach((t) => {
    weaknessCounts[t] = (weaknessCounts[t] || 0) + 1;
  });
  const strengthCounts = {};
  allCorrect.forEach((t) => {
    strengthCounts[t] = (strengthCounts[t] || 0) + 1;
  });
  const weaknesses = Object.entries(weaknessCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const strengths = Object.entries(strengthCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  let difficulty = "beginner";
  if (avgScore >= 75) difficulty = "advanced";
  else if (avgScore >= 50) difficulty = "intermediate";
  const ref = doc(db, METRICS_COLLECTION, `${userId}_${courseId}`);
  await updateDoc(ref, {
    avgScore,
    quizAttempts: attempts.length,
    currentDifficulty: difficulty,
    strengths,
    weaknesses,
    lastActivityAt: serverTimestamp()
  });
}
async function recordModuleComplete(userId, courseId) {
  const ref = doc(db, METRICS_COLLECTION, `${userId}_${courseId}`);
  await updateDoc(ref, {
    completedModules: increment(1),
    lastActivityAt: serverTimestamp()
  });
  await trackActivity(userId, "module_complete", courseId);
}
async function recordTimeSpent(userId, courseId, seconds) {
  const ref = doc(db, METRICS_COLLECTION, `${userId}_${courseId}`);
  await updateDoc(ref, {
    totalTimeSpent: increment(seconds),
    lastActivityAt: serverTimestamp()
  });
}
async function getUserQuizAttempts(userId, courseId) {
  try {
    const q = query(
      collection(db, "quiz_attempts"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      orderBy("completedAt", "desc"),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}
export {
  getOrCreateMetrics,
  getUserQuizAttempts,
  recordModuleComplete,
  recordQuizAttempt,
  recordTimeSpent,
  updateMetricsFromQuiz
};
