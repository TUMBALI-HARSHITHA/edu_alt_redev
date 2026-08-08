import { supabase } from "./supabase";
class FirebaseUserClass {
  uid;
  email;
  displayName;
  photoURL;
  emailVerified;
  metadata;
  isGoogleUser;
  constructor(su) {
    this.uid = su?.id || "";
    this.email = su?.email || null;
    this.displayName = su?.user_metadata?.display_name || su?.user_metadata?.full_name || null;
    this.photoURL = su?.user_metadata?.avatar_url || su?.user_metadata?.picture || null;
    this.emailVerified = su?.email_confirmed_at ? true : false;
    this.metadata = {};
    this.isGoogleUser = su?.app_metadata?.provider === "google";
  }
}
function createAuth() {
  const listeners = /* @__PURE__ */ new Set();
  let current = null;
  supabase.auth.getUser().then(({ data }) => {
    current = data.user ? new FirebaseUserClass(data.user) : null;
    listeners.forEach((cb) => cb(current));
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    current = session?.user ? new FirebaseUserClass(session.user) : null;
    listeners.forEach((cb) => cb(current));
  });
  return {
    get currentUser() {
      return current;
    },
    onAuthStateChanged: (cb) => {
      listeners.add(cb);
      if (current) cb(current);
      return () => {
        listeners.delete(cb);
      };
    },
    signOut: async () => {
      await supabase.auth.signOut();
    }
  };
}
const auth = createAuth();
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function convertKeys(obj, converter) {
  if (obj && typeof obj === "object" && !(obj instanceof Date) && !(obj instanceof Blob) && !Array.isArray(obj)) {
    const entries = Object.entries(obj).map(([k, v]) => [converter(k), v]);
    return Object.fromEntries(entries);
  }
  return obj;
}
function collection(_db, path, ...rest) {
  const table = [path, ...rest].join("/");
  return { type: "collection", table, filters: [], orders: [] };
}
function doc(db2, path, ...pathSegments) {
  if (arguments.length === 1 && db2?.type === "collection") {
    return { type: "document", table: db2.table, id: crypto.randomUUID(), filters: [], orders: [] };
  }
  if (arguments.length === 2 && path && path.includes("/")) {
    const parts = path.split("/");
    const id2 = parts[parts.length - 1];
    const table2 = parts.slice(0, -1).join("/");
    return { type: "document", table: table2, id: id2, filters: [], orders: [] };
  }
  let table = path;
  let id;
  if (pathSegments.length >= 2) {
    id = pathSegments[pathSegments.length - 1];
    table = [path, ...pathSegments.slice(0, -1)].join("/");
  } else {
    id = pathSegments[0] || "";
  }
  return { type: "document", table, id, filters: [], orders: [] };
}
async function getDoc(ref2) {
  const { data, error } = await supabase.from(ref2.table).select("*").eq("id", ref2.id).maybeSingle();
  if (error || !data) return { data: () => null, exists: () => false, id: ref2.id };
  const camelData = convertKeys(data, snakeToCamel);
  return { data: () => camelData, exists: () => true, id: data.id || ref2.id };
}
async function getDocs(ref2) {
  if (ref2.type === "document") {
    const snap = await getDoc(ref2);
    const docs2 = snap.exists() ? [{ data: () => snap.data(), id: snap.id }] : [];
    return { docs: docs2, forEach: (cb) => docs2.forEach(cb), empty: docs2.length === 0, size: docs2.length };
  }
  let query2 = supabase.from(ref2.table).select("*");
  for (const f of ref2.filters || []) {
    const field = camelToSnake(f.field);
    if (f.op === "==") query2 = query2.eq(field, f.value);
    else if (f.op === ">") query2 = query2.gt(field, f.value);
    else if (f.op === ">=") query2 = query2.gte(field, f.value);
    else if (f.op === "<") query2 = query2.lt(field, f.value);
    else if (f.op === "<=") query2 = query2.lte(field, f.value);
    else if (f.op === "!=") query2 = query2.neq(field, f.value);
    else if (f.op === "in") query2 = query2.in(field, f.value);
    else if (f.op === "array-contains") query2 = query2.contains(field, f.value);
  }
  for (const o of ref2.orders || []) {
    query2 = query2.order(camelToSnake(o.field), { ascending: o.dir !== "desc" });
  }
  if (ref2.limitCount) query2 = query2.limit(ref2.limitCount);
  const { data, error: _error } = await query2;
  const docs = (data || []).map((d) => ({ data: () => convertKeys(d, snakeToCamel), id: d.id }));
  return { docs, forEach: (cb) => docs.forEach(cb), empty: docs.length === 0, size: docs.length };
}
async function addDoc(ref2, data) {
  const snakeData = convertKeys(data, camelToSnake);
  const { data: inserted, error } = await supabase.from(ref2.table).insert(snakeData).select("id").single();
  if (error) throw new Error(`addDoc failed: ${error.message}`);
  return { id: inserted?.id };
}
async function setDoc(ref2, data, options) {
  const snakeData = convertKeys(data, camelToSnake);
  if (options?.merge) {
    const { data: existing } = await supabase.from(ref2.table).select("*").eq("id", ref2.id).maybeSingle();
    if (existing) {
      const merged = { ...existing, ...snakeData };
      const { error: error2 } = await supabase.from(ref2.table).upsert({ id: ref2.id, ...merged }, { onConflict: "id" });
      if (error2) throw new Error(`setDoc failed: ${error2.message}`);
      return;
    }
  }
  const { error } = await supabase.from(ref2.table).upsert({ id: ref2.id, ...snakeData }, { onConflict: "id" });
  if (error) throw new Error(`setDoc failed: ${error.message}`);
}
async function updateDoc(ref2, data) {
  const snakeData = convertKeys(data, camelToSnake);
  const { error, count } = await supabase.from(ref2.table).update(snakeData).eq("id", ref2.id).select("id", { count: "exact", head: true });
  if (error) throw new Error(`updateDoc failed: ${error.message}`);
  if (count === 0) throw new Error(`updateDoc failed: no rows matched (RLS or missing doc)`);
}
async function deleteDoc(ref2) {
  const { error } = await supabase.from(ref2.table).delete().eq("id", ref2.id);
  if (error) throw new Error(`deleteDoc failed: ${error.message}`);
}
function query(ref2, ...filters) {
  const newFilters = [];
  const newOrders = [];
  let limitCount;
  for (const f of filters) {
    if (f._field !== void 0 && f._op !== void 0) {
      newFilters.push({ field: f._field, op: f._op, value: f._value });
    } else if (f._field !== void 0 && f._dir !== void 0) {
      newOrders.push({ field: f._field, dir: f._dir });
    } else if (f._field !== void 0) {
      newOrders.push({ field: f._field, dir: "asc" });
    } else if (f._limit !== void 0) {
      limitCount = f._limit;
    }
  }
  return {
    type: "collection",
    table: ref2.table,
    filters: [...ref2.filters || [], ...newFilters],
    orders: [...ref2.orders || [], ...newOrders],
    limitCount: limitCount ?? ref2.limitCount
  };
}
function where(field, op, value) {
  return { _field: field, _op: op, _value: value };
}
function orderBy(field, dir) {
  return { _field: field, _dir: dir };
}
function limit(n) {
  return { _limit: n };
}
function serverTimestamp() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function increment(n) {
  return n;
}
function arrayUnion(...items) {
  return items;
}
function arrayRemove(...items) {
  return items;
}
function onSnapshot(ref2, onNext, onError) {
  const table = ref2.type === "document" ? ref2.table : ref2.table;
  const channel = supabase.channel(`snapshot-${table}-${Date.now()}-${Math.random()}`);
  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table },
    async () => {
      try {
        const snap = ref2.type === "document" ? await getDoc(ref2) : await getDocs(ref2);
        onNext(snap);
      } catch (e) {
        onError?.(e);
      }
    }
  ).subscribe();
  (async () => {
    try {
      const snap = ref2.type === "document" ? await getDoc(ref2) : await getDocs(ref2);
      onNext(snap);
    } catch (e) {
      onError?.(e);
    }
  })();
  return () => {
    supabase.removeChannel(channel);
  };
}
function onAuthStateChanged(_authObj, cb) {
  return auth.onAuthStateChanged(cb);
}
async function signInWithEmailAndPassword(_authObj, email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user ? new FirebaseUserClass(data.user) : null };
}
async function createUserWithEmailAndPassword(_authObj, email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { user: data.user ? new FirebaseUserClass(data.user) : null };
}
async function signOut(_authObj) {
  await supabase.auth.signOut();
}
class GoogleAuthProvider {
  static PROVIDER_ID = "google";
  constructor() {
  }
}
async function signInWithPopup(_authObj, _provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin }
  });
  if (error) throw error;
  return { user: null };
}
async function sendPasswordResetEmail(_authObj, email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
async function updateProfile(_user, profile) {
  const updates = {};
  if (profile.displayName) updates.display_name = profile.displayName;
  if (profile.photoURL) updates.avatar_url = profile.photoURL;
  const { error } = await supabase.auth.updateUser({ data: updates });
  if (error) throw error;
}
async function sendEmailVerification(_user) {
}
const EmailAuthProvider = {
  credential: (email, password) => ({ email, password })
};
async function reauthenticateWithCredential(_user, _credential) {
  const { error } = await supabase.auth.reauthenticate();
  if (error) throw error;
}
async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
function createStorage() {
  return {
    bucket: "public",
    ref: (path) => ({ path, bucket: "public" })
  };
}
const storage = createStorage();
function ref(storageObj, path) {
  if (typeof storageObj === "string") return { path: storageObj, bucket: "public" };
  return { path, bucket: storageObj.bucket || "public" };
}
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", "text/plain", "text/csv", "application/json"];
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
async function uploadBytes(storageRef, file) {
  if (file instanceof File) {
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
      throw new Error(`File type "${file.type}" is not allowed.`);
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      throw new Error(`File exceeds the maximum size of 5 MB.`);
    }
  }
  const path = storageRef.path.startsWith("/") ? storageRef.path.slice(1) : storageRef.path;
  const { error } = await supabase.storage.from(storageRef.bucket).upload(path, file, { upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return { ref: storageRef };
}
async function getDownloadURL(storageRef) {
  const path = storageRef.path.startsWith("/") ? storageRef.path.slice(1) : storageRef.path;
  const { data } = supabase.storage.from(storageRef.bucket).getPublicUrl(path);
  return data.publicUrl;
}
async function createEnrollment(enrollment) {
  const { error } = await supabase.rpc("create_enrollment", {
    p_id: enrollment.id,
    p_user_id: enrollment.userId,
    p_course_id: enrollment.courseId,
    p_role: enrollment.role || "teacher",
    p_student_status: enrollment.studentStatus || "active"
  });
  if (error) throw new Error(`createEnrollment failed: ${error.message}`);
}
const db = supabase;
export {
  EmailAuthProvider,
  FirebaseUserClass,
  GoogleAuthProvider,
  addDoc,
  arrayRemove,
  arrayUnion,
  auth,
  collection,
  createEnrollment,
  createUserWithEmailAndPassword,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  increment,
  limit,
  onAuthStateChanged,
  onSnapshot,
  orderBy,
  query,
  reauthenticateWithCredential,
  ref,
  sendEmailVerification,
  sendPasswordResetEmail,
  serverTimestamp,
  setDoc,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  storage,
  updateDoc,
  updatePassword,
  updateProfile,
  uploadBytes,
  where
};
