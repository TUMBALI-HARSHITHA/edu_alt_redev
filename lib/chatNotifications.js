const STORAGE_KEY_PREFIX = "chat_read_";
function getLastReadTimestamps(userId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function markCourseRead(userId, courseId) {
  const timestamps = getLastReadTimestamps(userId);
  timestamps[courseId] = (/* @__PURE__ */ new Date()).toISOString();
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(timestamps));
}
function computeUnreadCount(messages, courseId, userId) {
  const timestamps = getLastReadTimestamps(userId);
  const lastRead = timestamps[courseId];
  if (!lastRead) return messages.length;
  return messages.filter((m) => {
    const ts = m.createdAt || m.created_at || m.timestamp;
    return ts && new Date(ts).toISOString() > lastRead;
  }).length;
}
export {
  computeUnreadCount,
  getLastReadTimestamps,
  markCourseRead
};
