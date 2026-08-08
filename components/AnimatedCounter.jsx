import { useState, useEffect, useRef } from "react";
const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2e3, loop = true }) => {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const frameRef = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let loopPhase = false;
    let loopBase = 0;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * value);
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else if (loop) {
        if (!loopPhase) {
          loopPhase = true;
          loopBase = value;
        }
        const t = (now - startTime - duration) / 1200;
        const offset = Math.round(Math.sin(t * Math.PI * 2) * 0.5);
        setDisplay(loopBase + offset);
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [started, value, duration, loop]);
  return <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>;
};
var stdin_default = AnimatedCounter;
export {
  stdin_default as default
};
