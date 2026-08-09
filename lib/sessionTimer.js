import { db, doc, setDoc } from "./firebase";

const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes of no user interaction
const SYNC_INTERVAL_MS = 30 * 1000; // Sync to database every 30s

let activeSeconds = 0;
let lastInteractionTime = Date.now();
let isIdle = false;
let timerInterval = null;
let syncInterval = null;
let listenersAttached = false;

function getStorageKey(uid) {
  return uid ? `eat_session_time_${uid}` : "eat_session_time_guest";
}

function getGoalKey(uid) {
  return uid ? `eat_study_goal_${uid}` : "eat_study_goal_guest";
}

export function initGlobalSessionTimer(user) {
  const uid = user?.uid;
  const key = getStorageKey(uid);
  const storedTime = Number(sessionStorage.getItem(key)) || Number(localStorage.getItem(key)) || 0;
  activeSeconds = storedTime;

  if (!listenersAttached) {
    const handleUserActivity = () => {
      lastInteractionTime = Date.now();
      if (isIdle) {
        isIdle = false;
        notifyListeners();
      }
    };

    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });
    window.addEventListener("scroll", handleUserActivity, { passive: true });
    window.addEventListener("click", handleUserActivity, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isIdle = true;
        notifyListeners();
      } else {
        lastInteractionTime = Date.now();
        isIdle = false;
        notifyListeners();
      }
    });

    listenersAttached = true;
  }

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const now = Date.now();
    const isTabHidden = document.hidden;
    const isUserInactive = now - lastInteractionTime > IDLE_TIMEOUT_MS;

    if (!isTabHidden && !isUserInactive) {
      if (isIdle) {
        isIdle = false;
      }
      activeSeconds += 1;
      sessionStorage.setItem(key, activeSeconds.toString());
      localStorage.setItem(key, activeSeconds.toString());
      notifyListeners();
    } else {
      if (!isIdle) {
        isIdle = true;
        notifyListeners();
      }
    }
  }, 1000);

  if (syncInterval) clearInterval(syncInterval);
  if (user) {
    syncInterval = setInterval(async () => {
      if (activeSeconds > 0) {
        try {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            totalTimeSpent: activeSeconds,
            lastActiveTime: new Date().toISOString()
          }, { merge: true });
        } catch {
          // ignore
        }
      }
    }, SYNC_INTERVAL_MS);
  }
}

const listeners = new Set();
function notifyListeners() {
  const payload = {
    seconds: activeSeconds,
    isIdle,
    formatted: formatTime(activeSeconds)
  };
  listeners.forEach((fn) => fn(payload));
}

export function subscribeSessionTimer(callback) {
  listeners.add(callback);
  callback({
    seconds: activeSeconds,
    isIdle,
    formatted: formatTime(activeSeconds)
  });
  return () => listeners.delete(callback);
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
}

export function getStudyGoal(uid) {
  const key = getGoalKey(uid);
  return Number(localStorage.getItem(key)) || 60; // Default 60 mins
}

export async function setStudyGoal(user, goalMinutes) {
  const uid = user?.uid;
  const key = getGoalKey(uid);
  localStorage.setItem(key, goalMinutes.toString());

  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        studyGoalMinutes: goalMinutes
      }, { merge: true });
    } catch {
      // ignore
    }
  }
}
