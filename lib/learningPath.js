import { db, doc, setDoc, getDoc, updateDoc } from "./firebase";
import { sendAIChat } from "./ai";
import { extractJSON } from "./jsonUtils";
const PATHS_COLLECTION = "learning_paths";
async function generateLearningPath(userId, courseId, courseTitle, courseDescription, goal, currentLevel = "beginner") {
  const prompt = `Generate a personalized learning roadmap for a student taking "${courseTitle}".
Course description: ${courseDescription}
Student's goal: ${goal}
Current level: ${currentLevel}

You are a learning path designer. Return ONLY valid JSON (no markdown, no code fences) in this exact format:
{
 "modules": [
 {
 "title": "Module title",
 "description": "Brief description",
 "order": 1,
 "estimatedHours": 2,
 "prerequisites": ["prerequisite topic"],
 "topics": ["topic1", "topic2"]
 }
 ]
}
Generate 5-8 modules suitable for a ${currentLevel} learner.`;
  const res = await sendAIChat(prompt, "course");
  const parsed = extractJSON(res.content);
  let modules;
  if (parsed?.modules?.length) {
    modules = parsed.modules.map((m, i) => ({
      moduleId: `gen_${i + 1}`,
      title: m.title,
      description: m.description || "",
      order: m.order || i + 1,
      status: "pending",
      estimatedHours: m.estimatedHours || 2,
      prerequisites: m.prerequisites || [],
      topics: m.topics || []
    }));
  } else {
    modules = [
      { moduleId: "gen_1", title: "Getting Started", description: "Introduction to the course", order: 1, status: "pending", estimatedHours: 2 },
      { moduleId: "gen_2", title: "Core Concepts", description: "Fundamental topics", order: 2, status: "pending", estimatedHours: 3 },
      { moduleId: "gen_3", title: "Advanced Topics", description: "Deep dive into advanced material", order: 3, status: "pending", estimatedHours: 4 }
    ];
  }
  const pathData = {
    userId,
    courseId,
    goal,
    modules,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    currentDifficulty: currentLevel
  };
  const ref = doc(db, PATHS_COLLECTION, `${userId}_${courseId}`);
  await setDoc(ref, pathData);
  return { id: ref.id, ...pathData };
}
async function getLearningPath(userId, courseId) {
  try {
    const ref = doc(db, PATHS_COLLECTION, `${userId}_${courseId}`);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch {
    return null;
  }
}
async function updateModuleStatus(userId, courseId, moduleId, status) {
  const ref = doc(db, PATHS_COLLECTION, `${userId}_${courseId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const path = snap.data();
  const updatedModules = path.modules.map(
    (m) => m.moduleId === moduleId ? { ...m, status } : m
  );
  await updateDoc(ref, {
    modules: updatedModules,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function adaptDifficulty(userId, courseId, metrics) {
  let newLevel = metrics.currentDifficulty;
  if (metrics.avgScore >= 80 && metrics.completedModules >= 2) {
    newLevel = "advanced";
  } else if (metrics.avgScore >= 55 && metrics.completedModules >= 1) {
    newLevel = "intermediate";
  } else {
    newLevel = "beginner";
  }
  if (newLevel !== metrics.currentDifficulty) {
    const ref = doc(db, "user_metrics", `${userId}_${courseId}`);
    await updateDoc(ref, { currentDifficulty: newLevel });
  }
  return newLevel;
}
export {
  adaptDifficulty,
  generateLearningPath,
  getLearningPath,
  updateModuleStatus
};
