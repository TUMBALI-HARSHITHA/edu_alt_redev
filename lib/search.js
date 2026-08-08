function normalizeSearch(term) {
  return term.trim().replace(/\s+/g, " ").toLowerCase();
}
function matchSearch(haystack, needle) {
  const h = normalizeSearch(haystack);
  const n = normalizeSearch(needle);
  return h.includes(n);
}
export {
  matchSearch,
  normalizeSearch
};
