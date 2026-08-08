import { db, collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit } from "./firebase";
async function trackActivity(userId, type, courseId, metadata) {
  try {
    await addDoc(collection(db, "user_activities"), {
      userId,
      type,
      courseId: courseId || null,
      metadata: metadata || {},
      timestamp: serverTimestamp()
    });
  } catch {
  }
}
async function getUserActivities(userId, max = 50) {
  try {
    const q = query(
      collection(db, "user_activities"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}
async function getCourseActivities(courseId, max = 100) {
  try {
    const q = query(
      collection(db, "user_activities"),
      where("courseId", "==", courseId),
      orderBy("timestamp", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}
export {
  getCourseActivities,
  getUserActivities,
  trackActivity
};
