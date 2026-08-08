import { useState, useEffect } from "react";
const BRAND = "EduAltTech";
const LETTER_STAGGER_MS = 120;
const HOLD_AFTER_LETTERS_MS = 1e3;
const FADE_OUT_MS = 600;
function SplashLoader() {
  const [isFirstLoad] = useState(() => {
    try {
      const loaded = sessionStorage.getItem("hasLoadedBefore");
      if (loaded === "true") {
        return false;
      }
      sessionStorage.setItem("hasLoadedBefore", "true");
      return true;
    } catch (e) {
      return true;
    }
  });
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState("typing");
  useEffect(() => {
    if (!isFirstLoad || phase !== "typing") return;
    if (visibleCount >= BRAND.length) {
      setPhase("hold");
      return;
    }
    const id = setTimeout(() => setVisibleCount((c) => c + 1), LETTER_STAGGER_MS);
    return () => clearTimeout(id);
  }, [visibleCount, phase, isFirstLoad]);
  useEffect(() => {
    if (!isFirstLoad || phase !== "hold") return;
    const id = setTimeout(() => setPhase("fadeout"), HOLD_AFTER_LETTERS_MS);
    return () => clearTimeout(id);
  }, [phase, isFirstLoad]);
  useEffect(() => {
    if (!isFirstLoad || phase !== "fadeout") return;
    const id = setTimeout(() => setPhase("done"), FADE_OUT_MS);
    return () => clearTimeout(id);
  }, [phase, isFirstLoad]);
  if (!isFirstLoad || phase === "done") {
    return null;
  }
  const isFading = phase === "fadeout";
  return <div
    className={`splash-overlay ${isFading ? "splash-overlay--fading" : ""}`}
    style={{
      transitionDuration: `${FADE_OUT_MS}ms`
    }}
  >
      <div className="splash-glow" />

      <div className="splash-brand">
        {BRAND.split("").map((char, i) => <span
    key={i}
    className={`splash-letter ${i < visibleCount ? "splash-letter--visible" : ""}`}
  >
            {char}
          </span>)}
      </div>

      <div className={`splash-progress ${phase === "typing" || phase === "hold" ? "splash-progress--active" : "splash-progress--done"}`}>
        <div className="splash-progress-bar" />
      </div>
    </div>;
}
export {
  SplashLoader as default
};
