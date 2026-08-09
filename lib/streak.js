import { db, doc, getDoc, setDoc } from "./firebase";

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Update Login Streak when user visits or logs in
 */
export async function updateLoginStreak(user) {
  if (!user) return { loginStreak: 0, lastLoginDate: null, isLoginToday: false };
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();

  try {
    const localDate = localStorage.getItem(`eat_login_date_${user.uid}`);
    const localStreak = Number(localStorage.getItem(`eat_login_streak_${user.uid}`)) || 0;

    let firestoreDate = null;
    let firestoreStreak = 0;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const firestoreData = userSnap.data();
        firestoreDate = firestoreData.lastLoginDate;
        firestoreStreak = firestoreData.loginStreak || 0;
      }
    } catch {
      // Firebase fallback to localStorage
    }

    const lastDate = firestoreDate || localDate;
    let currentStreak = firestoreStreak || localStreak;

    if (lastDate === todayStr) {
      if (currentStreak <= 0) currentStreak = 1;
    } else if (lastDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    localStorage.setItem(`eat_login_date_${user.uid}`, todayStr);
    localStorage.setItem(`eat_login_streak_${user.uid}`, currentStreak.toString());

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        loginStreak: currentStreak,
        lastLoginDate: todayStr,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Could not save login streak to Firestore:", e);
    }

    return { loginStreak: currentStreak, lastLoginDate: todayStr, isLoginToday: true };
  } catch (err) {
    console.error("Error updating login streak:", err);
    return { loginStreak: 1, lastLoginDate: todayStr, isLoginToday: true };
  }
}

/**
 * Record Learning Streak when user does any problem/learning activity
 */
export async function recordLearningActivity(user, activityName = "Learning Activity") {
  if (!user) return { learningStreak: 0, lastLearningDate: null, isLearningToday: false };
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();

  try {
    const localDate = localStorage.getItem(`eat_learning_date_${user.uid}`);
    const localStreak = Number(localStorage.getItem(`eat_learning_streak_${user.uid}`)) || 0;

    let firestoreDate = null;
    let firestoreStreak = 0;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        firestoreDate = data.lastLearningDate;
        firestoreStreak = data.learningStreak || 0;
      }
    } catch {
      // Firebase fallback to localStorage
    }

    const lastDate = firestoreDate || localDate;
    let currentStreak = firestoreStreak || localStreak;

    if (lastDate === todayStr) {
      if (currentStreak <= 0) currentStreak = 1;
    } else if (lastDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    localStorage.setItem(`eat_learning_date_${user.uid}`, todayStr);
    localStorage.setItem(`eat_learning_streak_${user.uid}`, currentStreak.toString());
    localStorage.setItem(`eat_last_activity_${user.uid}`, activityName);

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        learningStreak: currentStreak,
        lastLearningDate: todayStr,
        lastLearningActivity: activityName,
        lastLearningActivityTime: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Could not save learning streak to Firestore:", e);
    }

    return { learningStreak: currentStreak, lastLearningDate: todayStr, isLearningToday: true };
  } catch (err) {
    console.error("Error recording learning activity:", err);
    return { learningStreak: 1, lastLearningDate: todayStr, isLearningToday: true };
  }
}

/**
 * Get current dual streaks status for user
 */
export function getDualStreaks(userProfile, uid) {
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();

  const localLoginDate = localStorage.getItem(`eat_login_date_${uid}`);
  const localLoginStreak = Number(localStorage.getItem(`eat_login_streak_${uid}`)) || 0;

  const localLearningDate = localStorage.getItem(`eat_learning_date_${uid}`);
  const localLearningStreak = Number(localStorage.getItem(`eat_learning_streak_${uid}`)) || 0;

  const lastLoginDate = userProfile?.lastLoginDate || localLoginDate;
  let loginStreak = userProfile?.loginStreak ?? localLoginStreak;

  if (lastLoginDate && lastLoginDate !== todayStr && lastLoginDate !== yesterdayStr) {
    loginStreak = 0;
  }

  const lastLearningDate = userProfile?.lastLearningDate || localLearningDate;
  let learningStreak = userProfile?.learningStreak ?? localLearningStreak;

  if (lastLearningDate && lastLearningDate !== todayStr && lastLearningDate !== yesterdayStr) {
    learningStreak = 0;
  }

  return {
    loginStreak: Math.max(0, loginStreak),
    lastLoginDate,
    isLoginToday: lastLoginDate === todayStr,
    learningStreak: Math.max(0, learningStreak),
    lastLearningDate,
    isLearningToday: lastLearningDate === todayStr,
    lastActivity: userProfile?.lastLearningActivity || localStorage.getItem(`eat_last_activity_${uid}`) || "Problem / Study Session"
  };
}
